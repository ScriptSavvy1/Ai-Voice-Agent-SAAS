import type { SidebarLink, PricingTier } from "@/types";
import type { BusinessHourEntry } from "@/types/database";

// ─── App Info ────────────────────────────────────────────────
export const APP_NAME = "VoiceDesk AI";
export const APP_DESCRIPTION = "AI Voice Receptionist Platform";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Industries ──────────────────────────────────────────────
export const INDUSTRIES = [
  { value: "general", label: "General Business", labelSomali: "Ganacsi Guud" },
  { value: "restaurant", label: "Restaurant", labelSomali: "Maqaaxi" },
  { value: "healthcare", label: "Healthcare / Clinic", labelSomali: "Xarunta Caafimaadka" },
  { value: "auto_repair", label: "Auto Repair Shop", labelSomali: "Hagaha Dayactirka Gaadiidka" },
  { value: "salon", label: "Salon / Barber", labelSomali: "Salon / Timo jare" },
  { value: "retail", label: "Retail Store", labelSomali: "Dukaan" },
  { value: "real_estate", label: "Real Estate", labelSomali: "Hantida Dhulka" },
  { value: "education", label: "Education", labelSomali: "Waxbarasho" },
  { value: "legal", label: "Legal / Law Firm", labelSomali: "Xafiiska Qareenka" },
  { value: "hotel", label: "Hotel / Hospitality", labelSomali: "Hudheel" },
  { value: "gym", label: "Gym / Fitness", labelSomali: "Jimicsiga" },
  { value: "other", label: "Other", labelSomali: "Kuwa kale" },
];

// ─── Appointment Statuses ────────────────────────────────────
export const APPOINTMENT_STATUSES = [
  { value: "pending", label: "Pending", labelSomali: "La sugayo" },
  { value: "confirmed", label: "Confirmed", labelSomali: "La xaqiijiyay" },
  { value: "cancelled", label: "Cancelled", labelSomali: "La joojiyay" },
  { value: "completed", label: "Completed", labelSomali: "La dhammeeyay" },
];

// ─── Voice Personalities ─────────────────────────────────────
export const VOICE_PERSONALITIES = [
  { value: "professional", label: "Professional", description: "Formal and courteous" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational" },
  { value: "energetic", label: "Energetic", description: "Upbeat and enthusiastic" },
];

// ─── OpenAI Voice Options ────────────────────────────────────
export const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy", description: "Neutral and balanced" },
  { value: "echo", label: "Echo", description: "Warm and grounded" },
  { value: "shimmer", label: "Shimmer", description: "Clear and positive" },
  { value: "ash", label: "Ash", description: "Soft and conversational" },
  { value: "ballad", label: "Ballad", description: "Expressive and warm" },
  { value: "coral", label: "Coral", description: "Clear and engaging" },
  { value: "sage", label: "Sage", description: "Calm and authoritative" },
  { value: "verse", label: "Verse", description: "Dynamic and versatile" },
];

// ─── Default Somali Prompts ──────────────────────────────────
export const DEFAULT_SOMALI_GREETING =
  "Asalaamu calaykum! Ku soo dhawoow. Sideen kuu caawin karaa maanta?";

export const DEFAULT_SOMALI_SYSTEM_PROMPT = `Waxaad tahay kaaliye cod ah oo xirfad leh. Waa inaad:
- Ku hadashaa Af-Soomaali oo keliya
- Macaamiisha ku soo dhawoow si dareen leh
- Ka jawaab su'aalaha ku saabsan adeegyada iyo ganacsiga
- Balan bixin ama ballanqaad qabso haddii la codsado
- Noqo mid sahal ah, kalsooni leh, oo adeeg wanaagsan bixin
- Haddii aadan garanayn jawaabta, si xirfad leh u sheeg macaamiisha inay la xiriiraan ganacsiga si toos ah`;

// ─── Sidebar Navigation ─────────────────────────────────────
export const SIDEBAR_LINKS: SidebarLink[] = [
  // Main
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard", section: "main" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3", section: "main" },
  { label: "Conversations", href: "/dashboard/conversations", icon: "MessageSquare", section: "main" },
  { label: "Appointments", href: "/dashboard/appointments", icon: "Calendar", section: "main" },
  // Configure
  { label: "AI Agents", href: "/dashboard/agents", icon: "Bot", section: "configure" },
  { label: "Services", href: "/dashboard/services", icon: "Wrench", section: "configure" },
  { label: "FAQs", href: "/dashboard/faqs", icon: "HelpCircle", section: "configure" },
  // Other
  { label: "Widget", href: "/dashboard/widget", icon: "Code", section: "configure" },
  // Account
  { label: "Settings", href: "/dashboard/settings", icon: "Settings", section: "account" },
];

// ─── Default Business Hours ──────────────────────────────────
export const DEFAULT_BUSINESS_HOURS: BusinessHourEntry[] = [
  { day: "Monday", open: "08:00", close: "17:00", is_open: true },
  { day: "Tuesday", open: "08:00", close: "17:00", is_open: true },
  { day: "Wednesday", open: "08:00", close: "17:00", is_open: true },
  { day: "Thursday", open: "08:00", close: "17:00", is_open: true },
  { day: "Friday", open: "08:00", close: "17:00", is_open: true },
  { day: "Saturday", open: "09:00", close: "13:00", is_open: true },
  { day: "Sunday", open: "00:00", close: "00:00", is_open: false },
];

// ─── Pricing Tiers ───────────────────────────────────────────
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "STARTER",
    price: "Free",
    period: "forever · self-hosted",
    description: "Perfect for a single business testing AI voice.",
    features: [
      "1 Business profile",
      "1 AI Voice Agent",
      "Unlimited conversations",
      "Appointment booking",
      "Analytics dashboard",
      "Embeddable widget",
      "Conversation transcripts",
    ],
    cta: "Get Started Free",
    popular: false,
    comingSoon: false,
  },
  {
    name: "PRO",
    price: "$49",
    period: "per month",
    description: "For growing businesses that need more power.",
    features: [
      "Multiple businesses",
      "Unlimited AI agents",
      "Priority support",
      "Custom domains",
      "Advanced analytics",
      "API access",
      "White-label widget",
    ],
    cta: "Join Waitlist",
    popular: true,
    comingSoon: true,
  },
];

// ─── FAQ Categories ──────────────────────────────────────────
export const FAQ_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "services", label: "Services" },
  { value: "pricing", label: "Pricing" },
  { value: "hours", label: "Hours & Location" },
  { value: "booking", label: "Booking" },
  { value: "other", label: "Other" },
];