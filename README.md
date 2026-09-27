# YouTube Video Q&A

Paste any YouTube URL → ask questions → get answers with timestamped citations grounded strictly in the video transcript. No hallucination — if it's not in the video, the tool says so.

## How it works

1. User pastes a YouTube URL
2. Backend fetches the video transcript with timestamps via `youtube-transcript`
3. User asks a question — the transcript + question + chat history are sent to the LLM
4. LLM returns a structured JSON answer with inline citations and confidence level
5. Frontend renders the chat with timestamp badges the user can reference

## Why this is more than a wrapper

- **Grounded generation** — the prompt explicitly forbids outside knowledge; answers must cite timestamps
- **Hallucination detection** — `covered: false` field signals when the topic isn't in the video
- **Conversation memory** — full chat history is sent with each request for follow-up questions
- **Confidence scoring** — model self-reports high/medium/low confidence per answer

## Tech stack

- **Frontend:** React + Vite + Tailwind CSS + Lucide icons
- **Backend:** Node.js + Express
- **Transcript:** youtube-transcript (no YouTube API key needed)
- **LLM:** Groq API (openai/gpt-oss-120b)

## Setup

```bash
# Backend
cd server
npm install
cp .env.example .env   # add GROQ_API_KEY
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

## Future improvements

- Vector-embed the transcript chunks and do semantic retrieval before sending to LLM (true RAG)
- Add a transcript viewer panel with clickable timestamps
- Support playlist URLs (batch processing)
- Export Q&A session as PDF
