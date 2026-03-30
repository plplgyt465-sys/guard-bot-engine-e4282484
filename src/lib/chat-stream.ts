export type ChatMessage = { role: "user" | "assistant"; content: string };

const PYTHON_SERVICE_URL = "http://localhost:3001";

export async function streamChat({
  messages,
  customSystemPrompt,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMessage[];
  customSystemPrompt?: string;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    // Build context from conversation history
    const conversationContext = messages
      .slice(-4) // Last 4 messages for context
      .map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.content}`)
      .join("\n");

    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";
    
    const prompt = customSystemPrompt
      ? `${customSystemPrompt}\n\nContext:\n${conversationContext}\n\nRespond to: ${userMessage}`
      : `${conversationContext}\n\nRespond to: ${userMessage}`;

    // Call Python service
    const response = await fetch(`${PYTHON_SERVICE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      onError(errorData.error || `خطأ في الخادم: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    
    if (data.error) {
      onError(data.error);
      return;
    }

    const fullResponse = data.response || "";
    
    // Stream the response character by character for smooth display
    let charIndex = 0;
    const streamInterval = setInterval(() => {
      if (charIndex < fullResponse.length) {
        onDelta(fullResponse[charIndex]);
        charIndex++;
      } else {
        clearInterval(streamInterval);
        onDone();
      }
    }, 20); // 20ms per character for smooth streaming effect

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "فشل الاتصال بخدمة Gemini";
    onError(errorMessage);
  }
}
