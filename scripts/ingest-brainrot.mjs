import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const root = process.cwd();
const termPath = path.join(root, 'data', 'brainrot', 'terms.json');
const outputPath = path.join(root, 'data', 'brainrot', 'web-glossary.json');
// Preserve ordinary profanity: it can be essential to explaining slang. Reject material
// that would make the repository's candidate corpus reproduce slurs or targeted hate.
const DISALLOWED_CONTENT = /\b(?:nigg(?:er|a|as|ers)?|fagg(?:ot|ots)?|trann(?:y|ies)|kike|spic|chink|gook|wetback|raghead)\b/i;

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchWiktionary(term) {
  const response = await fetch(
    `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(term)}`,
    { signal: AbortSignal.timeout(5000), headers: { 'User-Agent': 'BrainrotAI glossary refresh' } }
  );
  if (!response.ok) return [];

  const body = await response.json();
  const english = body.en ?? [];
  return english.flatMap((entry) => (entry.definitions ?? []).slice(0, 2).map((definition) => ({
    term,
    aliases: [],
    definition: stripHtml(definition.definition),
    contexts: [entry.partOfSpeech ?? 'unknown'],
    example: stripHtml(definition.examples?.[0]?.example ?? ''),
    source: 'wiktionary',
    sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(term)}`,
    lastReviewed: new Date().toISOString().slice(0, 10),
  })));
}

async function fetchUrbanDictionary(term) {
  if (!process.env.RAPIDAPI_KEY) return [];

  const url = new URL('https://mashape-community-urban-dictionary.p.rapidapi.com/define');
  url.searchParams.set('term', term);
  const response = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com',
    },
  });
  if (!response.ok) return [];

  const body = await response.json();
  const top = [...(body.list ?? [])]
    .sort((a, b) => (b.thumbs_up ?? 0) - (a.thumbs_up ?? 0))
    .find((candidate) =>
      candidate.definition &&
      !DISALLOWED_CONTENT.test(candidate.definition) &&
      !DISALLOWED_CONTENT.test(candidate.example ?? '')
    );
  if (!top?.definition) return [];

  return [{
    term,
    aliases: [],
    definition: top.definition.replace(/[\[\]]/g, '').replace(/\s+/g, ' ').trim(),
    contexts: ['community slang'],
    example: (top.example ?? '').replace(/[\[\]]/g, '').replace(/\s+/g, ' ').trim(),
    source: 'urban-dictionary-candidate',
    sourceUrl: `https://www.urbandictionary.com/define.php?term=${encodeURIComponent(term)}`,
    lastReviewed: new Date().toISOString().slice(0, 10),
  }];
}

async function main() {
  const terms = JSON.parse(await fs.readFile(termPath, 'utf8'));
  const records = [];

  for (const term of terms) {
    const [wiktionary, urban] = await Promise.allSettled([fetchWiktionary(term), fetchUrbanDictionary(term)]);
    records.push(...(wiktionary.status === 'fulfilled' ? wiktionary.value : []));
    records.push(...(urban.status === 'fulfilled' ? urban.value : []));
  }

  const candidates = records.filter((record) =>
    record.definition &&
    !DISALLOWED_CONTENT.test(record.definition) &&
    !DISALLOWED_CONTENT.test(record.example ?? '')
  );
  await fs.writeFile(outputPath, `${JSON.stringify(candidates, null, 2)}\n`);
  console.log(`Wrote ${candidates.length} sourced candidate entries to ${path.relative(root, outputPath)}. Review before promoting entries into glossary.json.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
