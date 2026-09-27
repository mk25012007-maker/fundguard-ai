import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantivo AI Pricing - Trading Risk Management Plans",
  description:
    "Explore Quantivo AI pricing plans for funded traders, including risk monitoring, trade tracking, analytics, AI insights, alerts, and trading discipline tools.",
};

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
