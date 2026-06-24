import { createClient } from "@/lib/supabase/client";
import type { Agent } from "@/types";
import type { UpdateTables } from "@/types/database";

const supabase = createClient();

export async function getAgent(businessId: string): Promise<Agent | null> {
  const { data } = await supabase
    .from("agents")
    .select("*")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .single();

  return data;
}

export async function getAgents(businessId: string): Promise<Agent[]> {
  const { data } = await supabase
    .from("agents")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function updateAgent(
  id: string,
  updates: UpdateTables<"agents">
): Promise<Agent | null> {
  const { data } = await supabase
    .from("agents")
    .update(updates as any)
    .eq("id", id)
    .select()
    .single();

  return data;
}