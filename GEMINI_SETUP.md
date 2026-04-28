# CyberGuard AI - Gemini Integration Setup

This project uses **Google Gemini AI** as the ONLY AI provider, with NO API keys required and NO rate limits.

## Architecture

- **Frontend**: React + TypeScript (connects to Python service)
- **Backend**: Python HTTP server (handles Gemini API calls)
- **AI Service**: Google Gemini (runs on Python)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the System

**Option A: Using the startup script (Recommended)**

```bash
chmod +x start.sh
./start.sh
```

**Option B: Manual startup**

```bash
# Terminal 1: Start Python Gemini Service
python3 scripts/gemini_service.py 3001

# Terminal 2: Start frontend
npm run dev
```

## How It Works

1. **User sends a message** via the chat interface
2. **Frontend sends** the message to `http://localhost:3001/ask`
3. **Python service** builds the payload using the exact format from `config.yaml`
4. **Gemini API** processes the request
5. **Response** is parsed and returned to the frontend
6. **Message** is displayed in the chat

## No Configuration Needed

- No API keys to manage
- No authentication required
- No rate limits
- Works completely offline for the service setup
- Connects directly to Gemini servers

## File Structure

```
scripts/
├── gemini_service.py       # Python HTTP server for Gemini
src/
├── lib/
│   ├── chat-stream.ts      # Simplified to call Python service only
│   └── ai-providers.ts     # Minimal config (Gemini only)
├── pages/
│   └── Index.tsx           # Removed AgentSettingsDialog
```

## Testing

Once running, open `http://localhost:5173` and try asking questions. The bot will respond using Gemini AI.

## Troubleshooting

**Port already in use?**
```bash
python3 scripts/gemini_service.py 3002  # Use different port
```

Then update `PYTHON_SERVICE_URL` in `src/lib/chat-stream.ts` to the new port.

**Python not found?**
Make sure Python 3.6+ is installed:
```bash
python3 --version
```

**Requests library missing?**
```bash
pip install requests
```

## Environment

No `.env` file needed. The system is designed to work out-of-the-box!
