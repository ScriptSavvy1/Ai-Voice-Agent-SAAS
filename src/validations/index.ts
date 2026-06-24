import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
});

// ─── Business ────────────────────────────────────────────────
export const businessSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
});

// ─── Service ─────────────────────────────────────────────────
export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  name_somali: z.string().optional().default(""),
  description: z.string().optional().default(""),
  description_somali: z.string().optional().default(""),
  price: z.coerce.number().min(0).nullable().default(null),
  duration_minutes: z.coerce.number().min(5).max(480).default(30),
});

// ─── FAQ ─────────────────────────────────────────────────────
export const faqSchema = z.object({
  question: z.string().min(3, "Question is required"),
  question_somali: z.string().optional().default(""),
  answer: z.string().min(3, "Answer is required"),
  answer_somali: z.string().optional().default(""),
  category: z.string().default("general"),
});

// ─── Agent ───────────────────────────────────────────────────
export const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  voice_id: z.string().default("alloy"),
  personality: z.string().default("professional"),
  greeting_message: z.string().min(1, "Greeting message is required"),
  greeting_message_somali: z.string().min(1, "Somali greeting is required"),
  system_prompt: z.string().optional().default(""),
  somali_system_prompt: z.string().optional().default(""),
});

// ─── Widget ──────────────────────────────────────────────────
export const widgetSchema = z.object({
  position: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  greeting_text: z.string().min(1, "Greeting text is required"),
  greeting_text_somali: z.string().min(1, "Somali greeting text is required"),
  is_active: z.boolean().default(true),
  allowed_domains: z.array(z.string()).default([]),
});

// ─── Appointment ─────────────────────────────────────────────
export const appointmentSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().optional(),
  customer_email: z.string().email().optional().or(z.literal("")),
  service_id: z.string().uuid().optional().nullable(),
  date: z.string().min(1, "Date is required"),
  time_slot: z.string().min(1, "Time slot is required"),
  notes: z.string().optional(),
});

// ─── Type Exports ────────────────────────────────────────────
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type BusinessFormValues = z.infer<typeof businessSchema>;
export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type FAQFormValues = z.infer<typeof faqSchema>;
export type AgentFormValues = z.infer<typeof agentSchema>;
export type WidgetFormValues = z.infer<typeof widgetSchema>;
export type AppointmentFormValues = z.infer<typeof appointmentSchema>;