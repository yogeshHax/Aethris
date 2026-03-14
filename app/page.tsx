"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const resultRef = useRef<HTMLDivElement>(null);

  const [brief, setBrief] = useState("");
  const [plan, setPlan] = useState("");
  const [email, setEmail] = useState("");
  const [analytics, setAnalytics] = useState<{
    openRate: number;
    clickRate: number;
  } | null>(null);

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ─── Core AI Functions (unchanged logic) ─────────────────────────
  async function generatePlan() {
    setLoadingPlan(true);
    const res = await fetch("/api/plan", {
      method: "POST",
      body: JSON.stringify({ brief }),
    });
    const data = await res.json();
    setPlan(data.plan);
    setActiveStep(1);
    setLoadingPlan(false);
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  }

  async function generateEmail() {
    setLoadingEmail(true);
    const res = await fetch("/api/email", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setEmail(data.email);
    setActiveStep(2);
    setLoadingEmail(false);
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  }

  async function getAnalytics() {
    setLoadingAnalytics(true);
    const res = await fetch("/api/analytics");
    const data = await res.json();
    setAnalytics(data);
    setActiveStep(3);
    setLoadingAnalytics(false);
  }
  // ─────────────────────────────────────────────────────────────────

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Brief", icon: "📝", done: brief.length > 0 },
    { label: "Plan", icon: "🎯", done: plan.length > 0 },
    { label: "Email", icon: "✉️", done: email.length > 0 },
    { label: "Results", icon: "📊", done: analytics !== null },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* ═══ NAV BAR ═══ */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">
              CampaignX <span className="text-indigo-400">AI</span>
            </span>
          </div>

          {/* User avatar & menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm text-zinc-400 hidden sm:block">
                {user.displayName || user.email}
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 animate-[fadeIn_0.15s_ease-out]">
                <div className="px-4 py-2 border-b border-zinc-800">
                  <p className="text-sm font-medium truncate">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800/50 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 mb-4">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            AI-Powered Campaign Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Generate Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Campaign
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Enter a brief, and our AI will create a full campaign plan,
            personalized email copy, and predict your results.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeStep >= i
                    ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300"
                    : "bg-zinc-900/50 border border-zinc-800 text-zinc-500"
                }`}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-6 h-px ${
                    activeStep > i ? "bg-indigo-500/50" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ═══ Campaign Brief Input ═══ */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
              <span className="text-base">📝</span>
            </div>
            <h2 className="text-lg font-semibold">Campaign Brief</h2>
          </div>
          <textarea
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[120px] leading-relaxed"
            placeholder="Describe your campaign goal, target audience, and key message. The more detail you provide, the better the AI-generated plan will be..."
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-600">
              {brief.length} characters
            </span>
            <button
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={generatePlan}
              disabled={loadingPlan || !brief.trim()}
            >
              {loadingPlan ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* ═══ Results Section ═══ */}
        <div ref={resultRef}>
          {/* Campaign Plan */}
          {plan && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-base">🎯</span>
                  </div>
                  <h2 className="text-lg font-semibold">Campaign Plan</h2>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  ✓ Generated
                </span>
              </div>
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-950/50 rounded-xl p-5 border border-zinc-800/50 max-h-[400px] overflow-y-auto">
                {plan}
              </pre>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={generateEmail}
                  disabled={loadingEmail}
                >
                  {loadingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                      Generate Email
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Email */}
          {email && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-base">✉️</span>
                  </div>
                  <h2 className="text-lg font-semibold">Generated Email</h2>
                </div>
                <span className="text-xs text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                  ✓ Generated
                </span>
              </div>
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-950/50 rounded-xl p-5 border border-zinc-800/50 max-h-[400px] overflow-y-auto">
                {email}
              </pre>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-cyan-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={getAnalytics}
                  disabled={loadingAnalytics}
                >
                  {loadingAnalytics ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                      </svg>
                      Run Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Analytics Results */}
          {analytics && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-base">📊</span>
                  </div>
                  <h2 className="text-lg font-semibold">Campaign Results</h2>
                </div>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  ✓ Complete
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Open Rate Card */}
                <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-5">
                  <p className="text-sm text-zinc-400 mb-1">Open Rate</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      {analytics.openRate}%
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analytics.openRate}%` }}
                    />
                  </div>
                </div>

                {/* Click Rate Card */}
                <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-5">
                  <p className="text-sm text-zinc-400 mb-1">Click Rate</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      {analytics.clickRate}%
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analytics.clickRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Keyframe */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}