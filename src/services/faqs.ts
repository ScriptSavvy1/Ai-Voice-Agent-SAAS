import { createClient } from "@/lib/supabase/client";
import type { FAQ } from "@/types";
import type { InsertTables, UpdateTables } from "@/types/database";

const supabase = createClient();

export async function getFAQs(businessId: string): Promise<FAQ[]> {
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("business_id", businessId)
    .order("sort_order", { ascending: true });

  return data || [];
}

export async function createFAQ(
  faq: InsertTables<"faqs">
): Promise<FAQ | null> {
  const { data } = await supabase.from("faqs").insert(faq as any).select().single();

  return data;
}

export async function updateFAQ(
  id: string,
  updates: UpdateTables<"faqs">
): Promise<FAQ | null> {
  const { data } = await supabase
    .from("faqs")
    .update(updates as any)
    .eq("id", id)
    .select()
    .single();

  return data;
}

export async function deleteFAQ(id: string): Promise<boolean> {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  return !error;
}