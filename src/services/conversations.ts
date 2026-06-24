import { createClient } from "@/lib/supabase/client";
import type { Conversation } from "@/types";
import type { InsertTables } from "@/types/database";

const supabase = createClient();

export async function getConversations(
  businessId: string
): Promise<Conversation[]> {
  const { data } = await supabase
    .from("conversations")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const { data } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function saveConversation(
  conversation: InsertTables<"conversations">
): Promise<Conversation | null> {
  const { data } = await supabase
    .from("conversations")
    .insert(conversation as any)
    .select()
    .single();

  return data;
}

export async function getConversationStats(businessId: string) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
  const twoWeeksAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).toISOString();

  // Total conversations
  const { count: total } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  // Today's conversations
  const { count: today } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", todayStart);

  // This week's conversations
  const { count: thisWeek } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", weekStart);

  // Conversations with appointments booked
  const { count: booked } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .eq("appointment_booked", true);

  // Avg duration
  const { data: convos } = await supabase
    .from("conversations")
    .select("duration_seconds")
    .eq("business_id", businessId);

  const avgDuration = convos?.length
    ? Math.round(
        convos.reduce((sum, c) => sum + c.duration_seconds, 0) / convos.length
      )
    : 0;

  // Trend data (last 14 days)
  const { data: trendData } = await supabase
    .from("conversations")
    .select("created_at")
    .eq("business_id", businessId)
    .gte("created_at", twoWeeksAgo)
    .order("created_at", { ascending: true });

  // Group by date
  const trend: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = d.toISOString().split("T")[0];
    trend[key] = 0;
  }
  trendData?.forEach((c) => {
    const key = c.created_at.split("T")[0];
    if (trend[key] !== undefined) trend[key]++;
  });

  const conversionRate = total ? Math.round(((booked || 0) / total) * 100) : 0;

  return {
    totalConversations: total || 0,
    todayConversations: today || 0,
    thisWeekConversations: thisWeek || 0,
    appointmentsBooked: booked || 0,
    conversionRate,
    avgCallDuration: avgDuration,
    callbacksRequested: 0,
    trend: Object.entries(trend).map(([date, count]) => ({ date, count })),
  };
}