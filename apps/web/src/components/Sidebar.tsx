"use client";

import Link from "next/link";

const navigation = [
  { label: "Overview", href: "/dashboard" },
  { label: "Trades", href: "/dashboard/trades" },
  { label: "Accounts", href: "/dashboard/account" },
  { label: "Risk", href: "/dashboard/risk" },
  { label: "AI Insights", href: "/dashboard/ai" },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="border-b border-border px-6 py-5">
        <Link href="/dashboard">
          <div className="text-lg font-semibold text-foreground">FundGuard AI</div>

          <div className="mt-1 text-xs text-muted">Trading Risk Management</div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-muted">FundGuard AI</p>
      </div>
    </aside>
  );
}
