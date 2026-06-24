// Re-export database types
export type {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
  BusinessHourEntry,
  TranscriptEntry,
} from "./database";

// ─── Application Types ───────────────────────────────────────

export type Business = Tables<"businesses">;
export type Service = Tables<"services">;
export type FAQ = Tables<"faqs">;
export type Agent = Tables<"agents">;
export type Appointment = Tables<"appointments">;
export type Conversation = Tables<"conversations">;
export type Widget = Tables<"widgets">;

// ─── Voice Session ───────────────────────────────────────────

export type VoiceSessionState =
  | "idle"
  | "connecting"
  | "connected"
  | "listening"
  | "speaking"
  | "error";

export interface VoiceSession {
  state: VoiceSessionState;
  transcript: TranscriptEntry[];
  duration: number;
  audioLevel: number;
  error?: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────

export interface DashboardStats {
  totalConversations: number;
  appointmentsBooked: number;
  conversionRate: number;
  avgCallDuration: number;
  todayConversations: number;
  thisWeekConversations: number;
  callbacksRequested: number;
  activeAgents: number;
}

export interface ConversationTrendPoint {
  date: string;
  count: number;
}

// ─── Sidebar Navigation ─────────────────────────────────────

export interface SidebarLink {
  label: string;
  href: string;
  icon: string;
  section: "main" | "configure" | "account";
}

// ─── Widget Config (public API response) ─────────────────────

export interface WidgetConfig {
  businessId: string;
  businessName: string;
  position: "bottom-right" | "bottom-left";
  primaryColor: string;
  greetingText: string;
  greetingTextSomali: string;
  isActive: boolean;
  agentName: string;
  voiceId: string;
}

// ─── Pricing Tiers ───────────────────────────────────────────

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  comingSoon: boolean;
}

// ─── API Response Types ──────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface RealtimeSessionResponse {
  sessionId: string;
  token: string;
  expiresAt: string;
  config: {
    model: string;
    voice: string;
    instructions: string;
    tools: RealtimeTool[];
  };
}

export interface RealtimeTool {
  type: "function";
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

// ─── Form Types ──────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  businessName: string;
  industry: string;
}

export interface ServiceFormData {
  name: string;
  name_somali: string;
  description: string;
  description_somali: string;
  price: number | null;
  duration_minutes: number;
}

export interface FAQFormData {
  question: string;
  question_somali: string;
  answer: string;
  answer_somali: string;
  category: string;
}

export interface AgentFormData {
  name: string;
  voice_id: string;
  personality: string;
  greeting_message: string;
  greeting_message_somali: string;
  system_prompt: string;
  somali_system_prompt: string;
}

// Import Tables type for the aliases
import type { Tables, TranscriptEntry } from "./database";