"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    label: "Trades",
    href: "/dashboard/trades",
    icon: "📈",
  },
  {
    label: "Risk Rules",
    href: "/dashboard/risk-rules",
    icon: "🛡️",
  },
  {
    label: "AI Insights",
    href: "/dashboard/ai-insights",
    icon: "🤖",
  },
  {
    label: "Accounts",
    href: "/dashboard/accounts",
    icon: "💳",
  },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 md:flex">
          {/* Logo */}
          <div className="flex h-20 items-center border-b border-slate-800 px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-xl font-bold text-slate-950">
                F
              </div>

              <div>
                <div className="text-lg font-bold">FundGuard AI</div>

                <div className="text-xs text-slate-400">Trading Protection</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-800 p-4">
            <div className="rounded-xl bg-slate-800 p-4">
              <div className="text-sm font-semibold">FundGuard AI</div>

              <div className="mt-1 text-xs text-slate-400">
                Helping funded traders pass challenges with AI
              </div>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile Header */}
          <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 md:hidden">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-950">
                F
              </div>

              <span className="font-bold">FundGuard AI</span>
            </Link>

            <Link
              href="/dashboard/ai-insights"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                pathname.startsWith("/dashboard/ai-insights")
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              🤖 AI
            </Link>
          </header>

          {/* Mobile Navigation */}
          <div className="overflow-x-auto border-b border-slate-800 bg-slate-900 md:hidden">
            <nav className="flex min-w-max gap-2 p-3">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Page Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
