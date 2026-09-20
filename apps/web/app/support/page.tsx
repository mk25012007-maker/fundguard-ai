import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← Back to FundGuard AI
        </Link>

        <div className="mt-10">
          <p className="text-sm font-medium text-primary">SUPPORT</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">How can we help?</h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Find help with your FundGuard AI account, trading dashboard, payments, risk monitoring,
            and other platform features.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-3xl">🔐</div>

            <h2 className="mt-4 text-xl font-semibold">Account & Login</h2>

            <p className="mt-3 leading-7 text-muted">
              Having trouble signing in, registering, or accessing your FundGuard AI account?
            </p>

            <Link
              href="/login"
              className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
            >
              Go to Login →
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-3xl">💳</div>

            <h2 className="mt-4 text-xl font-semibold">Payments & Subscription</h2>

            <p className="mt-3 leading-7 text-muted">
              Need help with your PRO subscription, payment, or pricing?
            </p>

            <Link
              href="/pricing"
              className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
            >
              View Pricing →
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-3xl">🛡️</div>

            <h2 className="mt-4 text-xl font-semibold">Risk Monitoring</h2>

            <p className="mt-3 leading-7 text-muted">
              Questions about risk rules, risk violations, alerts, or account protection features?
            </p>

            <Link
              href="/dashboard"
              className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
            >
              Open Dashboard →
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-3xl">🤖</div>

            <h2 className="mt-4 text-xl font-semibold">AI Insights</h2>

            <p className="mt-3 leading-7 text-muted">
              Need help understanding AI-generated insights or analytics? Review your trading
              information inside the dashboard.
            </p>

            <Link
              href="/dashboard/ai-insights"
              className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
            >
              Open AI Insights →
            </Link>
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold">Contact Support</h2>

          <p className="mt-3 max-w-2xl leading-7 text-muted">
            If you cannot find the answer you need, contact FundGuard AI support with a description
            of the issue, the affected feature, and any relevant error message.
          </p>

          <div className="mt-6 rounded-xl border border-border p-5">
            <p className="text-sm text-muted">Support email</p>

            <p className="mt-2 font-semibold">support@fundguardai.in</p>

            <p className="mt-2 text-sm text-muted">
              Please do not send passwords, API keys, payment card details, or other sensitive
              credentials through email.
            </p>
          </div>
        </section>

        <div className="mt-10 border-t border-border pt-6">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Return to FundGuard AI
          </Link>
        </div>
      </div>
    </main>
  );
}
