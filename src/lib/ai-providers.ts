// Gemini-only AI provider setup
// All AI communication goes through the Python service at http://localhost:3001

export interface AIProvider {
  id: string;
  name: string;
  nameAr: string;
  models: { id: string; name: string }[];
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    nameAr: "جوجل جيميناي - بدون حدود",
    models: [
      { id: "gemini-pro", name: "Gemini Pro (No Limits)" },
    ],
  },
];

export async function getAIProviderSettings() {
  return null; // No settings needed - always use Gemini
}

export async function saveAIProviderSettings() {
  // No settings to save
}
