# Robin Leonard Chat Backend

Simple Express.js backend for Robin Leonard's website chat widget.

## Railway Deployment

1. Create new Railway project
2. Connect this git repository
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy automatically

## Environment Variables

- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `PORT` - Server port (Railway sets this automatically)

## Endpoints

- `GET /health` - Health check
- `POST /chat` - Chat with Claude API

## Local Development

```bash
npm install
ANTHROPIC_API_KEY=your_key_here npm run dev
```