"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getConversationStats } from "@/services/conversations";
import { formatDuration } from "@/lib/utils";
import { BarChart3, TrendingUp, Clock, CalendarCheck, MessageSquare, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsPage() {
  const { business } = useBusinessContext();
  const [stats, setStats] = useState<{ totalConversations: number; appointmentsBooked: number; conversionRate: number; avgCallDuration: number; todayConversations: number; thisWeekConversations: number; trend: { date: string; count: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business) return;
    const load = async () => { const data = await getConversationStats(business.id); setStats(data); setLoading(false); };
    load();
  }, [business]);

  if (loading || !stats) return <div className="space-y-4 animate-pulse"><div className="card-surface h-80 shimmer-bg" /></div>;

  const pieData = [
    { name: "Booked", value: stats.appointmentsBooked, color: "#22c55e" },
    { name: "No Booking", value: Math.max(0, stats.totalConversations - stats.appointmentsBooked), color: "#1f2937" },
  ];

  const kpis = [
    { label: "Total Conversations", value: stats.totalConversations, icon: MessageSquare, color: "text-blue-400" },
    { label: "Appointments Booked", value: stats.appointmentsBooked, icon: CalendarCheck, color: "text-emerald-400" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: TrendingUp, color: "text-purple-400" },
    { label: "Avg Duration", value: formatDuration(stats.avgCallDuration), icon: Clock, color: "text-amber-400" },
    { label: "Today", value: stats.todayConversations, icon: Users, color: "text-cyan-400" },
    { label: "This Week", value: stats.thisWeekConversations, icon: BarChart3, color: "text-indigo-400" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="card-surface p-4 text-center animate-fade-up">
            <k.icon className={`w-5 h-5 ${k.color} mx-auto mb-2`} />
            <p className="text-xl font-bold text-[var(--text-1)]">{k.value}</p>
            <p className="text-[10px] text-[var(--text-3)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Bar Chart */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">Daily Conversations</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fill: "#4b6070" }} tickFormatter={(v) => new Date(v).getDate().toString()} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fill: "#4b6070" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#111c1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#f1f5f9" }} />
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-4">Booking Conversion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#111c1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#f1f5f9" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-[11px] text-[var(--text-3)]">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
