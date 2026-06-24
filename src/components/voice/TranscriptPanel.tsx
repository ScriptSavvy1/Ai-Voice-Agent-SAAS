"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@/types/database";
import { Bot, User } from "lucide-react";

interface TranscriptPanelProps {
  transcript: TranscriptEntry[];
  primaryColor?: string;
  maxHeight?: number;
}

export default function TranscriptPanel({ transcript, primaryColor = "#22c55e", maxHeight = 200 }: TranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className="border-t overflow-y-auto px-3 py-2 space-y-2" style={{ borderColor: "rgba(255,255,255,0.07)", maxHeight }}>
      {transcript.map((entry, i) => (
        <div key={i} className={`flex gap-2 ${entry.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
          {entry.role === "assistant" && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${primaryColor}20` }}>
              <Bot className="w-2.5 h-2.5" style={{ color: primaryColor }} />
            </div>
          )}
          <div
            className="max-w-[80%] px-2.5 py-1.5 rounded-lg text-[11px] leading-relaxed"
            style={{
              background: entry.role === "user" ? "rgba(255,255,255,0.06)" : `${primaryColor}15`,
              color: "#e2e8f0",
            }}
          >
            {entry.content}
          </div>
          {entry.role === "user" && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
              <User className="w-2.5 h-2.5" style={{ color: "#4b6070" }} />
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
