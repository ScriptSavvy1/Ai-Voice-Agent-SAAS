"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getServices, createService, updateService, deleteService } from "@/services/services";
import type { Service } from "@/types";
import { Plus, Pencil, Trash2, X, Clock, DollarSign } from "lucide-react";

export default function ServicesPage() {
  const { business } = useBusinessContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", name_somali: "", description: "", description_somali: "", price: "", duration_minutes: "30" });

  const loadServices = async () => {
    if (!business) return;
    const data = await getServices(business.id);
    setServices(data);
    setLoading(false);
  };

  useEffect(() => { loadServices(); }, [business]); // eslint-disable-line

  const resetForm = () => { setForm({ name: "", name_somali: "", description: "", description_somali: "", price: "", duration_minutes: "30" }); setEditingId(null); setShowForm(false); };

  const handleEdit = (s: Service) => {
    setForm({ name: s.name, name_somali: s.name_somali || "", description: s.description || "", description_somali: s.description_somali || "", price: s.price?.toString() || "", duration_minutes: s.duration_minutes.toString() });
    setEditingId(s.id); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    const payload = { name: form.name, name_somali: form.name_somali || null, description: form.description || null, description_somali: form.description_somali || null, price: form.price ? parseFloat(form.price) : null, duration_minutes: parseInt(form.duration_minutes) };
    if (editingId) { await updateService(editingId, payload); } else { await createService({ ...payload, business_id: business.id }); }
    resetForm(); loadServices();
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete this service?")) return; await deleteService(id); loadServices(); };

  if (loading) return <div className="space-y-4 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="card-surface h-20 shimmer-bg" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[var(--text-2)]">Add services your business offers. The AI uses these to answer customer questions.</p>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" />Add Service</button>
      </div>

      {showForm && (
        <div className="card-glow p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-1)]">{editingId ? "Edit Service" : "Add New Service"}</h3>
            <button onClick={resetForm} className="text-[var(--text-3)] hover:text-[var(--text-2)]"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">Service Name (English)</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="label-text">Service Name (Somali)</label><input className="input-field" value={form.name_somali} onChange={(e) => setForm({ ...form, name_somali: e.target.value })} placeholder="Magaca adeegga" /></div>
            <div><label className="label-text">Description (English)</label><textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label-text">Description (Somali)</label><textarea className="input-field" rows={2} value={form.description_somali} onChange={(e) => setForm({ ...form, description_somali: e.target.value })} placeholder="Sharaxaadda" /></div>
            <div><label className="label-text">Price ($)</label><input className="input-field" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" /></div>
            <div><label className="label-text">Duration (minutes)</label><input className="input-field" type="number" min="5" max="480" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} /></div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editingId ? "Update" : "Add"} Service</button>
            </div>
          </form>
        </div>
      )}

      {services.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <DollarSign className="w-10 h-10 text-[var(--text-3)] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-1">No services yet</h3>
          <p className="text-[12px] text-[var(--text-3)]">Add your first service so the AI knows what you offer.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="card-surface p-4 flex items-center justify-between animate-fade-up">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-semibold text-[var(--text-1)]">{s.name}</h4>
                  {s.name_somali && <span className="text-[11px] text-[var(--text-3)]">· {s.name_somali}</span>}
                </div>
                {s.description && <p className="text-[11px] text-[var(--text-3)] mt-0.5">{s.description}</p>}
                <div className="flex items-center gap-4 mt-1.5">
                  {s.price !== null && <span className="flex items-center gap-1 text-[11px] text-[var(--green)]"><DollarSign className="w-3 h-3" />${s.price}</span>}
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-3)]"><Clock className="w-3 h-3" />{s.duration_minutes} min</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(s)} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] text-[var(--text-3)] hover:text-[var(--text-2)]"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-500/5 text-[var(--text-3)] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
