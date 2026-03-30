import * as urllib from "https://deno.land/std@0.182.0/url/mod.ts";

const GEMINI_URL = "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";

const HEADERS = {
  "accept": "*/*",
  "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
  "x-same-domain": "1",
  "cookie": "",
};

interface GeminiMessage {
  role: "user" | "assistant";
  content: string;
}

function buildPayload(prompt: string): string {
  const inner = [
    [prompt, 0, null, null, null, null, 0],
    ["en-US"],
    ["", "", "", null, null, null, null, null, null, ""],
    "",
    "",
    null,
    [0],
    1,
    null,
    null,
    1,
    0,
    null,
    null,
    null,
    null,
    null,
    [[0]],
    0,
  ];

  const outer = [null, JSON.stringify(inner)];

  const params = new URLSearchParams({
    "f.req": JSON.stringify(outer),
  });

  return params.toString() + "&";
}

function parseResponse(text: string): string {
  text = text.replace(")]}'", "");
  let best = "";

  for (const line of text.split("\n")) {
    if (!line.includes("wrb.fr")) continue;

    try {
      const data = JSON.parse(line);
      const entries: any[] = [];

      if (Array.isArray(data)) {
        if (data[0] === "wrb.fr") {
          entries.push(data);
        } else {
          for (const item of data) {
            if (Array.isArray(item) && item[0] === "wrb.fr") {
              entries.push(item);
            }
          }
        }
      }

      for (const entry of entries) {
        try {
          const inner = JSON.parse(entry[2]);

          if (Array.isArray(inner) && Array.isArray(inner[4])) {
            for (const c of inner[4]) {
              if (Array.isArray(c) && Array.isArray(c[1])) {
                const txt = c[1].filter((t: any) => typeof t === "string").join("");
                if (txt.length > best.length) {
                  best = txt;
                }
              }
            }
          }
        } catch {
          continue;
        }
      }
    } catch {
      continue;
    }
  }

  return best.trim();
}

export async function geminiChat(prompt: string): Promise<string> {
  const payload = buildPayload(prompt);

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: HEADERS,
      body: payload,
    });

    if (response.status !== 200) {
      return `[ERROR ${response.status}]`;
    }

    const text = await response.text();
    const result = parseResponse(text);
    return result || "[No response]";
  } catch (error) {
    return `[Connection error: ${String(error)}]`;
  }
}

export async function streamGeminiChat(
  prompt: string,
  onDelta: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const payload = buildPayload(prompt);
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: HEADERS,
      body: payload,
    });

    if (response.status !== 200) {
      onError(`فشل الاتصال برابط Gemini: ${response.status}`);
      return;
    }

    if (!response.body) {
      onError("لا يوجد استجابة");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }

    // Parse the full response
    const result = parseResponse(fullText);
    if (result) {
      // Stream it character by character for effect
      for (const char of result) {
        onDelta(char);
        // Small delay for streaming effect
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }

    onDone();
  } catch (error) {
    onError(`خطأ في الاتصال بـ Gemini: ${String(error)}`);
  }
}
