# Livestream

An AI-powered interactive livestream app. Viewers send chat messages that are summarized by an LLM every 10 seconds, and the resulting prompt drives a real-time AI video stream powered by [Odyssey](https://odyssey.ml).
Project submission for Team 16 in [Oddysey 2 Pro Hackathon](https://luma.com/xt4k5374).

## How It Works

```
User sends chat message
  → Server buffers messages
  → Every 10s: Fireworks AI summarizes the chat into a scene prompt
  → Prompt is sent to Odyssey via interact()
  → AI video stream updates in real time
```

The video starts with a default scene ("football touchdown at a stadium") and evolves based on what viewers type in chat.

## Architecture

This is a [Turborepo](https://turbo.build/repo) monorepo with:

| Package | Description |
|---------|-------------|
| `apps/web` | React + Vite frontend — Odyssey video player + Twitch-style chat panel |
| `apps/api` | Express + Socket.IO server — message buffering, AI summarization, tick sync |
| `packages/types` | Shared TypeScript types (`Message`) |
| `packages/eslint-config` | Shared ESLint configuration |
| `packages/typescript-config` | Shared `tsconfig.json` presets |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+)

## Setup

1. **Install dependencies:**

   ```sh
   pnpm install
   ```

2. **Configure environment variables:**

   ```sh
   # apps/api/.env
   OPENAI_API_KEY=""       # Fireworks AI API key

   # apps/web/.env
   VITE_ODDYSEY_API_KEY="" # Odyssey API key
   ```

   Copy from the `.env.example` files in each app directory.

3. **Start development servers:**

   ```sh
   pnpm dev
   ```

   This starts both the API server (port 3001) and the Vite dev server (port 5173).

4. **Open the app:**

   Visit [http://localhost:5173](http://localhost:5173)

## Usage

- The video stream starts automatically on page load
- Type messages in the chat panel on the right
- Every 15 seconds, the server summarizes recent chat messages into a prompt
- The prompt is sent to Odyssey to update the video stream
- A countdown bar above the chat shows time until the next summary
- Generated prompts appear in chat as system messages (italic, with a purple left border)
