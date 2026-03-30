# 🚀 Gemini AI Integration - Quick Start

## ✨ What's New?

Google Gemini AI is now the **primary AI provider** for CyberGuard AI. Unlike other providers, Gemini requires **no API keys** and has **no rate limits** on the endpoint we're using.

## 🎯 How to Use

### **Default Behavior**
Simply open the bot and start using it. Gemini is already configured and ready to go - **no setup required**.

### **Switch to Gemini Manually**
If you've been using another AI provider:
1. Click **Settings** ⚙️ (top right)
2. Click **Provider Settings** tab
3. Ensure the custom provider toggle is **OFF**
4. The bot will automatically use Gemini

### **Use Another Provider Instead**
If you want to use OpenAI, Claude, or another provider:
1. Click **Settings** ⚙️
2. Click **Provider Settings** tab
3. Toggle the custom provider switch **ON**
4. Select your preferred provider from the dropdown
5. Enter your API key(s)
6. Click **Save**

## ⚡ Features

| Feature | Gemini | Other Providers |
|---------|--------|-----------------|
| API Key Required | ❌ No | ✅ Yes |
| Rate Limits | 🚀 None | ⏰ Limited |
| Setup Time | ⚡ 0 seconds | ⏳ 5-10 minutes |
| Cost | 💰 Free | 💸 Paid |
| Unlimited Access | ✅ Yes | ❌ Limited |
| Default Provider | ✅ Yes | ❌ No |

## 🔧 Technical Details

### Gemini Integration Points

1. **Frontend** (`src/lib/`)
   - `ai-providers.ts` - Gemini provider definition (first in list)
   - `chat-stream.ts` - Default routing to Gemini
   - `gemini-provider.ts` - Gemini-specific handlers

2. **Backend** (`supabase/functions/cyber-chat/`)
   - Special Gemini endpoint handler
   - Request payload builder
   - Response parser for Gemini format

3. **UI** (`src/components/`)
   - Settings dialog defaults to Gemini
   - Provider dropdown includes Gemini

### Request/Response Flow

```
User Input
    ↓
chat-stream.ts (routes to Gemini by default)
    ↓
Supabase cyber-chat function
    ↓
buildGeminiPayload() (formats request)
    ↓
Gemini API endpoint (no auth needed)
    ↓
parseGeminiResponse() (parses response)
    ↓
Stream back to user
```

## 🛠️ Configuration Files

No configuration needed! Gemini is pre-configured and works out of the box.

However, if you want to customize:

**Default Provider** - Change in `src/components/AgentSettingsDialog.tsx`:
```typescript
setSelectedProvider("gemini");
setSelectedModel("gemini-pro");
```

**Enable for Chat** - Change in `src/lib/chat-stream.ts`:
Already configured to use Gemini as default

## ⚠️ Important Notes

⚠️ **Unofficial Endpoint**: This uses an unofficial Gemini endpoint. While it's stable, Google could change it.

⚠️ **No Function Calling**: Tool calling works by parsing text responses instead of using native function calling.

⚠️ **Best Effort**: While we aim for 100% uptime, unofficial endpoints can have availability issues.

## 🆘 Troubleshooting

### Bot isn't responding
1. Check your internet connection
2. Refresh the page
3. Try switching to another provider temporarily
4. Check browser console for errors (F12)

### Getting "Connection error"
- Gemini endpoint might be temporarily down
- Try again in a few seconds
- Switch to OpenAI/Claude as fallback

### Very slow responses
- Gemini might be under high load
- Try a shorter prompt
- Use the default model (gemini-pro)

## 📚 More Information

For detailed technical documentation, see `GEMINI_INTEGRATION.md`.

## 🎉 Summary

- ✅ Gemini is the new default AI provider
- ✅ No API keys required
- ✅ Unlimited access, no rate limits
- ✅ Automatic setup, zero configuration
- ✅ Other providers still available as fallbacks

**Start using Gemini now - it's already configured!**
