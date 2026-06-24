import { createClient } from "@/lib/supabase/client";
import type { Appointment } from "@/types";
import type { InsertTables } from "@/types/database";

const supabase = createClient();

export async function getAppointments(
  businessId: string,
  status?: string
): Promise<Appointment[]> {
  let query = supabase
    .from("appointments")
    .select("*")
    .eq("business_id", businessId)
    .order("date", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return (data || []) as Appointment[];
}

export async function createAppointment(
  appointment: InsertTables<"appointments">
): Promise<Appointment | null> {
  const { data } = await supabase
    .from("appointments")
    .insert(appointment as any)
    .select()
    .single();

  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled" | "completed"
): Promise<Appointment | null> {
  const { data } = await supabase
    .from("appointments")
    .update({ status } as any)
    .eq("id", id)
    .select()
    .single();

  return data;
}

export async function getAppointmentsByDate(
  businessId: string,
  date: string
): Promise<Appointment[]> {
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("business_id", businessId)
    .eq("date", date)
    .not("status", "eq", "cancelled");

  return data || [];
}