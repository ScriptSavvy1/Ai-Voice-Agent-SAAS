export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          industry: string;
          description: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          business_hours: BusinessHourEntry[];
          timezone: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          industry?: string;
          description?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          business_hours?: BusinessHourEntry[];
          timezone?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          industry?: string;
          description?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          business_hours?: BusinessHourEntry[];
          timezone?: string;
          logo_url?: string | null;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          name_somali: string | null;
          description: string | null;
          description_somali: string | null;
          price: number | null;
          duration_minutes: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          name_somali?: string | null;
          description?: string | null;
          description_somali?: string | null;
          price?: number | null;
          duration_minutes?: number;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          name_somali?: string | null;
          description?: string | null;
          description_somali?: string | null;
          price?: number | null;
          duration_minutes?: number;
          is_active?: boolean;
          sort_order?: number;
        };
      };
      faqs: {
        Row: {
          id: string;
          business_id: string;
          question: string;
          question_somali: string | null;
          answer: string;
          answer_somali: string | null;
          category: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          question: string;
          question_somali?: string | null;
          answer: string;
          answer_somali?: string | null;
          category?: string;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          question?: string;
          question_somali?: string | null;
          answer?: string;
          answer_somali?: string | null;
          category?: string;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      agents: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          voice_id: string;
          personality: string;
          system_prompt: string | null;
          somali_system_prompt: string | null;
          greeting_message: string;
          greeting_message_somali: string;
          is_active: boolean;
          model: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name?: string;
          voice_id?: string;
          personality?: string;
          system_prompt?: string | null;
          somali_system_prompt?: string | null;
          greeting_message?: string;
          greeting_message_somali?: string;
          is_active?: boolean;
          model?: string;
        };
        Update: {
          name?: string;
          voice_id?: string;
          personality?: string;
          system_prompt?: string | null;
          somali_system_prompt?: string | null;
          greeting_message?: string;
          greeting_message_somali?: string;
          is_active?: boolean;
          model?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          business_id: string;
          customer_name: string;
          customer_phone: string | null;
          customer_email: string | null;
          service_id: string | null;
          date: string;
          time_slot: string;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          notes: string | null;
          conversation_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          customer_name: string;
          customer_phone?: string | null;
          customer_email?: string | null;
          service_id?: string | null;
          date: string;
          time_slot: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          conversation_id?: string | null;
        };
        Update: {
          customer_name?: string;
          customer_phone?: string | null;
          customer_email?: string | null;
          service_id?: string | null;
          date?: string;
          time_slot?: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          business_id: string;
          agent_id: string | null;
          customer_identifier: string | null;
          transcript: TranscriptEntry[];
          summary: string | null;
          sentiment: "positive" | "neutral" | "negative";
          duration_seconds: number;
          language: string;
          appointment_booked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          agent_id?: string | null;
          customer_identifier?: string | null;
          transcript?: TranscriptEntry[];
          summary?: string | null;
          sentiment?: "positive" | "neutral" | "negative";
          duration_seconds?: number;
          language?: string;
          appointment_booked?: boolean;
        };
        Update: {
          transcript?: TranscriptEntry[];
          summary?: string | null;
          sentiment?: "positive" | "neutral" | "negative";
          duration_seconds?: number;
          appointment_booked?: boolean;
        };
      };
      widgets: {
        Row: {
          id: string;
          business_id: string;
          position: "bottom-right" | "bottom-left";
          primary_color: string;
          greeting_text: string;
          greeting_text_somali: string;
          is_active: boolean;
          allowed_domains: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          position?: "bottom-right" | "bottom-left";
          primary_color?: string;
          greeting_text?: string;
          greeting_text_somali?: string;
          is_active?: boolean;
          allowed_domains?: string[];
        };
        Update: {
          position?: "bottom-right" | "bottom-left";
          primary_color?: string;
          greeting_text?: string;
          greeting_text_somali?: string;
          is_active?: boolean;
          allowed_domains?: string[];
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ─── Shared Sub-Types ────────────────────────────────────────
export interface BusinessHourEntry {
  day: string;
  open: string;
  close: string;
  is_open: boolean;
}

export interface TranscriptEntry {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

// ─── Convenience Aliases ─────────────────────────────────────
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];