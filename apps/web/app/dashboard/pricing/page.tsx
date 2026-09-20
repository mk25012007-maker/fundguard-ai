"use client";

import Link from "next/link";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function loadRazorpay(): Promise<boolean> {
    if (window.Razorpay) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleUpgrade() {
    try {
      setLoading(true);

      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Razorpay Checkout could not be loaded");
      }

      const response = await fetch("http://localhost:3001/payments/subscription", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create subscription");
      }

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!key) {
        throw new Error("Razorpay Key ID is missing");
      }

      const options = {
        key,
        subscription_id: data.id,
        name: "FundGuard AI",
        description: "FundGuard AI PRO Subscription",
        handler: async function (paymentResponse: any) {
          try {
            const verifyResponse = await fetch("http://localhost:3001/payments/verify", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(paymentResponse),
            });

            const data = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(data.message || "Payment verification failed");
            }

            alert("Payment successful and verified!");

            window.location.href = "/dashboard";
          } catch (error) {
            console.error("Payment verification error:", error);

            alert(error instanceof Error ? error.message : "Payment verification failed.");
          }
        },
        theme: {
          color: "#00C853",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Razorpay payment failed:", response.error);

        alert("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Unable to start PRO subscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            FundGuard AI
          </p>

          <h1 className="mt-2 text-4xl font-bold">Choose your trading protection plan</h1>

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
              ₹0
              <span className="text-base font-normal text-slate-400">/month</span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li>✓ 1 trading account</li>
              <li>✓ Limited trade tracking</li>
              <li>✓ Basic risk monitoring</li>
              <li>✓ Limited AI insights</li>
              <li>✓ Basic analytics</li>
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
              ₹299
              <span className="text-base font-normal text-slate-400">/month</span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li>✓ Multiple trading accounts</li>
              <li>✓ Unlimited trade tracking</li>
              <li>✓ Full risk monitoring</li>
              <li>✓ Risk alerts</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Full AI insights</li>
              <li>✓ Notifications</li>
              <li>✓ Priority support</li>
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Starting..." : "Upgrade to PRO"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
