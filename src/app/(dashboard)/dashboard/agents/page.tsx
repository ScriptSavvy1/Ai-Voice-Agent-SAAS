"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getAgent, updateAgent } from "@/services/agents";
import { VOICE_OPTIONS, VOICE_PERSONALITIES, DEFAULT_SOMALI_SYSTEM_PROMPT, DEFAULT_SOMALI_GREETING } from "@/constants";
import type { Agent } from "@/types";
import { Bot, Save, Volume2, Sparkles } from "lucide-react";

export default function AgentsPage() {
  const { business } = useBusinessContext();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", voice_id: "alloy", personality: "professional", greeting_message: "", greeting_message_somali: "", system_prompt: "", somali_system_prompt: "" });

  useEffect(() => {
    if (!business) return;
    const load = async () => {
      const data = await getAgent(business.id);
      if (data) {
        setAgent(data);
        setForm({ name: data.name, voice_id: data.voice_id, personality: data.personality, greeting_message: data.greeting_message, greeting_message_somali: data.greeting_message_somali, system_prompt: data.system_prompt || "", somali_system_prompt: data.somali_system_prompt || "" });
      }
      setLoading(false);
    };
    load();
  }, [business]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    setSaving(true);
    await updateAgent(agent.id, { name: form.name, voice_id: form.voice_id, personality: form.personality, greeting_message: form.greeting_message, greeting_message_somali: form.greeting_message_somali, system_prompt: form.system_prompt || null, somali_system_prompt: form.somali_system_prompt || null });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="space-y-4 animate-pulse"><div className="card-surface h-96 shimmer-bg" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-[13px] text-[var(--text-2)]">Configure how your AI voice agent sounds and behaves when talking to customers in Somali.</p>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Config */}
        <div className="card-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)] flex items-center gap-2"><Bot className="w-4 h-4 text-[var(--green)]" />Agent Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">Agent Name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="label-text">Personality</label>
              <select className="input-field" value={form.personality} onChange={(e) => setForm({ ...form, personality: e.target.value })}>
                {VOICE_PERSONALITIES.map((p) => <option key={p.value} value={p.value}>{p.label} — {p.description}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Voice */}
        <div className="card-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)] flex items-center gap-2"><Volume2 className="w-4 h-4 text-[var(--green)]" />Voice Selection</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {VOICE_OPTIONS.map((v) => (
              <button key={v.value} type="button" onClick={() => setForm({ ...form, voice_id: v.value })} className={`p-3 rounded-lg border text-left transition-all ${form.voice_id === v.value ? "border-[var(--border-hi)] bg-[var(--green-dim)]" : "border-[var(--border)] bg-[var(--bg-raised)] hover:border-[rgba(255,255,255,0.12)]"}`}>
                <p className="text-[12px] font-semibold text-[var(--text-1)]">{v.label}</p>
                <p className="text-[10px] text-[var(--text-3)] mt-0.5">{v.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Greetings */}
        <div className="card-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)] flex items-center gap-2"><Sparkles className="w-4 h-4 text-[var(--green)]" />Greetings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">English Greeting</label><textarea className="input-field" rows={2} value={form.greeting_message} onChange={(e) => setForm({ ...form, greeting_message: e.target.value })} /></div>
            <div><label className="label-text">Somali Greeting</label><textarea className="input-field" rows={2} value={form.greeting_message_somali} onChange={(e) => setForm({ ...form, greeting_message_somali: e.target.value })} placeholder={DEFAULT_SOMALI_GREETING} /></div>
          </div>
        </div>

        {/* System Prompts */}
        <div className="card-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)]">System Prompts (Advanced)</h3>
          <p className="text-[11px] text-[var(--text-3)]">Customize how the AI behaves. Leave blank to use defaults.</p>
          <div><label className="label-text">English System Prompt</label><textarea className="input-field" rows={4} value={form.system_prompt} onChange={(e) => setForm({ ...form, system_prompt: e.target.value })} placeholder="You are a helpful voice assistant..." /></div>
          <div><label className="label-text">Somali System Prompt</label><textarea className="input-field" rows={4} value={form.somali_system_prompt} onChange={(e) => setForm({ ...form, somali_system_prompt: e.target.value })} placeholder={DEFAULT_SOMALI_SYSTEM_PROMPT} /></div>
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
