"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME, INDUSTRIES } from "@/constants";
import {
  Bot,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("general");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Failed to create account");
        return;
      }

      // 2. Create business profile
      const { data: business, error: bizError } = await supabase
        .from("businesses")
        .insert({
          owner_id: authData.user.id,
          name: businessName,
          industry,
        } as any)
        .select()
        .single();

      if (bizError) {
        setError(bizError.message);
        return;
      }

      // 3. Create default AI agent
      await supabase.from("agents").insert({
        business_id: (business as any).id,
        name: "AI Receptionist",
      } as any);

      // 4. Create default widget
      await supabase.from("widgets").insert({
        business_id: (business as any).id,
      } as any);

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
      {/* ─── Left Side: Benefits ─── */}
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

        {/* Benefits */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--green-dim)] border border-[rgba(34,197,94,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--green)]" />
            <span className="text-xs font-medium text-[var(--green)]">
              Free Forever Plan
            </span>
          </div>

          <div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-[var(--text-1)]">
              Set up your
              <br />
              <span className="text-gradient">AI receptionist</span>
              <br />
              in minutes.
            </h2>
            <p className="mt-4 text-[15px] text-[var(--text-2)] max-w-md leading-relaxed">
              Create your business profile, configure your AI agent, and start
              handling customer calls automatically.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Business profile ready in minutes",
              "Trained on your exact services",
              "Live in under 30 seconds",
              "No engineering degree required",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--green)] flex-shrink-0" />
                <span className="text-sm text-[var(--text-2)]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div />
      </div>

      {/* ─── Right Side: Signup Form ─── */}
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
              Free Forever
            </div>
          </div>

          {/* Card */}
          <div className="card-glow p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[var(--text-1)]">
                Create your account
              </h3>
              <p className="text-sm text-[var(--text-2)] mt-2">
                Start your AI receptionist in under 5 minutes
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="label-text">
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  className="input-field"
                  placeholder="e.g., AutoCare Pro Garage"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="label-text">
                  Industry
                </label>
                <select
                  id="industry"
                  className="input-field"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

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
                <input
                  id="password"
                  type="password"
                  className="input-field"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Get Started Free
                  </span>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-[var(--text-2)] mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--green)] font-semibold hover:text-[var(--green-hi)] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-[10px] text-[var(--text-3)] mt-4">
            By signing up you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
