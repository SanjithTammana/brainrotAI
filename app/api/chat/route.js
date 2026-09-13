import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'openai/gpt-oss-20b';

const FAST_TRANSLATION_BRIEF =
  'You are a precise, family-safe internet-slang translator. Preserve meaning, tone, and uncertainty. Do not invent lore, definitions, or context. Keep translations concise.';

const SLANG_SIGNALS = new Set([
  'aura', 'brainrot', 'cap', 'cooked', 'delulu', 'fanum', 'goated', 'gyatt', 'mog',
  'rizz', 'sigma', 'skibidi', 'sus', 'tweaking', 'unc', 'vibe', 'yap',
]);
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'for', 'from', 'has', 'have', 'i',
  'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'we', 'with', 'you',
]);

const MODES = {
  'brainrot-to-plain':
    'Translate the user\'s brainrot or internet slang into clear, natural English. Preserve the original meaning and tone. Return only the translation unless a short clarification is needed to resolve ambiguity.',
  'plain-to-brainrot':
    'Translate the user\'s plain-English message into contemporary, readable brainrot or internet slang. Preserve the original meaning and tone. Return only the translation. Do not add slurs, harassment, sexual content, or unrelated memes.',
  'brainrot-chat':
    'You are BrainrotAI in chat mode: an intentionally over-brainrotted, absurdly online conversational AI. Reply playfully in one to three short sentences, using contemporary meme language when it fits. You may reference harmless meme culture such as 6-7 or Italian brainrot, but never invent meme lore as fact. Stay comprehensible. Do not use slurs, harassment, sexual content, or hateful content.',
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function selectSemanticAnchor(message) {
  const terms = message.match(/[a-zA-Z0-9-]{2,}/g) ?? [];
  const frequency = new Map();

  for (const rawTerm of terms) {
    const term = rawTerm.toLowerCase();
    if (!STOP_WORDS.has(term)) frequency.set(term, (frequency.get(term) ?? 0) + 1);
  }

  let best = null;
  for (const [term, count] of frequency) {
    const sourceTerm = terms.find((candidate) => candidate.toLowerCase() === term) ?? term;
    const score =
      (SLANG_SIGNALS.has(term) ? 8 : 0) +
      (count > 1 ? 3 : 0) +
      (/^[A-Z0-9-]{2,}$/.test(sourceTerm) ? 2 : 0) +
      (terms.length <= 4 ? 1 : 0);
    if (!best || score > best.score) best = { term, score };
  }

  return best?.score >= 3 ? best.term : null;
}

async function getFastDictionaryContext(request, message) {
  const anchor = selectSemanticAnchor(message);
  if (!anchor) return '';

  try {
    const dictionaryResponse = await fetch(`${request.nextUrl.origin}/api/dictionary`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ term: anchor }),
      signal: AbortSignal.timeout(800),
    });
    if (!dictionaryResponse.ok) return '';

    const { definitions } = await dictionaryResponse.json();
    const definition = definitions?.reduce(
      (best, candidate) => (!best || (candidate.thumbs_up ?? 0) > (best.thumbs_up ?? 0) ? candidate : best),
      null
    );
    if (!definition?.definition) return '';

    return `\n\nDictionary reference for the semantically important term "${anchor}" only: ${definition.definition.slice(0, 360)}.`;
  } catch {
    return '';
  }
}

export async function POST(request) {
  try {
    const { message, mode = 'brainrot-to-plain' } = await request.json();

    if (typeof message !== 'string' || !message.trim()) {
      return jsonResponse({ error: 'Message content is required.' }, 400);
    }
    if (!Object.hasOwn(MODES, mode)) {
      return jsonResponse({ error: 'A valid translation direction is required.' }, 400);
    }

    const dictionaryContext =
      mode === 'brainrot-to-plain' ? await getFastDictionaryContext(request, message) : '';
    const systemPrompt = `${FAST_TRANSLATION_BRIEF}\n\n${MODES[mode]}${dictionaryContext}`;

    // Generate the chatbot's response
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: MODEL,
      temperature: 0.35,
      max_completion_tokens: 512,
    });

    const responseMessage =
      chatCompletion.choices?.[0]?.message?.content || 'No response from the model.';

    return jsonResponse({ response: responseMessage });
  } catch (error) {
    console.error('Error in chat API:', error);
    return jsonResponse({ error: 'An error occurred while processing your request.' }, 500);
  }
}
