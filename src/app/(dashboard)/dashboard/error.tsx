"use client";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">Something went wrong</h2>
        <p className="text-[13px] text-[var(--text-3)] mb-4">{error.message}</p>
        <button onClick={reset} className="btn-primary">Try Again</button>
      </div>
    </div>
  );
}
