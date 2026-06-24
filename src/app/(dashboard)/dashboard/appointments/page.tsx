"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getAppointments, updateAppointmentStatus } from "@/services/appointments";
import { APPOINTMENT_STATUSES } from "@/constants";
import { formatDate, getInitials, getAvatarColor, getStatusColor } from "@/lib/utils";
import type { Appointment } from "@/types";
import { Calendar, Check, X as XIcon, Filter } from "lucide-react";

export default function AppointmentsPage() {
  const { business } = useBusinessContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadAppointments = async () => { if (!business) return; const data = await getAppointments(business.id, filter); setAppointments(data); setLoading(false); };
  useEffect(() => { loadAppointments(); }, [business, filter]); // eslint-disable-line

  const handleStatus = async (id: string, status: "confirmed" | "cancelled" | "completed") => { await updateAppointmentStatus(id, status); loadAppointments(); };

  if (loading) return <div className="space-y-4 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="card-surface h-16 shimmer-bg" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[var(--text-2)]">Appointments booked by your AI agent.</p>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[var(--text-3)]" />
          <select className="input-field !w-auto !py-1.5 text-[12px]" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            {APPOINTMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <Calendar className="w-10 h-10 text-[var(--text-3)] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-1">No appointments</h3>
          <p className="text-[12px] text-[var(--text-3)]">When customers book through the AI, appointments appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {appointments.map((apt) => {
            const sc = getStatusColor(apt.status);
            return (
              <div key={apt.id} className="card-surface p-4 flex items-center justify-between animate-fade-up">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${getAvatarColor(apt.customer_name)} flex items-center justify-center text-[11px] font-bold text-white`}>
                    {getInitials(apt.customer_name)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--text-1)]">{apt.customer_name}</p>
                    <p className="text-[11px] text-[var(--text-3)]">
                      {apt.customer_phone || apt.customer_email || "No contact"}
                      {apt.notes && ` · ${apt.notes}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[12px] text-[var(--text-2)]">{formatDate(apt.date)}</p>
                    <p className="text-[11px] text-[var(--text-3)]">{apt.time_slot}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{apt.status}
                  </span>
                  {apt.status === "pending" && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleStatus(apt.id, "confirmed")} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-[var(--text-3)] hover:text-emerald-400" title="Confirm"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleStatus(apt.id, "cancelled")} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-3)] hover:text-red-400" title="Cancel"><XIcon className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  {apt.status === "confirmed" && (
                    <button onClick={() => handleStatus(apt.id, "completed")} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-[var(--text-3)] hover:text-blue-400" title="Complete"><Check className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
