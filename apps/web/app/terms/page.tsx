import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← Back to FundGuard AI
        </Link>

        <div className="mt-10">
          <p className="text-sm font-medium text-primary">LEGAL</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">Terms of Service</h1>

          <p className="mt-4 text-sm text-muted">Last updated: September 2026</p>
        </div>

        <div className="mt-12 space-y-10 leading-7 text-muted">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. About FundGuard AI</h2>

            <p className="mt-4">
              FundGuard AI is a software-as-a-service platform designed to help traders track
              trading activity, monitor risk, analyze performance, and receive AI-generated
              insights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Acceptance of Terms</h2>

            <p className="mt-4">
              By creating an account or using FundGuard AI, you agree to these Terms of Service. If
              you do not agree with these terms, you should not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Account Responsibility</h2>

            <p className="mt-4">
              You are responsible for maintaining the security of your account credentials and for
              activity performed through your account. You should provide accurate information when
              creating and maintaining your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Use of the Service</h2>

            <p className="mt-4">
              FundGuard AI may be used for lawful trading-related record keeping, risk monitoring,
              analytics, and educational purposes. You agree not to misuse, disrupt, reverse
              engineer, or attempt to gain unauthorized access to the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">
              5. Trading and Financial Disclaimer
            </h2>

            <p className="mt-4">
              FundGuard AI provides software tools, analytics, monitoring, and AI-generated
              information. The service does not provide personalized financial, investment, legal,
              or tax advice.
            </p>

            <p className="mt-4">
              Trading and investing involve substantial risk. You are solely responsible for your
              trading decisions, account management, and financial outcomes.
            </p>

            <p className="mt-4">
              FundGuard AI does not guarantee profits, successful trading outcomes, or that a trader
              will pass any proprietary trading challenge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. AI-Generated Information</h2>

            <p className="mt-4">
              AI-generated insights may contain errors, omissions, or inaccuracies. You should
              independently evaluate information provided by the platform before relying on it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">
              7. Subscriptions and Payments
            </h2>

            <p className="mt-4">
              Certain features may require a paid subscription. Pricing, subscription terms, and
              available features are displayed on the FundGuard AI pricing page.
            </p>

            <p className="mt-4">
              Payments are processed through third-party payment providers. FundGuard AI does not
              store complete payment card information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Service Availability</h2>

            <p className="mt-4">
              We aim to keep FundGuard AI available and reliable, but we do not guarantee
              uninterrupted or error-free operation. The service may occasionally be unavailable
              because of maintenance, technical problems, or circumstances outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Intellectual Property</h2>

            <p className="mt-4">
              FundGuard AI and its software, branding, design, content, and technology are protected
              by applicable intellectual property laws. You may not copy, reproduce, distribute, or
              commercially exploit the platform without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Termination</h2>

            <p className="mt-4">
              We may suspend or terminate access to an account when reasonably necessary, including
              for violations of these terms, security concerns, misuse of the platform, or other
              legitimate reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">11. Limitation of Liability</h2>

            <p className="mt-4">
              To the extent permitted by applicable law, FundGuard AI is not responsible for losses
              arising from trading decisions, market movements, missed opportunities, inaccurate
              user-provided data, or reliance on AI-generated information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">12. Changes to These Terms</h2>

            <p className="mt-4">
              We may update these Terms of Service from time to time. Updated terms will be
              published on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">13. Contact</h2>

            <p className="mt-4">
              If you have questions about these Terms of Service, please contact FundGuard AI
              through the support channel provided on the website.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Return to FundGuard AI
          </Link>
        </div>
      </div>
    </main>
  );
}
