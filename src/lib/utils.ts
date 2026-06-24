import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

// ─── Class Name Merge ────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Formatters ─────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d, yyyy h:mm a");
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ─── String Helpers ──────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

// ─── Price Formatter ─────────────────────────────────────────
export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return "Free";
  return `$${price.toFixed(2)}`;
}

// ─── Status Color Mapper ─────────────────────────────────────
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case "confirmed":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
      };
    case "completed":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        dot: "bg-blue-400",
      };
    case "pending":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        dot: "bg-amber-400",
      };
    case "cancelled":
      return {
        bg: "bg-red-500/10",
        text: "text-red-400",
        dot: "bg-red-400",
      };
    default:
      return {
        bg: "bg-surface-500/10",
        text: "text-surface-400",
        dot: "bg-surface-400",
      };
  }
}

// ─── Sentiment Color Mapper ──────────────────────────────────
export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "positive":
      return "text-emerald-400";
    case "negative":
      return "text-red-400";
    default:
      return "text-surface-400";
  }
}

// ─── Generate Random Color for Avatars ───────────────────────
const avatarColors = [
  "bg-emerald-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-indigo-600",
  "bg-teal-600",
];

export function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

// ─── Percentage Formatter ────────────────────────────────────
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}