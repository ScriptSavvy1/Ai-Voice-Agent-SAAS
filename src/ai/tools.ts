import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_SOMALI_SYSTEM_PROMPT } from "@/constants";
import type { Tables } from "@/types/database";

// ─── Row Type Aliases ────────────────────────────────────────
type ServiceRow = Tables<"services">;
type FAQRow = Tables<"faqs">;
type BusinessRow = Tables<"businesses">;
type AppointmentRow = Tables<"appointments">;

// ─── Tool Definitions for Gemini Live API ────────────────────

export const geminiToolDeclarations = [
  {
    name: "lookup_services",
    description: "Look up the list of services this business offers, including prices and durations. Call this when a customer asks about available services, pricing, or what the business does.",
    parameters: {
      type: "OBJECT" as const,
      properties: {
        business_id: { type: "STRING" as const, description: "The business ID" },
      },
      required: ["business_id"],
    },
  },
  {
    name: "lookup_faqs",
    description: "Search frequently asked questions for this business. Call this when a customer asks a general question about the business, policies, or procedures.",
    parameters: {
      type: "OBJECT" as const,
      properties: {
        business_id: { type: "STRING" as const, description: "The business ID" },
        query: { type: "STRING" as const, description: "The customer's question" },
      },
      required: ["business_id"],
    },
  },
  {
    name: "get_business_info",
    description: "Get business details like name, address, phone, email, and description. Call this when a customer asks for contact info, location, or general business details.",
    parameters: {
      type: "OBJECT" as const,
      properties: {
        business_id: { type: "STRING" as const, description: "The business ID" },
      },
      required: ["business_id"],
    },
  },
  {
    name: "get_business_hours",
    description: "Get business operating hours. Call this when a customer asks about opening/closing times or whether the business is open.",
    parameters: {
      type: "OBJECT" as const,
      properties: {
        business_id: { type: "STRING" as const, description: "The business ID" },
      },
      required: ["business_id"],
    },
  },
  {
    name: "check_availability",
    description: "Check available appointment time slots for a specific date. Call this when a customer wants to book an appointment and needs to know available times.",
    parameters: {
      type: "OBJECT" as const,
      properties: {
        business_id: { type: "STRING" as const, description: "The business ID" },
        date: { type: "STRING" as const, description: "The date to check in YYYY-MM-DD format" },
      },
      required: ["business_id", "date"],
    },
  },
  {
    name: "book_appointment",
    description: "Book an appointment for a customer. Call this when the customer confirms they want to book at a specific date and time. You must have their name and the date/time before calling this.",
    parameters: {
      type: "OBJECT" as const,
      properties: {
        business_id: { type: "STRING" as const, description: "The business ID" },
        customer_name: { type: "STRING" as const, description: "Customer's full name" },
        customer_phone: { type: "STRING" as const, description: "Customer's phone number (optional)" },
        date: { type: "STRING" as const, description: "Appointment date in YYYY-MM-DD format" },
        time_slot: { type: "STRING" as const, description: "Appointment time like '10:00 AM'" },
        service_id: { type: "STRING" as const, description: "The service ID if specified (optional)" },
        notes: { type: "STRING" as const, description: "Any additional notes" },
      },
      required: ["business_id", "customer_name", "date", "time_slot"],
    },
  },
];

// ─── Tool Execution ──────────────────────────────────────────

export async function executeTool(
  toolName: string,
  args: Record<string, string>
): Promise<string> {
  try {
    switch (toolName) {
      case "lookup_services": {
        const { data } = await supabaseAdmin
          .from("services")
          .select("*")
          .eq("business_id", args.business_id)
          .eq("is_active", true);
        const services = (data as ServiceRow[] | null) || [];
        return JSON.stringify({ services: services.map(s => ({ name: s.name, name_somali: s.name_somali, description: s.description, description_somali: s.description_somali, price: s.price, duration_minutes: s.duration_minutes })) });
      }

      case "lookup_faqs": {
        const { data } = await supabaseAdmin
          .from("faqs")
          .select("*")
          .eq("business_id", args.business_id)
          .eq("is_active", true);
        const faqs = (data as FAQRow[] | null) || [];
        return JSON.stringify({ faqs: faqs.map(f => ({ question: f.question, question_somali: f.question_somali, answer: f.answer, answer_somali: f.answer_somali, category: f.category })) });
      }

      case "get_business_info": {
        const { data } = await supabaseAdmin
          .from("businesses")
          .select("*")
          .eq("id", args.business_id)
          .single();
        const biz = data as BusinessRow | null;
        return JSON.stringify({ business: biz ? { name: biz.name, description: biz.description, phone: biz.phone, email: biz.email, address: biz.address, city: biz.city, country: biz.country, industry: biz.industry } : null });
      }

      case "get_business_hours": {
        const { data } = await supabaseAdmin
          .from("businesses")
          .select("*")
          .eq("id", args.business_id)
          .single();
        const biz = data as BusinessRow | null;
        return JSON.stringify({ hours: biz?.business_hours, timezone: biz?.timezone });
      }

      case "check_availability": {
        const { data: existing } = await supabaseAdmin
          .from("appointments")
          .select("*")
          .eq("business_id", args.business_id)
          .eq("date", args.date)
          .not("status", "eq", "cancelled");

        const bookedSlots = ((existing as AppointmentRow[] | null) || []).map((a) => a.time_slot);
        const allSlots = [
          "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
          "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
          "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
        ];
        const available = allSlots.filter((s) => !bookedSlots.includes(s));
        return JSON.stringify({ date: args.date, available_slots: available, booked_count: bookedSlots.length });
      }

      case "book_appointment": {
        const insertPayload: Record<string, unknown> = {
          business_id: args.business_id,
          customer_name: args.customer_name,
          customer_phone: args.customer_phone || null,
          date: args.date,
          time_slot: args.time_slot,
          service_id: args.service_id || null,
          notes: args.notes || null,
          status: "confirmed",
        };
        const { data, error } = await supabaseAdmin
          .from("appointments")
          .insert(insertPayload as any)
          .select()
          .single();

        if (error) return JSON.stringify({ success: false, error: error.message });
        const apt = data as AppointmentRow;
        return JSON.stringify({ success: true, appointment_id: apt.id, message: `Appointment booked for ${args.customer_name} on ${args.date} at ${args.time_slot}` });
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (err) {
    return JSON.stringify({ error: `Tool execution failed: ${String(err)}` });
  }
}

// ─── Build System Prompt ─────────────────────────────────────

export async function buildSystemPrompt(businessId: string): Promise<string> {
  const businessRes = await supabaseAdmin.from("businesses").select("*").eq("id", businessId).single();
  const servicesRes = await supabaseAdmin.from("services").select("*").eq("business_id", businessId).eq("is_active", true);
  const faqsRes = await supabaseAdmin.from("faqs").select("*").eq("business_id", businessId).eq("is_active", true);
  const agentRes = await supabaseAdmin.from("agents").select("*").eq("business_id", businessId).eq("is_active", true).single();

  const business = businessRes.data as BusinessRow | null;
  const services = (servicesRes.data as ServiceRow[] | null) || [];
  const faqs = (faqsRes.data as FAQRow[] | null) || [];
  const agent = agentRes.data as Tables<"agents"> | null;

  if (!business) return DEFAULT_SOMALI_SYSTEM_PROMPT;

  // Use custom Somali prompt if set
  if (agent?.somali_system_prompt) {
    return agent.somali_system_prompt;
  }

  const servicesList = services
    .map((s) => `- ${s.name_somali || s.name}: ${s.description_somali || s.description || ""} (${s.price ? `$${s.price}` : "Free"}, ${s.duration_minutes} daqiiqo)`)
    .join("\n");

  const faqsList = faqs
    .map((f) => `Su'aal: ${f.question_somali || f.question}\nJawaab: ${f.answer_somali || f.answer}`)
    .join("\n\n");

  const hoursStr = (business.business_hours as Array<{ day: string; open: string; close: string; is_open: boolean }>)
    .map((h) => `${h.day}: ${h.is_open ? `${h.open} - ${h.close}` : "Xiran"}`)
    .join("\n");

  return `Waxaad tahay kaaliye cod ah oo xirfad leh oo u shaqeeya "${business.name}".

TILMAAMAHA MUHIIMKA AH:
- Ku hadal Af-Soomaali oo keliya
- Noqo mid sahal ah, kalsooni leh, oo dareen leh
- Macaamiisha ku soo dhawoow: "${agent?.greeting_message_somali || "Asalaamu calaykum! Sideen kuu caawin karaa?"}"
- Haddii macaamiilku rabo inuu balan qabsado, isticmaal qalabka "book_appointment"
- Haddii aadan garanayn jawaabta, si xirfad leh u sheeg inay la xiriiraan ganacsiga si toos ah

MACLUUMAADKA GANACSIGA:
Magaca: ${business.name}
Nooca: ${business.industry}
Cinwaanka: ${business.address || "Aan la bixin"}, ${business.city || ""}
Telefoonka: ${business.phone || "Aan la bixin"}
Email: ${business.email || "Aan la bixin"}

SAACADAHA SHAQADA:
${hoursStr}

ADEEGYADA:
${servicesList || "Aan la bixin adeegyo"}

SU'AALAHA CAADIGA AH:
${faqsList || "Aan la bixin FAQ"}`;
}