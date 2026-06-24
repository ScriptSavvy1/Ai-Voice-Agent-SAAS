"use client";

import { useState } from "react";
import { useRealtimeVoice } from "@/hooks/useRealtimeVoice";
import VoiceOrb from "./VoiceOrb";
import Waveform from "./Waveform";
import TranscriptPanel from "./TranscriptPanel";
import { formatDuration } from "@/lib/utils";
import { Phone, PhoneOff, X, Minimize2 } from "lucide-react";

interface VoiceWidgetProps {
  businessId: string;
  position?: "bottom-right" | "bottom-left";
  primaryColor?: string;
  greetingText?: string;
}

export default function VoiceWidget({ businessId, position = "bottom-right", primaryColor = "#22c55e", greetingText = "Talk to AI" }: VoiceWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, transcript, duration, error, connect, disconnect, isConnected } = useRealtimeVoice({ businessId });

  const positionClass = position === "bottom-left" ? "left-5" : "right-5";

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (isConnected) {
      disconnect();
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleCall = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  return (
    <div className={`fixed bottom-5 ${positionClass} z-50`}>
      {/* Expanded Panel */}
      {isOpen && (
        <div className="mb-3 w-[340px] rounded-2xl overflow-hidden animate-slide-up" style={{ background: "#0d1518", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: isConnected ? primaryColor : "#4b6070" }} />
              <span className="text-[12px] font-semibold" style={{ color: "#f1f5f9" }}>
                {isConnected ? `Live · ${formatDuration(duration)}` : "AI Voice Agent"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-white/5" style={{ color: "#4b6070" }}>
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleToggle} className="p-1 rounded hover:bg-white/5" style={{ color: "#4b6070" }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Voice Area */}
          <div className="px-4 py-6 flex flex-col items-center">
            <VoiceOrb state={state} primaryColor={primaryColor} />
            <div className="mt-3">
              {state === "listening" && <Waveform active={true} color={primaryColor} />}
              {state === "speaking" && <Waveform active={true} color={primaryColor} />}
            </div>
            <p className="text-[11px] mt-2 capitalize" style={{ color: "#4b6070" }}>
              {state === "idle" ? "Tap to start" : state === "connecting" ? "Connecting..." : state === "listening" ? "Listening..." : state === "speaking" ? "Speaking..." : state === "error" ? error || "Error" : "Connected"}
            </p>
          </div>

          {/* Transcript */}
          {transcript.length > 0 && (
            <TranscriptPanel transcript={transcript} primaryColor={primaryColor} />
          )}

          {/* Call Button */}
          <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <button onClick={handleCall} className="w-full py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all" style={{ background: isConnected ? "#dc2626" : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`, color: "#fff" }}>
              {isConnected ? <><PhoneOff className="w-4 h-4" />End Call</> : <><Phone className="w-4 h-4" />Start Call</>}
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button onClick={handleToggle} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`, boxShadow: `0 4px 20px ${primaryColor}40` }}>
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Phone className="w-5 h-5 text-white" />}
      </button>
      {!isOpen && (
        <span className="absolute -top-1 left-0 right-0 text-center text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: primaryColor }}>
          {greetingText}
        </span>
      )}
    </div>
  );
}
