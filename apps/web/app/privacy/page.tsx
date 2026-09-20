import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← Back to FundGuard AI
        </Link>

        <div className="mt-10">
          <p className="text-sm font-medium text-primary">LEGAL</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">Privacy Policy</h1>

          <p className="mt-4 text-sm text-muted">Last updated: September 2026</p>
        </div>

        <div className="mt-12 space-y-10 leading-7 text-muted">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>

            <p className="mt-4">
              FundGuard AI respects your privacy and is committed to protecting information
              associated with your use of our software platform. This Privacy Policy explains what
              information we collect, how we use it, and the choices available to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>

            <p className="mt-4">
              Depending on how you use FundGuard AI, we may collect account information such as your
              name, email address, and authentication information.
            </p>

            <p className="mt-4">
              We may also process trading-related information that you choose to enter into the
              platform, including trading accounts, trades, risk rules, performance information, and
              related analytics data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Information</h2>

            <p className="mt-4">
              We use collected information to provide, maintain, secure, and improve FundGuard AI
              and its features.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Create and manage your account.</li>
              <li>Provide trading and risk-monitoring features.</li>
              <li>Generate analytics and AI-powered insights.</li>
              <li>Send important service and account notifications.</li>
              <li>Process subscriptions and payments.</li>
              <li>Detect abuse, fraud, and security threats.</li>
              <li>Improve platform performance and reliability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Trading Information</h2>

            <p className="mt-4">
              FundGuard AI may process trading information that you provide or that is made
              available through supported integrations. This information is used to provide the
              trading-management features requested by you.
            </p>

            <p className="mt-4">
              You should only connect accounts or provide information that you are authorized to
              use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. AI Processing</h2>

            <p className="mt-4">
              Some FundGuard AI features use artificial intelligence to analyze information and
              generate insights. Information required for these features may be processed by our
              technology providers in accordance with applicable agreements and safeguards.
            </p>

            <p className="mt-4">
              AI-generated outputs may not always be accurate and should be reviewed before being
              relied upon.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Payment Information</h2>

            <p className="mt-4">
              Payments and subscriptions may be processed through third-party payment providers such
              as Razorpay. Payment providers may collect and process payment information according
              to their own privacy policies and terms.
            </p>

            <p className="mt-4">
              FundGuard AI does not intentionally store complete payment card numbers or card
              security codes on its own servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">
              7. Cookies and Authentication
            </h2>

            <p className="mt-4">
              FundGuard AI may use cookies or similar technologies to maintain authenticated
              sessions, protect accounts, remember preferences, and support the functionality of the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Data Security</h2>

            <p className="mt-4">
              We use reasonable technical and organizational measures designed to protect
              information from unauthorized access, alteration, disclosure, or destruction.
            </p>

            <p className="mt-4">
              However, no internet-based service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Data Retention</h2>

            <p className="mt-4">
              We retain information for as long as reasonably necessary to provide the service,
              maintain business records, comply with legal obligations, resolve disputes, and
              enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Third-Party Services</h2>

            <p className="mt-4">
              FundGuard AI may rely on third-party services for infrastructure, hosting,
              authentication, payments, analytics, AI processing, and other operational functions.
              These providers may process information as necessary to provide their services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">11. Your Choices</h2>

            <p className="mt-4">
              Depending on applicable law, you may have rights relating to access, correction,
              deletion, portability, or restriction of certain personal information.
            </p>

            <p className="mt-4">You may also contact us regarding privacy-related requests.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">12. Children&apos;s Privacy</h2>

            <p className="mt-4">
              FundGuard AI is not intended for children who are not legally permitted to use
              financial or trading-related services in their jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">13. Changes to This Policy</h2>

            <p className="mt-4">
              We may update this Privacy Policy from time to time. Changes will be published on this
              page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">14. Contact</h2>

            <p className="mt-4">
              If you have questions or requests regarding this Privacy Policy, please contact
              FundGuard AI through the support channel provided on the website.
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
