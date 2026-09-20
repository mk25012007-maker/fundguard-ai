"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            FundGuard <span className="text-primary">AI</span>
          </Link>

          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/pricing" className="text-muted transition hover:text-foreground">
              Pricing
            </Link>

            <Link href="/login" className="text-muted transition hover:text-foreground">
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          {/* Hero Content */}
          <div>
            <div className="mb-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-primary">
              AI-POWERED TRADING RISK MANAGEMENT
            </div>

            <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
              Trade smarter.
              <br />
              <span className="text-primary">Protect your account.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              FundGuard AI helps funded traders monitor risk, detect rule violations, track trades,
              and stay disciplined with intelligent AI-powered insights.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
              >
                Start Free
              </Link>

              <Link
                href="/pricing"
                className="rounded-lg border border-border px-6 py-3 text-center font-semibold transition hover:bg-muted/10"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              <span>✓ Risk Monitoring</span>
              <span>✓ AI Insights</span>
              <span>✓ Trade Tracking</span>
              <span>✓ Rule Protection</span>
            </div>
          </div>

          {/* Product Preview */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">FundGuard AI</p>
                  <h2 className="mt-1 text-xl font-semibold">Risk Overview</h2>
                </div>

                <div className="rounded-full px-3 py-1 text-sm font-medium text-success">
                  Protected
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted">Daily Risk</p>
                  <p className="mt-2 text-2xl font-bold">1.2%</p>
                  <p className="mt-1 text-sm text-success">Within limits</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted">Risk Rules</p>
                  <p className="mt-2 text-2xl font-bold">8/8</p>
                  <p className="mt-1 text-sm text-success">Protected</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted">Trades Today</p>
                  <p className="mt-2 text-2xl font-bold">3</p>
                  <p className="mt-1 text-sm text-muted">Tracked</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted">AI Insight</p>
                  <p className="mt-2 text-sm font-medium">Risk discipline is improving.</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Account Protection</span>
                  <span className="text-sm font-semibold text-success">Active</span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted/20">
                  <div className="h-full w-[82%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">POWERFUL TRADING PROTECTION</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to trade with discipline
            </h2>

            <p className="mt-4 text-muted">
              FundGuard AI brings risk monitoring, trade tracking, analytics, and AI-powered
              insights together in one platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 text-3xl">🛡️</div>

              <h3 className="text-xl font-semibold">Risk Monitoring</h3>

              <p className="mt-3 leading-7 text-muted">
                Monitor your trading risk and keep your account within predefined risk limits.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 text-3xl">⚠️</div>

              <h3 className="text-xl font-semibold">Risk Violation Detection</h3>

              <p className="mt-3 leading-7 text-muted">
                Identify risky trading behavior and potential rule violations before they become
                bigger problems.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 text-3xl">📊</div>

              <h3 className="text-xl font-semibold">Trade Tracking</h3>

              <p className="mt-3 leading-7 text-muted">
                Record and organize your trades so you can understand your performance and trading
                behavior.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 text-3xl">🤖</div>

              <h3 className="text-xl font-semibold">AI Insights</h3>

              <p className="mt-3 leading-7 text-muted">
                Get AI-generated insights that help you identify patterns, mistakes, and areas for
                improvement.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 text-3xl">📈</div>

              <h3 className="text-xl font-semibold">Advanced Analytics</h3>

              <p className="mt-3 leading-7 text-muted">
                Understand your trading performance through clear analytics and performance metrics.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 text-3xl">🔔</div>

              <h3 className="text-xl font-semibold">Smart Notifications</h3>

              <p className="mt-3 leading-7 text-muted">
                Stay informed about important trading activity, risk events, and account conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">HOW IT WORKS</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              From trading activity to better decisions
            </h2>

            <p className="mt-4 text-muted">
              FundGuard AI helps you understand your trading behavior and stay within your risk
              rules.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="relative rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                1
              </div>

              <h3 className="text-xl font-semibold">Connect Your Account</h3>

              <p className="mt-3 leading-7 text-muted">
                Add your trading account and configure the risk rules that matter to your trading
                strategy.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                2
              </div>

              <h3 className="text-xl font-semibold">Monitor Your Trading</h3>

              <p className="mt-3 leading-7 text-muted">
                Track trades, monitor risk, and receive notifications when important risk conditions
                are detected.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                3
              </div>

              <h3 className="text-xl font-semibold">Learn & Improve</h3>

              <p className="mt-3 leading-7 text-muted">
                Use analytics and AI-generated insights to understand your trading behavior and
                improve your discipline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Monitoring + AI Insights */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Risk Monitoring */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">RISK MONITORING</p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Know your risk before it becomes a problem.
                  </h2>
                </div>

                <div className="text-3xl">🛡️</div>
              </div>

              <p className="mt-4 leading-7 text-muted">
                FundGuard AI continuously helps you monitor important trading risk metrics and
                identify situations that could put your account at risk.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Daily Drawdown</span>

                    <span className="font-semibold text-success">1.2%</span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-muted/20">
                    <div className="h-2 w-[32%] rounded-full bg-primary" />
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Risk Per Trade</span>

                    <span className="font-semibold text-success">0.8%</span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-muted/20">
                    <div className="h-2 w-[40%] rounded-full bg-primary" />
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                  <span className="text-xl">✓</span>

                  <div>
                    <p className="font-medium">Risk rules within limits</p>

                    <p className="text-sm text-muted">Your account is currently protected.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">AI INSIGHTS</p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Turn trading data into useful insights.
                  </h2>
                </div>

                <div className="text-3xl">🤖</div>
              </div>

              <p className="mt-4 leading-7 text-muted">
                Analyze your trading activity and receive AI-generated observations that can help
                you recognize patterns and improve your trading discipline.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm font-medium">Trading Pattern</p>

                  <p className="mt-2 leading-6 text-muted">
                    Your recent trades show improved consistency in position sizing.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm font-medium">Risk Observation</p>

                  <p className="mt-2 leading-6 text-muted">
                    Consider reducing exposure after multiple consecutive trades.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm font-medium">Discipline Insight</p>

                  <p className="mt-2 leading-6 text-muted">
                    Your rule adherence has remained consistent across recent trading sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">SIMPLE PRICING</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Start free. Upgrade when you need more.
            </h2>

            <p className="mt-4 text-muted">Choose the plan that fits your trading journey.</p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <p className="text-sm font-medium text-muted">FREE</p>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-bold">₹0</span>
                <span className="mb-1 text-muted">/month</span>
              </div>

              <p className="mt-4 text-muted">
                Start monitoring your trading risk with the essentials.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ 1 trading account</li>
                <li>✓ Basic risk monitoring</li>
                <li>✓ Limited trade tracking</li>
                <li>✓ Basic analytics</li>
                <li>✓ Limited AI insights</li>
              </ul>

              <Link
                href="/register"
                className="mt-8 block rounded-lg border border-border px-5 py-3 text-center font-semibold transition hover:bg-muted/10"
              >
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-primary bg-card p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary">PRO</p>

                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  ₹299/month
                </span>
              </div>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-bold">₹299</span>
                <span className="mb-1 text-muted">/month</span>
              </div>

              <p className="mt-4 text-muted">
                Unlock the full FundGuard AI risk management experience.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Multiple trading accounts</li>
                <li>✓ Unlimited trade tracking</li>
                <li>✓ Full risk monitoring</li>
                <li>✓ Risk alerts</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Full AI insights</li>
                <li>✓ Notifications</li>
                <li>✓ Priority support</li>
              </ul>

              <Link
                href="/pricing"
                className="mt-8 block rounded-lg bg-primary px-5 py-3 text-center font-semibold text-white transition hover:opacity-90"
              >
                Upgrade to PRO
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
              View full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-white">
            🛡️
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Protect your trading journey with FundGuard AI.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Monitor your risk, understand your trading behavior, and build better trading discipline
            with AI-powered insights.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Start Free
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-border px-6 py-3 font-semibold transition hover:bg-muted/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="text-xl font-bold tracking-tight">
                FundGuard <span className="text-primary">AI</span>
              </Link>

              <p className="mt-4 max-w-md leading-7 text-muted">
                Helping funded traders pass challenges with AI-powered risk management, trade
                tracking, analytics, and insights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Product</h3>

              <div className="mt-4 space-y-3 text-sm text-muted">
                <Link href="/pricing" className="block hover:text-foreground">
                  Pricing
                </Link>

                <Link href="/register" className="block hover:text-foreground">
                  Get Started
                </Link>

                <Link href="/login" className="block hover:text-foreground">
                  Login
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Legal & Support</h3>

              <div className="mt-4 space-y-3 text-sm text-muted">
                <Link href="/terms" className="block hover:text-foreground">
                  Terms of Service
                </Link>

                <Link href="/privacy" className="block hover:text-foreground">
                  Privacy Policy
                </Link>

                <Link href="/support" className="block hover:text-foreground">
                  Support
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-sm text-muted">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <p>© {new Date().getFullYear()} FundGuard AI. All rights reserved.</p>

              <p>AI-powered trading risk management platform.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
