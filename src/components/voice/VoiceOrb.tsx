"use client";

import type { VoiceSessionState } from "@/types";

interface VoiceOrbProps {
  state: VoiceSessionState;
  primaryColor?: string;
  size?: number;
}

export default function VoiceOrb({ state, primaryColor = "#22c55e", size = 80 }: VoiceOrbProps) {
  const isActive = state === "listening" || state === "speaking";
  const isConnecting = state === "connecting";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Pulse rings */}
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full pulse-ring" style={{ border: `2px solid ${primaryColor}30` }} />
          <div className="absolute rounded-full pulse-ring" style={{ inset: -8, border: `1px solid ${primaryColor}15`, animationDelay: "0.5s" }} />
        </>
      )}

      {/* Main orb */}
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-300 ${isConnecting ? "animate-spin-slow" : isActive ? "animate-glow" : ""}`}
        style={{
          width: size * 0.75,
          height: size * 0.75,
          background: `radial-gradient(circle at 35% 35%, ${primaryColor}40, ${primaryColor}20, transparent)`,
          border: `2px solid ${primaryColor}${isActive ? "60" : "30"}`,
          boxShadow: isActive
            ? `0 0 30px ${primaryColor}30, 0 0 60px ${primaryColor}15`
            : `0 0 15px ${primaryColor}10`,
        }}
      >
        {/* Inner dot */}
        <div
          className={`rounded-full ${isActive ? "animate-pulse" : ""}`}
          style={{
            width: size * 0.2,
            height: size * 0.2,
            background: primaryColor,
            boxShadow: `0 0 10px ${primaryColor}60`,
          }}
        />
      </div>
    </div>
  );
}
