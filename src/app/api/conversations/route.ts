import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_id, agent_id, customer_identifier, transcript, summary, sentiment, duration_seconds, language, appointment_booked } = body;

    if (!business_id) {
      return NextResponse.json({ error: "business_id is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("conversations")
      .insert({
        business_id,
        agent_id: agent_id || null,
        customer_identifier: customer_identifier || null,
        transcript: transcript || [],
        summary: summary || null,
        sentiment: sentiment || "neutral",
        duration_seconds: duration_seconds || 0,
        language: language || "so",
        appointment_booked: appointment_booked || false,
      } as any)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Conversation save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}