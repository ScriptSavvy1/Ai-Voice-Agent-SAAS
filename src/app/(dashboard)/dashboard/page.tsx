"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getConversationStats } from "@/services/conversations";
import { getAppointments } from "@/services/appointments";
import { getAgents } from "@/services/agents";
import { formatDuration, formatDate, getInitials, getAvatarColor, getStatusColor } from "@/lib/utils";
import type { Appointment, ConversationTrendPoint } from "@/types";
import {
  MessageSquare,
  CalendarCheck,
  TrendingUp,
  Clock,
  Bot,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

interface Stats {
  totalConversations: number;
  todayConversations: number;
  thisWeekConversations: number;
  appointmentsBooked: number;
  conversionRate: number;
  avgCallDuration: number;
  callbacksRequested: number;
  trend: ConversationTrendPoint[];
}

export default function DashboardOverview() {
  const { business } = useBusinessContext();
  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeAgents, setActiveAgents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business) return;

    const load = async () => {
      try {
        const [statsData, appts, agents] = await Promise.all([
          getConversationStats(business.id),
          getAppointments(business.id),
          getAgents(business.id),
        ]);
        setStats(statsData);
        setAppointments(appts.slice(0, 5));
        setActiveAgents(agents.filter((a) => a.is_active).length);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [business]);

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-surface p-5 h-24 shimmer-bg" />
          ))}
        </div>
        <div className="card-surface h-72 shimmer-bg" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Conversations",
      value: stats.totalConversations.toString(),
      icon: MessageSquare,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Appointments Booked",
      value: stats.appointmentsBooked.toString(),
      icon: CalendarCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Avg. Call Duration",
      value: formatDuration(stats.avgCallDuration),
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="card-surface p-5 flex items-start gap-4 animate-fade-up"
          >
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-1)]">
                {stat.value}
              </p>
              <p className="text-[11px] text-[var(--text-3)] mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Chart + Side Stats ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Conversation Trend Chart */}
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-1)]">
                Conversation Trend
              </h3>
              <p className="text-[11px] text-[var(--text-3)]">Last 14 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.trend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 10, fill: "#4b6070" }}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.toLocaleDateString("en", { month: "short" })} ${d.getDate()}`;
                }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 10, fill: "#4b6070" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#111c1f",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#f1f5f9",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#22c55e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Side Stats */}
        <div className="space-y-3">
          {[
            {
              label: "Today's Conversations",
              value: stats.todayConversations,
              icon: MessageSquare,
            },
            {
              label: "This Week",
              value: stats.thisWeekConversations,
              icon: MessageSquare,
            },
            {
              label: "Callbacks Requested",
              value: stats.callbacksRequested,
              icon: Phone,
            },
            {
              label: "Active Agents",
              value: activeAgents,
              icon: Bot,
            },
          ].map((item) => (
            <div key={item.label} className="card-surface p-4">
              <p className="text-[11px] text-[var(--text-3)] mb-1">
                {item.label}
              </p>
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-[var(--text-3)]" />
                <span className="text-xl font-bold text-[var(--text-1)]">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Recent Appointments ─── */}
      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)]">
            Recent Appointments
          </h3>
          <Link
            href="/dashboard/appointments"
            className="text-[11px] text-[var(--text-3)] hover:text-[var(--text-2)] flex items-center gap-1 transition-colors"
          >
            + View All
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <CalendarCheck className="w-8 h-8 text-[var(--text-3)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-3)]">
              No appointments yet
            </p>
            <p className="text-[11px] text-[var(--text-3)] mt-1">
              Appointments booked by the AI will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {appointments.map((apt) => {
              const statusColors = getStatusColor(apt.status);
              return (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${getAvatarColor(apt.customer_name)} flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {getInitials(apt.customer_name)}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--text-1)]">
                        {apt.customer_name}
                      </p>
                      <p className="text-[11px] text-[var(--text-3)]">
                        {apt.notes || apt.time_slot}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[var(--text-3)]">
                      {formatDate(apt.date)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusColors.bg} ${statusColors.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}
                      />
                      {apt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
