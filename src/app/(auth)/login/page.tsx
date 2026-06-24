"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/constants";
import {
  Bot,
  Phone,
  CalendarCheck,
  BarChart3,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex">
      {/* ─── Left Side: Features ─── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 xl:p-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-1)]">
              {APP_NAME}
            </h1>
            <p className="text-[11px] text-[var(--text-3)]">
              AI Voice Receptionist Platform
            </p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="space-y-8">
          {/* Powered badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--green-dim)] border border-[rgba(34,197,94,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--green)]" />
            <span className="text-xs font-medium text-[var(--green)]">
              Powered by GPT-4o Realtime
            </span>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-[var(--text-1)]">
              Your business&apos;s
              <br />
              <span className="text-gradient">AI receptionist</span>
              <br />
              never sleeps.
            </h2>
            <p className="mt-4 text-[15px] text-[var(--text-2)] max-w-md leading-relaxed">
              Handle calls, book appointments, and capture leads
              automatically — while you focus on your business.
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-4">
            {[
              {
                icon: Phone,
                title: "Never miss a call",
                desc: "AI answers 24/7, even after hours",
              },
              {
                icon: CalendarCheck,
                title: "Auto-book appointments",
                desc: "Customers schedule while they talk",
              },
              {
                icon: BarChart3,
                title: "Real-time analytics",
                desc: "Track calls, leads & conversions",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <feature.icon className="w-4 h-4 text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-1)]">
                    {feature.title}
                  </p>
                  <p className="text-xs text-[var(--text-3)]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="flex items-center gap-8 text-center">
          {[
            { value: "24/7", label: "Availability" },
            { value: "3 min", label: "Avg. Call" },
            { value: "10x", label: "Efficiency" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-[11px] text-[var(--text-3)] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right Side: Login Form ─── */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-md">
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-3)]">
              <Shield className="w-3.5 h-3.5 text-[var(--green)]" />
              SSL Secured
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-3)]">
              <Clock className="w-3.5 h-3.5 text-[var(--green)]" />
              99.9% Uptime
            </div>
          </div>

          {/* Card */}
          <div className="card-glow p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[var(--text-1)]">
                Welcome back
              </h3>
              <p className="text-sm text-[var(--text-2)] mt-2">
                Sign in to your {APP_NAME} dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="label-text">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="label-text">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </button>
            </form>

            {/* Signup link */}
            <p className="text-center text-sm text-[var(--text-2)] mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--green)] font-semibold hover:text-[var(--green-hi)] transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-[10px] text-[var(--text-3)] mt-4">
            By signing in you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
