"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            ? Back to Dashboard
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            FundGuard AI
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            FundGuard AI Pricing — Trading Risk Management Plans
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Start free and upgrade when you need advanced risk monitoring, analytics, and AI
            insights.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">FREE</h2>

            <p className="mt-2 text-slate-400">For traders getting started.</p>

            <div className="mt-6 text-4xl font-bold">
              ?0
              <span className="text-base font-normal text-slate-400">/month</span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li>? 1 trading account</li>
              <li>? Limited trade tracking</li>
              <li>? Basic risk monitoring</li>
              <li>? Limited AI insights</li>
              <li>? Basic analytics</li>
            </ul>

            <button
              disabled
              className="mt-8 w-full rounded-xl bg-slate-800 px-5 py-3 font-semibold text-slate-400"
            >
              Current Plan
            </button>
          </div>

          <div className="relative rounded-2xl border border-emerald-500 bg-slate-900 p-8 shadow-lg shadow-emerald-500/10">
            <div className="absolute right-6 top-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950">
              PRO
            </div>

            <h2 className="text-2xl font-bold">PRO</h2>

            <p className="mt-2 text-slate-400">For serious funded traders.</p>

            <div className="mt-6 text-4xl font-bold">
              ?299
              <span className="text-base font-normal text-slate-400">/month</span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li>? Multiple trading accounts</li>
              <li>? Unlimited trade tracking</li>
              <li>? Full risk monitoring</li>
              <li>? Risk alerts</li>
              <li>? Advanced analytics</li>
              <li>? Full AI insights</li>
              <li>? Notifications</li>
              <li>? Priority support</li>
            </ul>

            <button
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-xl bg-slate-700 px-5 py-3 font-bold text-slate-400"
            >
              PRO Payments Coming Soon
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Online payments are temporarily unavailable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
