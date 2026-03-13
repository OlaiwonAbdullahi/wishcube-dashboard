import { NextResponse } from "next/server";

const HACK_CLUB_AI_URL = "https://ai.hackclub.com/proxy/v1/chat/completions";
const HACK_CLUB_API_KEY =
  "sk-hc-v1-5891b4f3c19142459ee9c07ecfb5f8f700ac3765e2e84cdaacd3863cec87edea";

// Map user's "futuristic" model names to currently available ones that likely work on the proxy
const MODEL_MAPPING: Record<string, string> = {
  "google/gemini-2.5-flash": "google/gemini-2.0-flash",
  "openai/gpt-5-mini": "openai/gpt-4o-mini",
  "google/gemini-3-flash-preview": "google/gemini-2.0-flash-exp",
  "deepseek/deepseek-v3.2": "deepseek/deepseek-v3",
  "google/gemini-2.5-flash-image": "google/gemini-2.0-flash",
  "google/gemini-3.1-flash-image-preview":
    "google/gemini-3.1-flash-image-preview",
};

export async function POST(request: Request) {
  try {
    const { prompt, model } = await request.json();
    const actualModel = MODEL_MAPPING[model] || model;

    const response = await fetch(HACK_CLUB_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HACK_CLUB_API_KEY}`,
      },
      body: JSON.stringify({
        model: actualModel,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI call failed (${response.status}):`, errorText);
      return NextResponse.json(
        { error: "AI service failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      content: data.choices?.[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Error in AI route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
