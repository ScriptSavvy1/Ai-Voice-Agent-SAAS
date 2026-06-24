"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getWidget, updateWidget } from "@/services/widgets";
import { APP_URL } from "@/constants";
import type { Widget } from "@/types";
import { Code, Copy, Check, ExternalLink, Save } from "lucide-react";

export default function WidgetPage() {
  const { business } = useBusinessContext();
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<{ position: "bottom-right" | "bottom-left"; primary_color: string; greeting_text: string; greeting_text_somali: string; is_active: boolean }>({ position: "bottom-right", primary_color: "#22c55e", greeting_text: "Talk to AI", greeting_text_somali: "La hadal AI-ga", is_active: true });

  useEffect(() => {
    if (!business) return;
    const load = async () => { const data = await getWidget(business.id); if (data) { setWidget(data); setForm({ position: data.position, primary_color: data.primary_color, greeting_text: data.greeting_text, greeting_text_somali: data.greeting_text_somali, is_active: data.is_active }); } setLoading(false); };
    load();
  }, [business]);

  const handleSave = async () => { if (!widget) return; setSaving(true); await updateWidget(widget.id, form); setSaving(false); };

  const embedCode = `<!-- Paste before </body> -->\n<script src="${APP_URL}/widget.js"></script>\n<script>\n  VoiceAgent.init({\n    businessId: "${business?.id || "your-business-id"}",\n    position: "${form.position}",\n    language: "so"\n  })\n</script>`;

  const copyCode = () => { navigator.clipboard.writeText(embedCode); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (loading) return <div className="card-surface h-96 shimmer-bg animate-pulse" />;

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-[13px] text-[var(--text-2)]">Embed your AI voice agent on any website with a single script tag.</p>

      {/* Embed Code */}
      <div className="card-glow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-1)] flex items-center gap-2"><Code className="w-4 h-4 text-[var(--green)]" />Embed Code</h3>
          <button onClick={copyCode} className="btn-secondary text-[11px]">
            {copied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Code</>}
          </button>
        </div>
        <div className="relative rounded-lg bg-[#0a0f12] border border-[var(--border)] p-4 overflow-x-auto">
          <pre className="text-[12px] text-[var(--text-2)] font-mono whitespace-pre">{embedCode}</pre>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
          <span className="text-[11px] text-[var(--text-3)]">Widget active — listening for calls</span>
        </div>
      </div>

      {/* Widget Settings */}
      <div className="card-surface p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-1)]">Widget Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label-text">Position</label>
            <select className="input-field" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as "bottom-right" | "bottom-left" })}>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
          <div><label className="label-text">Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer" />
              <input className="input-field" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} />
            </div>
          </div>
          <div><label className="label-text">Button Text (English)</label><input className="input-field" value={form.greeting_text} onChange={(e) => setForm({ ...form, greeting_text: e.target.value })} /></div>
          <div><label className="label-text">Button Text (Somali)</label><input className="input-field" value={form.greeting_text_somali} onChange={(e) => setForm({ ...form, greeting_text_somali: e.target.value })} /></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded accent-[var(--green)]" />
            <span className="text-[12px] text-[var(--text-2)]">Widget Active</span>
          </label>
          <button onClick={handleSave} disabled={saving} className="btn-primary"><Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>

      {/* Demo link */}
      <div className="card-surface p-4 flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-1)]">Test your widget</p>
          <p className="text-[11px] text-[var(--text-3)]">Preview how customers will interact with your AI agent</p>
        </div>
        <a href={`/widget-demo?businessId=${business?.id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary"><ExternalLink className="w-3.5 h-3.5" />Open Demo</a>
      </div>
    </div>
  );
}
