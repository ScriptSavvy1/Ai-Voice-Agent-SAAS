import Link from "next/link";
import { PRICING_TIERS, APP_NAME } from "@/constants";
import {
  Bot,
  Phone,
  CalendarCheck,
  BarChart3,
  Shield,
  Globe,
  Zap,
  MessageSquare,
  Code,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: Phone, title: "Never Miss a Call", desc: "AI answers 24/7 — holidays, weekends, after hours. Every call is handled.", color: "#22c55e" },
    { icon: CalendarCheck, title: "Auto-Book Appointments", desc: "Customers schedule appointments naturally during the conversation.", color: "#3b82f6" },
    { icon: MessageSquare, title: "Somali Language Native", desc: "Fluent Somali conversations. Your AI speaks your customers' language.", color: "#a855f7" },
    { icon: BarChart3, title: "Real-Time Analytics", desc: "Track calls, leads, and conversions from a beautiful dashboard.", color: "#f59e0b" },
    { icon: Shield, title: "Business Knowledge", desc: "Trained on your services, hours, FAQs, and pricing. Always accurate.", color: "#ec4899" },
    { icon: Code, title: "Embed Anywhere", desc: "One script tag. Works on any website. No coding required.", color: "#06b6d4" },
  ];

  const steps = [
    { step: "01", title: "Create Your Account", desc: "Sign up free, add your business name and industry." },
    { step: "02", title: "Configure Your AI", desc: "Add your services, FAQs, and business hours. Pick a voice." },
    { step: "03", title: "Embed & Go Live", desc: "Paste one line of code. Your AI receptionist is live." },
  ];

  return (
    <div className="min-h-screen">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 border-b border-[rgba(255,255,255,0.06)]" style={{ background: "rgba(8,15,18,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--text-1)]">{APP_NAME}</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">Features</a>
            <a href="#how-it-works" className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">How it Works</a>
            <a href="#pricing" className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[12px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Log In</Link>
            <Link href="/signup" className="btn-primary text-[12px] px-4 py-2">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[rgba(34,197,94,0.05)] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[rgba(59,130,246,0.04)] rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--green-dim)] border border-[rgba(34,197,94,0.2)] mb-8 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-[var(--green)]" />
            <span className="text-[11px] font-medium text-[var(--green)]">Powered by GPT-4o Realtime · Somali Language</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[var(--text-1)] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Your AI Voice
            <br />
            <span className="text-gradient">Receptionist</span> That
            <br />
            Never Sleeps
          </h1>

          <p className="text-lg text-[var(--text-2)] max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Deploy an AI that answers calls in <strong>Somali</strong>, books appointments,
            and handles customer questions — 24/7. Works for any business, any industry.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/signup" className="btn-primary px-8 py-3 text-sm">
              <ArrowRight className="w-4 h-4" />
              Start Free Now
            </Link>
            <a href="#features" className="btn-secondary px-6 py-3 text-sm">
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[var(--bg-base)] flex items-center justify-center text-[10px] font-bold text-white ${["bg-emerald-600", "bg-blue-600", "bg-purple-600", "bg-amber-600"][i]}`}>
                  {["AA", "MH", "FI", "HS"][i]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-3)]">Trusted by businesses</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 card-glow p-2 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]" style={{ background: "rgba(8,15,18,0.9)" }}>
              {/* Mock Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-[rgba(255,255,255,0.04)] text-[10px] text-[var(--text-3)]">
                  voicedesk.ai/dashboard
                </div>
              </div>
              {/* Mock Dashboard Content */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[{ label: "Conversations", value: "1,247" }, { label: "Appointments", value: "342" }, { label: "Conversion", value: "27.4%" }, { label: "Avg Duration", value: "3:42" }].map((s) => (
                    <div key={s.label} className="card-surface p-3 text-center">
                      <p className="text-lg font-bold text-[var(--text-1)]">{s.value}</p>
                      <p className="text-[9px] text-[var(--text-3)]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="card-surface p-4 h-32 flex items-end gap-1">
                  {[40, 65, 50, 80, 70, 90, 75, 85, 60, 95, 70, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, #22c55e40, #22c55e)` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-20 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-raised)] border border-[var(--border)] mb-4">
              <Zap className="w-3 h-3 text-[var(--green)]" />
              <span className="text-[11px] text-[var(--text-3)]">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-1)]">Everything your business needs</h2>
            <p className="text-[var(--text-2)] mt-3 max-w-lg mx-auto text-[15px]">An AI receptionist that handles calls, books appointments, and answers questions — all in Somali.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="card-surface p-6 group hover:border-[rgba(255,255,255,0.12)] transition-all">
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${f.color}15` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-[14px] font-semibold text-[var(--text-1)] mb-1">{f.title}</h3>
                <p className="text-[12px] text-[var(--text-3)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-20 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-1)]">Live in 3 simple steps</h2>
            <p className="text-[var(--text-2)] mt-3">No coding. No phone system changes. Just results.</p>
          </div>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.step} className="card-surface p-6 flex items-start gap-5">
                <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[var(--text-1)] mb-1">{s.title}</h3>
                  <p className="text-[12px] text-[var(--text-3)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Somali Language Highlight ─── */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="card-glow p-8 md:p-12 text-center">
            <Globe className="w-10 h-10 text-[var(--green)] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-1)] mb-3">
              Built for <span className="text-gradient">Somali</span> Businesses
            </h2>
            <p className="text-[var(--text-2)] max-w-lg mx-auto mb-8">
              Your AI receptionist speaks fluent Somali. Every greeting, every answer,
              every appointment booking — all in your customers&apos; language.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Somali Greetings", example: "Asalaamu calaykum!" },
                { label: "Service Queries", example: "Maxaa adeegyo ah oo aad bixisaan?" },
                { label: "Appointment Booking", example: "Waan rabaa inaan balan qabsado" },
              ].map((item) => (
                <div key={item.label} className="card-surface p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--green)] mb-1">{item.label}</p>
                  <p className="text-[13px] text-[var(--text-1)] italic">&ldquo;{item.example}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-20 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-1)]">Simple pricing</h2>
            <p className="text-[var(--text-2)] mt-3">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div key={tier.name} className={`card-surface p-6 relative ${tier.popular ? "border-[var(--border-hi)] ring-1 ring-[var(--green)] ring-opacity-20" : ""}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-green text-[10px] font-bold text-white">
                    MOST POPULAR
                  </div>
                )}
                <p className="text-[11px] font-bold tracking-wider text-[var(--text-3)] mb-2">{tier.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-[var(--text-1)]">{tier.price}</span>
                  {tier.period && <span className="text-[12px] text-[var(--text-3)]">/ {tier.period}</span>}
                </div>
                <p className="text-[12px] text-[var(--text-3)] mb-5">{tier.description}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[12px] text-[var(--text-2)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--green)] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.comingSoon ? "#" : "/signup"} className={`w-full py-2.5 text-[12px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${tier.popular ? "gradient-green text-white hover:opacity-90" : "bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-1)] hover:border-[var(--border-hi)]"}`}>
                  {tier.cta}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-1)] mb-4">
            Ready to never miss<br />a call again?
          </h2>
          <p className="text-[var(--text-2)] mb-8">Set up your AI receptionist in under 5 minutes. Free forever.</p>
          <Link href="/signup" className="btn-primary px-8 py-3 text-sm inline-flex">
            <ArrowRight className="w-4 h-4" />
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-green flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <span className="text-[12px] font-semibold text-[var(--text-1)]">{APP_NAME}</span>
          </div>
          <p className="text-[11px] text-[var(--text-3)]">&copy; {new Date().getFullYear()} {APP_NAME}. Built with AI.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] text-[var(--text-3)] hover:text-[var(--text-2)]">Login</Link>
            <Link href="/signup" className="text-[11px] text-[var(--text-3)] hover:text-[var(--text-2)]">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
