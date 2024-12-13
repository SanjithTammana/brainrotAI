import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Read the base system prompt from the file
const SYSTEM_PROMPT_PATH = path.resolve('System_Prompt.txt');
let BASE_SYSTEM_PROMPT = '';

try {
  BASE_SYSTEM_PROMPT = fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8').trim();
} catch (error) {
  console.error('Failed to read the system prompt file:', error);
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message content is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Construct the full URL for the internal dictionary API call
    const dictionaryApiUrl = `${request.nextUrl.origin}/api/dictionary`;

    // Fetch the definition from the Urban Dictionary API
    const dictionaryResponse = await fetch(dictionaryApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: message }),
    });

    const { definitions } = await dictionaryResponse.json();

    // Sort definitions by thumbs_up in descending order to get the top upvoted definition
    const topDefinition = definitions?.sort((a, b) => b.thumbs_up - a.thumbs_up)[0];

    // Append the top definition to the base system prompt
    let systemPrompt = BASE_SYSTEM_PROMPT;
    if (topDefinition) {
      systemPrompt += `\n\nUrban Dictionary defines "${message}" as: ${topDefinition.definition}`;
    }

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
      model: 'llama3-8b-8192',
    });

    const responseMessage =
      chatCompletion.choices?.[0]?.message?.content || 'No response from the model.';

    return new Response(JSON.stringify({ response: responseMessage }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
