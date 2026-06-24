import { createClient } from "@/lib/supabase/client";
import type { Widget } from "@/types";
import type { UpdateTables } from "@/types/database";

const supabase = createClient();

export async function getWidget(businessId: string): Promise<Widget | null> {
  const { data } = await supabase
    .from("widgets")
    .select("*")
    .eq("business_id", businessId)
    .single();

  return data;
}

export async function updateWidget(
  id: string,
  updates: UpdateTables<"widgets">
): Promise<Widget | null> {
  const { data } = await supabase
    .from("widgets")
    .update(updates as any)
    .eq("id", id)
    .select()
    .single();

  return data;
}