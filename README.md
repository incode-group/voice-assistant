# Incode Group Voice Assistant

AI-powered voice assistant for the Incode Group website. Helps visitors learn about services and book discovery calls via voice.

## Tech Stack

- **Next.js 15** — App Router, API Routes
- **Vapi AI** — voice assistant, speech-to-text, Google Calendar integration
- **Zustand** — client state management
- **Tailwind CSS** — styling

## Features

- Voice conversation with AI assistant
- Knowledge base from Incode Group website (auto-synced)
- Discovery call booking via Google Calendar
- Timezone-aware scheduling

## Getting Started
```bash
npm install
cp .env.example .env.local
# Fill in your credentials in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Vapi public key from Dashboard |
| `VAPI_PRIVATE_KEY` | Vapi private key for server API calls |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Vapi assistant ID |
| `GEMINI_API_KEY` | API key for Google Gemini (title generation) |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly booking page URL |
| `SYNC_SECRET` | Secret for /api/sync-knowledge endpoint |
| `SCRAPING_ROBOT_TOKEN` | Scraping Robot API token for KB sync |
| `NEXT_PUBLIC_APP_URL` | Production URL |

## Project Structure
```
src/
├── app/                  # Next.js App Router pages and API routes
├── entities/             # Core types (message, etc.)
├── features/
│   ├── booking/          # Email input, booking store
│   ├── chat-transcript/  # Transcript panel and store
│   └── voice-agent/      # Vapi session, voice controls, orb
├── shared/
│   ├── config/           # Constants
│   └── lib/              # Vapi client, scraper, cron
└── widgets/              # AssistantLayout
```

## Knowledge Base Sync

The assistant's knowledge base is auto-synced from the Incode Group website on a weekly schedule via cron. Manual sync:
```bash
curl -X POST https://your-domain.com/api/sync-knowledge \
  -H "x-sync-secret: YOUR_SYNC_SECRET"
```

## Deployment
```bash
git pull
npm install
npm run build
pm2 restart voice-assistant
```