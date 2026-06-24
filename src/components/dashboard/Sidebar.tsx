"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { SIDEBAR_LINKS, APP_NAME } from "@/constants";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Calendar,
  Bot,
  Wrench,
  HelpCircle,
  Code,
  Settings,
  LogOut,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Calendar,
  Bot,
  Wrench,
  HelpCircle,
  Code,
  Settings,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { business } = useBusinessContext();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const mainLinks = SIDEBAR_LINKS.filter((l) => l.section === "main");
  const configureLinks = SIDEBAR_LINKS.filter((l) => l.section === "configure");
  const accountLinks = SIDEBAR_LINKS.filter((l) => l.section === "account");

  return (
    <aside className="w-[240px] h-screen flex flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] flex-shrink-0 overflow-y-auto">
      {/* ─── Logo ─── */}
      <div className="p-4 pb-2">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--text-1)]">
              {APP_NAME}
            </h1>
            <p className="text-[10px] text-[var(--text-3)]">Voice Platform</p>
          </div>
        </Link>
      </div>

      {/* ─── Business Card ─── */}
      {business && (
        <div className="mx-3 mt-2 mb-4 p-2.5 rounded-lg bg-[var(--bg-raised)] border border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white">
              {getInitials(business.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[var(--text-1)] truncate">
                {business.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
                <span className="text-[10px] text-[var(--text-3)]">
                  {business.city || business.country || "Online"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Navigation ─── */}
      <nav className="flex-1 px-3 space-y-6">
        {/* Main */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] px-2.5 mb-1.5">
            Main
          </p>
          <div className="space-y-0.5">
            {mainLinks.map((link) => {
              const Icon = iconMap[link.icon] || LayoutDashboard;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    active ? "sidebar-link-active" : "sidebar-link"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Configure */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] px-2.5 mb-1.5">
            Configure
          </p>
          <div className="space-y-0.5">
            {configureLinks.map((link) => {
              const Icon = iconMap[link.icon] || Wrench;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    active ? "sidebar-link-active" : "sidebar-link"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] px-2.5 mb-1.5">
            Account
          </p>
          <div className="space-y-0.5">
            {accountLinks.map((link) => {
              const Icon = iconMap[link.icon] || Settings;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    active ? "sidebar-link-active" : "sidebar-link"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ─── Sign Out ─── */}
      <div className="p-3 border-t border-[var(--border)]">
        <button
          onClick={handleSignOut}
          className="sidebar-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
