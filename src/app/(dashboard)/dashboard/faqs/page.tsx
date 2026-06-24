"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from "@/services/faqs";
import { FAQ_CATEGORIES } from "@/constants";
import type { FAQ } from "@/types";
import { Plus, Pencil, Trash2, X, HelpCircle } from "lucide-react";

export default function FAQsPage() {
  const { business } = useBusinessContext();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", question_somali: "", answer: "", answer_somali: "", category: "general" });

  const loadFAQs = async () => { if (!business) return; const data = await getFAQs(business.id); setFaqs(data); setLoading(false); };
  useEffect(() => { loadFAQs(); }, [business]); // eslint-disable-line

  const resetForm = () => { setForm({ question: "", question_somali: "", answer: "", answer_somali: "", category: "general" }); setEditingId(null); setShowForm(false); };

  const handleEdit = (f: FAQ) => {
    setForm({ question: f.question, question_somali: f.question_somali || "", answer: f.answer, answer_somali: f.answer_somali || "", category: f.category });
    setEditingId(f.id); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    const payload = { question: form.question, question_somali: form.question_somali || null, answer: form.answer, answer_somali: form.answer_somali || null, category: form.category };
    if (editingId) { await updateFAQ(editingId, payload); } else { await createFAQ({ ...payload, business_id: business.id }); }
    resetForm(); loadFAQs();
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete this FAQ?")) return; await deleteFAQ(id); loadFAQs(); };

  if (loading) return <div className="space-y-4 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="card-surface h-24 shimmer-bg" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[var(--text-2)]">Train your AI with common questions. Add both English and Somali versions.</p>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" />Add FAQ</button>
      </div>

      {showForm && (
        <div className="card-glow p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-1)]">{editingId ? "Edit FAQ" : "Add New FAQ"}</h3>
            <button onClick={resetForm} className="text-[var(--text-3)] hover:text-[var(--text-2)]"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">Question (English)</label><input className="input-field" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></div>
            <div><label className="label-text">Su&apos;aal (Somali)</label><input className="input-field" value={form.question_somali} onChange={(e) => setForm({ ...form, question_somali: e.target.value })} placeholder="Su'aalda Soomaaliga" /></div>
            <div><label className="label-text">Answer (English)</label><textarea className="input-field" rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required /></div>
            <div><label className="label-text">Jawaab (Somali)</label><textarea className="input-field" rows={3} value={form.answer_somali} onChange={(e) => setForm({ ...form, answer_somali: e.target.value })} placeholder="Jawaabta Soomaaliga" /></div>
            <div><label className="label-text">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {FAQ_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex items-end justify-end gap-2">
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editingId ? "Update" : "Add"} FAQ</button>
            </div>
          </form>
        </div>
      )}

      {faqs.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <HelpCircle className="w-10 h-10 text-[var(--text-3)] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-1">No FAQs yet</h3>
          <p className="text-[12px] text-[var(--text-3)]">Add common questions so the AI can answer them accurately.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((f) => (
            <div key={f.id} className="card-surface p-4 animate-fade-up">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge bg-[var(--green-dim)] text-[var(--green)] border-[rgba(34,197,94,0.2)]">{f.category}</span>
                  </div>
                  <h4 className="text-[13px] font-semibold text-[var(--text-1)]">{f.question}</h4>
                  {f.question_somali && <p className="text-[11px] text-[var(--text-3)] italic mt-0.5">{f.question_somali}</p>}
                  <p className="text-[12px] text-[var(--text-2)] mt-2">{f.answer}</p>
                  {f.answer_somali && <p className="text-[11px] text-[var(--text-3)] italic mt-1">{f.answer_somali}</p>}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button onClick={() => handleEdit(f)} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] text-[var(--text-3)] hover:text-[var(--text-2)]"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(f.id)} className="p-2 rounded-lg hover:bg-red-500/5 text-[var(--text-3)] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
