import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, geminiToolDeclarations } from "@/ai/tools";

// Returns the Gemini session config (system prompt + tools + API key)
// The client uses this to establish a WebSocket connection to Gemini Live API
export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    // Build the dynamic system prompt from business data
    const systemPrompt = await buildSystemPrompt(businessId);

    // Return config for the client to connect
    return NextResponse.json({
      apiKey,
      model: "gemini-2.0-flash-live-001",
      systemPrompt,
      tools: [{ functionDeclarations: geminiToolDeclarations }],
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}