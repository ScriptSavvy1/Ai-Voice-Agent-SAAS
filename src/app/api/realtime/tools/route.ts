import { NextRequest, NextResponse } from "next/server";
import { executeTool } from "@/ai/tools";

export async function POST(req: NextRequest) {
  try {
    const { toolName, args } = await req.json();

    if (!toolName || !args) {
      return NextResponse.json({ error: "toolName and args are required" }, { status: 400 });
    }

    const result = await executeTool(toolName, args);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Tool execution error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}