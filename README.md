# BrainrotAI

BrainrotAI is a small web translator for moving between internet slang and clear, everyday English. It provides two explicit directions instead of treating translation as a general chat prompt.

## What it does

- Translates brainrot or internet slang into plain English.
- Translates plain English into contemporary, readable internet slang.
- Uses a Groq-hosted language model for the translation response.
- Retrieves the closest entries from a small, versioned local glossary before it reaches for a bounded Urban Dictionary fallback. A dictionary outage does not block translation.
- Includes a conversational brainrot mode and an adaptive Moss mascot that reacts to input intensity.

## Stack

- Next.js and React
- Material UI
- Groq SDK
- RapidAPI Urban Dictionary endpoint

## Local glossary and source refresh

`data/brainrot/glossary.json` is the checked-in runtime glossary. It is the fast first pass for translation context, so generated web text never silently becomes model context.

`data/brainrot/terms.json` is the seed list. To refresh review candidates from the Wiktionary REST API and the Urban Dictionary RapidAPI endpoint, run:

```bash
npm run ingest:brainrot
```

The command writes `data/brainrot/web-glossary.json`, which is intentionally ignored by Git. Review each candidate for meaning, relevance, and harmful language before manually promoting a concise entry to `glossary.json`. Ordinary profanity is retained when it matters to meaning; slurs are excluded from generated candidates and model outputs.

## Run locally

Install dependencies, then create `.env.local` with the required API credentials:

```env
GROQ_API_KEY=your_groq_key
RAPIDAPI_KEY=your_rapidapi_key
```

Start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run build
```

## Notes

- The app does not persist chat history or user accounts.
- Slang changes quickly, and dictionary entries or model responses can be incomplete or inaccurate. Treat results as a translation aid, not an authority.
- For deployment, configure `GROQ_API_KEY` and `RAPIDAPI_KEY` in the hosting provider's environment settings.
=======
# brainrotAI

