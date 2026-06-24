import { NextRequest, NextResponse } from "next/server";
import { executeTool } from "@/ai/tools";

// Executes a tool function call from Gemini and returns the result
// Called by the client when Gemini sends a functionCall message
export async function POST(req: NextRequest) {
  try {
    const { functionCall } = await req.json();

    if (!functionCall?.name || !functionCall?.args) {
      return NextResponse.json({ error: "Invalid function call" }, { status: 400 });
    }

    const result = await executeTool(functionCall.name, functionCall.args);

    return NextResponse.json({
      functionResponse: {
        name: functionCall.name,
        response: JSON.parse(result),
      },
    });
  } catch (error) {
    console.error("Tool execution error:", error);
    return NextResponse.json({ error: "Tool execution failed" }, { status: 500 });
  }
}