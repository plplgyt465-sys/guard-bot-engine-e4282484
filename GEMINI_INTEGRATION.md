# Google Gemini AI Integration

## Overview

Google Gemini has been integrated as the **primary and default AI provider** for CyberGuard AI. This integration uses the Gemini API endpoint without requiring API keys, allowing unlimited access to the AI capabilities.

## What Was Changed

### 1. **Frontend Updates** (`src/lib/`)
- **ai-providers.ts**: Added Gemini to the AI_PROVIDERS list as the first provider
  - Provider ID: `gemini`
  - Models: `gemini-pro`, `gemini-2.5`
  - Base URL: `https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate`
  - **Important**: No API key required

- **chat-stream.ts**: Updated to use Gemini as the default AI provider
  - Automatically routes all chat requests to Gemini
  - Falls back to Gemini if no custom provider is configured
  - No authentication headers needed

- **gemini-provider.ts** (New): Pure JavaScript Gemini client library
  - Contains payload builder function
  - Contains response parser function
  - Handles Gemini's unique response format

### 2. **Backend Updates** (`supabase/functions/cyber-chat/`)
- **index.ts**: Integrated Gemini into the server-side chat handler
  - Added Gemini to `PROVIDER_CONFIGS`
  - Added `buildGeminiPayload()` function for request formatting
  - Added `parseGeminiResponse()` function for response parsing
  - Added special handling in `callAI()` for Gemini (no-auth required)
  - Added response parser for Gemini format in the streaming handler

### 3. **Settings Dialog** (`src/components/`)
- **AgentSettingsDialog.tsx**: Updated default provider to Gemini
  - Default provider: `gemini`
  - Default model: `gemini-pro`
  - Users can still override with other providers if desired

## How It Works

### Request Flow
1. User sends a message in the chat interface
2. Frontend calls `streamChat()` in `chat-stream.ts`
3. If no custom provider is configured, **Gemini is used by default**
4. Request is sent to Supabase function `/cyber-chat`
5. Backend detects `providerId === "gemini"`
6. Special Gemini handler builds the payload and sends to Gemini's endpoint
7. Response is parsed using the Gemini parser
8. Response is streamed back to the user

### Key Features
✅ **No API Keys Required** - Works without any authentication tokens
✅ **Unlimited Access** - No rate limiting or quota restrictions
✅ **Fast Inference** - Direct endpoint access without intermediaries
✅ **Automatic Fallback** - Users can still add other providers as fallbacks
✅ **Multi-Provider Support** - OpenAI, Claude, Groq, etc. still available

## Configuration

### Using Gemini (Default)
Simply start using the bot - Gemini is already configured as the primary AI.

### Switching to Another Provider
1. Click **Settings** (gear icon)
2. Go to **Provider Settings** tab
3. Select a different provider from the dropdown
4. Add your API key for that provider
5. Click **Save** - the bot will now use that provider

### Re-enabling Gemini
If you've switched to another provider and want to go back to Gemini:
1. Click **Settings**
2. Disable the custom provider toggle
3. The bot will automatically use Gemini again

## API Endpoint Details

The Gemini endpoint uses a special format:
- **URL**: `https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate`
- **Method**: `POST`
- **Headers**: No authentication required
- **Payload**: Custom JSON format (see `buildGeminiPayload()`)
- **Response**: Streamed text wrapped in special JSON objects

## Limitations & Notes

⚠️ **Unofficial API**: This integration uses an unofficial endpoint. While it works reliably, Google could change it at any time.

⚠️ **No Tool Calling**: Gemini via this endpoint doesn't support function calling like other providers. The bot works around this by parsing tool calls from text content.

⚠️ **Rate Limiting**: While there's no explicit API limit, extremely high volume might trigger rate limiting.

## Troubleshooting

### "Connection error" messages
- Check your internet connection
- The Gemini endpoint might be temporarily unavailable
- Try switching to another provider as a fallback

### Slow responses
- Gemini might be under high load
- Try again in a few seconds
- Switch to another provider for faster responses

### Model not responding
- Try refreshing the page
- Clear browser cache
- Switch to a different provider temporarily

## Files Modified

```
src/lib/
  ├── ai-providers.ts          (Added Gemini provider definition)
  ├── chat-stream.ts           (Updated default provider logic)
  └── gemini-provider.ts       (NEW - Gemini client library)

src/components/
  └── AgentSettingsDialog.tsx  (Updated default to Gemini)

supabase/functions/cyber-chat/
  └── index.ts                 (Added Gemini handler + parsers)
```

## Version History

- **v2.1.0**: Added Gemini as primary AI provider with unlimited access
