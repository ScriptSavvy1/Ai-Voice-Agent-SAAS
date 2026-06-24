"use client";

import { usePathname } from "next/navigation";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getInitials } from "@/lib/utils";
import { Search, Bell } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Business performance at a glance",
  },
  "/dashboard/analytics": {
    title: "Analytics",
    subtitle: "Detailed performance metrics",
  },
  "/dashboard/conversations": {
    title: "Conversations",
    subtitle: "View and manage AI conversations",
  },
  "/dashboard/appointments": {
    title: "Appointments",
    subtitle: "Manage customer bookings",
  },
  "/dashboard/agents": {
    title: "AI Agents",
    subtitle: "Configure your voice assistant",
  },
  "/dashboard/services": {
    title: "Services",
    subtitle: "Manage your business offerings",
  },
  "/dashboard/faqs": {
    title: "FAQs",
    subtitle: "Train your AI with common questions",
  },
  "/dashboard/widget": {
    title: "Widget",
    subtitle: "Embed your AI agent on any website",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Manage your business profile",
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const { business } = useBusinessContext();

  const pageInfo = pageTitles[pathname] || {
    title: "Dashboard",
    subtitle: "",
  };

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
      {/* Left: Page Title */}
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--text-1)]">
          {pageInfo.title}
        </h2>
        {pageInfo.subtitle && (
          <p className="text-[11px] text-[var(--text-3)]">
            {pageInfo.subtitle}
          </p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[var(--border)] text-[var(--text-3)]">
          <Search className="w-3.5 h-3.5" />
          <span className="text-[12px]">Search...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-raised)] border border-[var(--border)] ml-4">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(255,255,255,0.04)] transition-colors relative">
          <Bell className="w-4 h-4 text-[var(--text-3)]" />
        </button>

        {/* User Avatar */}
        {business && (
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white cursor-pointer">
            {getInitials(business.name)}
          </div>
        )}
      </div>
    </header>
  );
}
