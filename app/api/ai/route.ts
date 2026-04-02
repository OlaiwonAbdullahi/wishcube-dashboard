import { NextResponse } from "next/server";

const AI_ENDPOINT = process.env.AI_ENDPOINT || "https://api.openai.com/v1/chat/completions";
const AI_API_KEY = process.env.AI_API_KEY || "";

const MODEL_MAPPING: Record<string, string> = {
  "gpt-4o-mini": "openai/gpt-4o-mini",
  "gemini-flash": "google/gemini-2.0-flash",
};

export async function POST(request: Request) {
  try {
    const { prompt, model } = await request.json();
    const actualModel = MODEL_MAPPING[model] || "openai/gpt-4o-mini";

    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
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
