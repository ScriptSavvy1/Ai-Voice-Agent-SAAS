"use client";

interface WaveformProps {
  active: boolean;
  color?: string;
  barCount?: number;
}

export default function Waveform({ active, color = "#22c55e", barCount = 8 }: WaveformProps) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-6">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: active ? "100%" : "4px",
            background: color,
            animationPlayState: active ? "running" : "paused",
            animationDelay: `${i * 0.1}s`,
            transition: "height 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}
