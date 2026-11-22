# Kareem Taha, portfolio

Personal portfolio of Kareem Taha, full-stack software engineer in Cairo.

**Features**
- 3D hero scene (three.js) and a drag-to-spin 3D skills sphere
- Project filters, live GitHub activity feed, light and dark themes
- **Kareem bot**: a chat assistant that answers questions about Kareem, powered by Claude, with an offline fallback

**Stack:** Next.js 15 (App Router), React 19, TypeScript, three.js, Anthropic SDK

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Kareem bot

Without configuration the bot answers from a built-in knowledge base (`lib/bot.ts`).
To turn on AI answers, set an Anthropic API key:

```bash
# .env.local (never commit this file)
ANTHROPIC_API_KEY=your-key
```

On Vercel, add `ANTHROPIC_API_KEY` under Project Settings → Environment Variables.

## Editing content

All page text lives in `lib/content.ts`. The bot reads from the same file, so it stays in sync.
