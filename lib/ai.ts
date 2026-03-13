export type AIModel =
  | "google/gemini-2.0-flash"
  | "openai/gpt-4o-mini"
  | "google/gemini-2.0-flash-exp"
  | "deepseek/deepseek-v3"
  | "google/gemini-2.0-flash-image"
  | "google/gemini-2.5-flash"
  | "openai/gpt-5-mini"
  | "google/gemini-3-flash-preview"
  | "deepseek/deepseek-v3.2"
  | "google/gemini-2.5-flash-image";

export async function callAI(prompt: string, model: string) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Local AI proxy call failed (${response.status}):`,
        errorText
      );
      throw new Error(`AI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content || "";
  } catch (error) {
    console.error("Error in AI service client:", error);
    throw error;
  }
}
