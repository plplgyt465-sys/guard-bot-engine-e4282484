import { supabase } from "@/integrations/supabase/client";

export type ChatMessage = { role: "user" | "assistant"; content: string };

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
    // Call Supabase Edge Function with Gemini provider
    const { data, error } = await supabase.functions.invoke("cyber-chat", {
      body: {
        messages,
        customSystemPrompt,
        customProvider: {
          providerId: "gemini",
          modelId: "gemini-pro",
          apiKey: "gemini-no-auth",
        },
      },
    });

    if (error) {
      onError(error.message || "فشل الاتصال بخدمة Gemini");
      return;
    }

    if (!data) {
      onError("لم تصل أي بيانات من الخادم");
      return;
    }

    const fullResponse = data.response || data.message || data || "";
    const responseText = typeof fullResponse === "string" ? fullResponse : JSON.stringify(fullResponse);

    // Stream the response character by character for smooth display
    let charIndex = 0;
    const streamInterval = setInterval(() => {
      if (charIndex < responseText.length) {
        onDelta(responseText[charIndex]);
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
