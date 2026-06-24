"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { updateBusiness } from "@/services/business";
import { INDUSTRIES, DEFAULT_BUSINESS_HOURS } from "@/constants";
import type { BusinessHourEntry } from "@/types/database";
import { Save, Building2 } from "lucide-react";

export default function SettingsPage() {
  const { business, refreshBusiness } = useBusinessContext();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "general", description: "", phone: "", email: "", address: "", city: "", country: "Somalia", timezone: "Africa/Mogadishu" });
  const [hours, setHours] = useState<BusinessHourEntry[]>(DEFAULT_BUSINESS_HOURS);

  useEffect(() => {
    if (!business) return;
    setForm({ name: business.name, industry: business.industry, description: business.description || "", phone: business.phone || "", email: business.email || "", address: business.address || "", city: business.city || "", country: business.country || "Somalia", timezone: business.timezone });
    setHours(business.business_hours as BusinessHourEntry[]);
  }, [business]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    await updateBusiness(business.id, { ...form, business_hours: hours as unknown as BusinessHourEntry[] });
    await refreshBusiness();
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateHour = (idx: number, field: keyof BusinessHourEntry, value: string | boolean) => {
    const updated = [...hours];
    (updated[idx] as unknown as Record<string, string | boolean>)[field] = value;
    setHours(updated);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-[13px] text-[var(--text-2)]">Manage your business profile. This information is used by the AI when talking to customers.</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)] flex items-center gap-2"><Building2 className="w-4 h-4 text-[var(--green)]" />Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">Business Name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="label-text">Industry</label>
              <select className="input-field" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2"><label className="label-text">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell the AI about your business..." /></div>
            <div><label className="label-text">Phone</label><input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="label-text">Email</label><input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label-text">Address</label><input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div><label className="label-text">City</label><input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          </div>
        </div>

        <div className="card-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)]">Business Hours</h3>
          <div className="space-y-2">
            {hours.map((h, i) => (
              <div key={h.day} className="flex items-center gap-3">
                <label className="flex items-center gap-2 w-28">
                  <input type="checkbox" checked={h.is_open} onChange={(e) => updateHour(i, "is_open", e.target.checked)} className="w-4 h-4 rounded accent-[var(--green)]" />
                  <span className="text-[12px] text-[var(--text-1)]">{h.day}</span>
                </label>
                {h.is_open ? (
                  <div className="flex items-center gap-2">
                    <input type="time" className="input-field !w-auto !py-1.5 text-[12px]" value={h.open} onChange={(e) => updateHour(i, "open", e.target.value)} />
                    <span className="text-[11px] text-[var(--text-3)]">to</span>
                    <input type="time" className="input-field !w-auto !py-1.5 text-[12px]" value={h.close} onChange={(e) => updateHour(i, "close", e.target.value)} />
                  </div>
                ) : (
                  <span className="text-[11px] text-[var(--text-3)]">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
