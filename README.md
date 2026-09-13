# BrainrotAI

BrainrotAI is a small web translator for moving between internet slang and clear, everyday English. It provides two explicit directions instead of treating translation as a general chat prompt.

## What it does

- Translates brainrot or internet slang into plain English.
- Translates plain English into contemporary, readable internet slang.
- Uses a Groq-hosted language model for the translation response.
- Optionally adds limited community-dictionary context for short brainrot inputs. A dictionary outage does not block translation.

## Stack

- Next.js and React
- Material UI
- Groq SDK
- RapidAPI Urban Dictionary endpoint

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
