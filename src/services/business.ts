import { createClient } from "@/lib/supabase/client";
import type { Business } from "@/types";
import type { UpdateTables } from "@/types/database";

const supabase = createClient();

export async function getBusiness(): Promise<Business | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  return data;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function updateBusiness(
  id: string,
  updates: UpdateTables<"businesses">
): Promise<Business | null> {
  const { data } = await supabase
    .from("businesses")
    .update(updates as any)
    .eq("id", id)
    .select()
    .single();

  return data;
}