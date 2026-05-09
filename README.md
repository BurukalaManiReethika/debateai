# ⚔️ DebateAI

Two Claude AI instances argue opposite sides of any topic in real time. You be the judge.

![DebateAI Demo](https://placehold.co/800x400?text=DebateAI+Demo+GIF)

## Features

- 🤖 Two AI personas (Alex & Jordan) powered by Claude API
- 🔴🟢 PRO vs CON structured debate — Opening, Rebuttal, Closing
- ⚡ Real-time streaming via Server-Sent Events
- 🗳️ Live voting + scoreboard
- 🕘 Debate history saved to localStorage
- 📱 Fully responsive

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Streaming | Server-Sent Events (SSE) |

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/yourusername/debateai.git
cd debateai
npm run install:all
```

### 2. Set up environment
```bash
cp server/.env.example server/.env
# Add your ANTHROPIC_API_KEY to server/.env
```

Get your API key at https://console.anthropic.com

### 3. Run locally
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure

```
debateai/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Claude API service
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── package.json             # Root scripts
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/debate/start` | Kick off a new debate |
| GET | `/api/debate/stream/:id` | SSE stream for live argument |
| GET | `/api/debate/history` | Recent debates |

## Deploy

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```

### Railway
```bash
railway init
railway up
```

## Contributing

PRs welcome! Open an issue first for big changes.

## License

MIT
