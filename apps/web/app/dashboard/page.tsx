"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/src/components/DashboardShell";
import { apiFetch } from "@/src/lib/api";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
};

type TradingAccount = {
  id: string;
  broker: string;
  accountLabel: string;
  externalId: string;
  status: string;
  baseCurrency: string;
  balance: string | number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userResponse = await apiFetch("/auth/me");

        if (!userResponse.ok) {
          router.push("/login");
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user ?? userData);

        const accountsResponse = await apiFetch("/trading-accounts");

        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          setAccounts(Array.isArray(accountsData) ? accountsData : []);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
        setAccountsLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading dashboard...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  const totalBalance = accounts.reduce((total, account) => total + Number(account.balance || 0), 0);

  return (
    <DashboardShell>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Trading Overview</h1>

            <p className="mt-1 text-sm text-muted">Welcome back, {displayName}.</p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Account Balance</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                $
                {totalBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-xs text-primary">{accounts.length} connected accounts</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Today&apos;s P&amp;L</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">$0.00</p>
              <p className="mt-2 text-xs text-muted">No live P&amp;L data yet</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Risk Used</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">0.0%</p>
              <p className="mt-2 text-xs text-primary">Low</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Active Trades</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">0</p>
              <p className="mt-2 text-xs text-muted">No active trades yet</p>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-foreground">Trading Accounts</h2>

              <p className="mt-1 text-sm text-muted">Your connected trading accounts.</p>
            </div>

            {accountsLoading ? (
              <div className="rounded-lg bg-surface-raised p-6 text-center">
                <p className="text-sm text-muted">Loading trading accounts...</p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="rounded-lg bg-surface-raised p-6 text-center">
                <p className="text-sm text-muted">No trading accounts connected.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{account.accountLabel}</p>

                      <p className="mt-1 text-sm text-muted">
                        {account.broker} · {account.externalId}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-foreground">
                        {account.baseCurrency}{" "}
                        {Number(account.balance).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <p className="mt-1 text-xs text-primary">{account.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">Performance</h2>

              <p className="mt-1 text-sm text-muted">Your trading performance will appear here.</p>

              <div className="mt-6 flex h-48 items-center justify-center rounded-lg bg-surface-raised">
                <span className="text-sm text-muted">Performance chart</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">Risk Monitor</h2>

              <p className="mt-1 text-sm text-muted">Monitor your current trading risk.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted">Daily Risk</span>
                    <span className="text-foreground">0.0%</span>
                  </div>

                  <div className="h-2 rounded-full bg-surface-raised">
                    <div className="h-2 w-0 rounded-full bg-primary" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted">Drawdown</span>
                    <span className="text-foreground">0.0%</span>
                  </div>

                  <div className="h-2 rounded-full bg-surface-raised">
                    <div className="h-2 w-0 rounded-full bg-warning" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>

            <p className="mt-1 text-sm text-muted">
              Your latest trading activity will appear here.
            </p>

            <div className="mt-6 rounded-lg bg-surface-raised p-6 text-center">
              <p className="text-sm text-muted">No recent trades</p>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
