import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/types";
import type { InsertTables, UpdateTables } from "@/types/database";

const supabase = createClient();

export async function getServices(businessId: string): Promise<Service[]> {
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId)
    .order("sort_order", { ascending: true });

  return data || [];
}

export async function createService(
  service: InsertTables<"services">
): Promise<Service | null> {
  const { data } = await supabase
    .from("services")
    .insert(service as any)
    .select()
    .single();

  return data;
}

export async function updateService(
  id: string,
  updates: UpdateTables<"services">
): Promise<Service | null> {
  const { data } = await supabase
    .from("services")
    .update(updates as any)
    .eq("id", id)
    .select()
    .single();

  return data;
}

export async function deleteService(id: string): Promise<boolean> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  return !error;
}