import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Tables } from "@/types/database";

type BusinessRow = Tables<"businesses">;
type AgentRow = Tables<"agents">;
type ServiceRow = Tables<"services">;
type WidgetRow = Tables<"widgets">;

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get("businessId");
  if (!businessId) {
    return NextResponse.json({ error: "businessId is required" }, { status: 400 });
  }

  const { data: businessData } = await supabaseAdmin.from("businesses").select("*").eq("id", businessId).single();
  const { data: agentData } = await supabaseAdmin.from("agents").select("*").eq("business_id", businessId).eq("is_active", true).single();
  const { data: servicesData } = await supabaseAdmin.from("services").select("*").eq("business_id", businessId).eq("is_active", true);
  const { data: widgetData } = await supabaseAdmin.from("widgets").select("*").eq("business_id", businessId).eq("is_active", true).single();

  const business = businessData as BusinessRow | null;
  const widget = widgetData as WidgetRow | null;

  if (!business || !widget) {
    return NextResponse.json({ error: "Business or widget not found" }, { status: 404 });
  }

  return NextResponse.json({
    business,
    agent: agentData as AgentRow | null,
    services: (servicesData as ServiceRow[] | null) || [],
    widget,
  });
}