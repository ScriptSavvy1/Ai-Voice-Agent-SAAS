"use client";

import { useEffect, useState } from "react";
import { useBusinessContext } from "@/providers/BusinessProvider";
import { getConversations } from "@/services/conversations";
import { formatRelativeTime, formatDuration, getSentimentColor } from "@/lib/utils";
import type { Conversation } from "@/types";
import type { TranscriptEntry } from "@/types/database";
import { MessageSquare, Clock, Calendar, X, Bot, User } from "lucide-react";

export default function ConversationsPage() {
  const { business } = useBusinessContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!business) return;
    const load = async () => { const data = await getConversations(business.id); setConversations(data); setLoading(false); };
    load();
  }, [business]);

  if (loading) return <div className="space-y-4 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="card-surface h-16 shimmer-bg" />)}</div>;

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* List */}
      <div className="w-full lg:w-[400px] space-y-2 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <MessageSquare className="w-10 h-10 text-[var(--text-3)] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[var(--text-1)] mb-1">No conversations yet</h3>
            <p className="text-[12px] text-[var(--text-3)]">AI conversations will appear here.</p>
          </div>
        ) : conversations.map((c) => (
          <button key={c.id} onClick={() => setSelected(c)} className={`w-full card-surface p-4 text-left transition-all ${selected?.id === c.id ? "!border-[var(--border-hi)]" : ""}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-semibold text-[var(--text-1)]">{c.customer_identifier || "Unknown caller"}</span>
              <span className={`text-[10px] font-semibold capitalize ${getSentimentColor(c.sentiment)}`}>{c.sentiment}</span>
            </div>
            <p className="text-[11px] text-[var(--text-3)] line-clamp-1">{c.summary || "No summary"}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-3)]"><Clock className="w-3 h-3" />{formatDuration(c.duration_seconds)}</span>
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-3)]"><Calendar className="w-3 h-3" />{formatRelativeTime(c.created_at)}</span>
              {c.appointment_booked && <span className="text-[10px] text-[var(--green)] font-semibold">📅 Booked</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Transcript Panel */}
      <div className="hidden lg:flex flex-1 flex-col card-surface overflow-hidden">
        {selected ? (
          <>
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-1)]">{selected.customer_identifier || "Conversation"}</h3>
                <p className="text-[11px] text-[var(--text-3)]">{formatDuration(selected.duration_seconds)} · {selected.language === "so" ? "Somali" : selected.language}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[var(--text-3)] hover:text-[var(--text-2)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(selected.transcript as TranscriptEntry[]).map((entry, i) => (
                <div key={i} className={`flex gap-2 ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
                  {entry.role === "assistant" && <div className="w-6 h-6 rounded-full bg-[var(--green-dim)] flex items-center justify-center flex-shrink-0"><Bot className="w-3 h-3 text-[var(--green)]" /></div>}
                  <div className={`max-w-[75%] px-3 py-2 rounded-xl text-[12px] ${entry.role === "user" ? "bg-[var(--bg-raised)] text-[var(--text-1)]" : "bg-[var(--green-dim)] text-[var(--text-1)]"}`}>
                    {entry.content}
                  </div>
                  {entry.role === "user" && <div className="w-6 h-6 rounded-full bg-[var(--bg-raised)] flex items-center justify-center flex-shrink-0"><User className="w-3 h-3 text-[var(--text-3)]" /></div>}
                </div>
              ))}
            </div>
            {selected.summary && (
              <div className="p-4 border-t border-[var(--border)]">
                <p className="text-[11px] text-[var(--text-3)]"><strong>Summary:</strong> {selected.summary}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-[var(--text-3)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-3)]">Select a conversation to view the transcript</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
