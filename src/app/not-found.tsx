import Link from "next/link";
import { Bot } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-6">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
        <p className="text-lg text-[var(--text-2)] mb-8">Page not found</p>
        <Link href="/" className="btn-primary px-6 py-3">Go Home</Link>
      </div>
    </div>
  );
}