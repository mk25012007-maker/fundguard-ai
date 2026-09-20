export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            FundGuard AI
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple pricing for disciplined trading
          </h1>

          <p className="mt-5 text-lg text-slate-300">
            Start free and upgrade when you need the full FundGuard AI experience.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Free */}
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Free</h2>

            <p className="mt-2 text-slate-400">Get started with the essentials.</p>

            <div className="mt-6">
              <span className="text-5xl font-bold">₹0</span>
              <span className="text-slate-400"> / month</span>
            </div>

            <ul className="mt-8 space-y-4 text-slate-300">
              <li>✓ 1 trading account</li>
              <li>✓ Limited trade tracking</li>
              <li>✓ Basic risk monitoring</li>
              <li>✓ Limited AI insights</li>
              <li>✓ Basic analytics</li>
            </ul>

            <a
              href="/register"
              className="mt-8 block rounded-xl border border-slate-600 px-5 py-3 text-center font-semibold transition hover:bg-slate-800"
            >
              Start Free
            </a>
          </section>

          {/* Pro */}
          <section className="relative rounded-2xl border border-emerald-500 bg-slate-900 p-8 shadow-2xl">
            <div className="absolute -top-4 right-6 rounded-full bg-emerald-500 px-4 py-1 text-sm font-bold text-slate-950">
              PRO
            </div>

            <h2 className="text-2xl font-bold">Pro</h2>

            <p className="mt-2 text-slate-400">
              Everything you need for serious trading discipline.
            </p>

            <div className="mt-6">
              <span className="text-5xl font-bold">₹299</span>
              <span className="text-slate-400"> / month</span>
            </div>

            <ul className="mt-8 space-y-4 text-slate-300">
              <li>✓ Multiple trading accounts</li>
              <li>✓ Unlimited trade tracking</li>
              <li>✓ Full risk monitoring</li>
              <li>✓ Risk violation alerts</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Full AI insights</li>
              <li>✓ Notifications</li>
              <li>✓ Priority support</li>
            </ul>

            <a
              href="/register"
              className="mt-8 block rounded-xl bg-emerald-500 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Upgrade to Pro
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
