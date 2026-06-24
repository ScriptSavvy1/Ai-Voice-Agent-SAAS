import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/ai/tools";

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const instructions = await buildSystemPrompt(businessId);

    // For Gemini Live API, we don't need to create an ephemeral session token on the server
    // (though for strict production security, an intermediate proxy is recommended).
    // For this boilerplate, we return the system instructions to the client, 
    // which will initialize the @google/genai SDK directly.
    return NextResponse.json({ 
      instructions,
      model: "gemini-2.0-flash-exp",
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}