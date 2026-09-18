"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AnalyticsCharts } from "@/src/components/AnalyticsCharts";
import { NotificationBell } from "@/src/components/NotificationBell";
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
  userId?: string;
  broker: string;
  accountLabel: string;
  externalId: string;
  status: string;
  baseCurrency: string;
  balance: string | number;
  connectedAt?: string;
  updatedAt?: string;
};

type ConnectAccountForm = {
  broker: string;
  accountLabel: string;
  externalId: string;
  baseCurrency: string;
};

type EditAccountForm = {
  accountLabel: string;
  baseCurrency: string;
  balance: string;
  status: string;
};

type RiskDashboard = {
  riskStatus?: string;
  riskScore?: number | string;
  riskLevel?: string;
  riskScoreReasons?: string[];

  tradesToday?: number | string;
  buyTrades?: number | string;
  sellTrades?: number | string;

  dailyTradedValue?: number | string;
  dailyFees?: number | string;
  dailyBuyValue?: number | string;
  dailySellValue?: number | string;
  netTradeValue?: number | string;

  activeRules?: number | string;

  totalAccountBalance?: number | string;
  peakAccountBalance?: number | string;
  drawdownAmount?: number | string;
  drawdownPercentage?: number | string;
  drawdownAvailable?: boolean;
  drawdownMessage?: string;

  maximumDailyTrades?: number | string | null;
  remainingTrades?: number | string | null;
  tradeLimitUtilization?: number | string | null;
  tradeLimitExceeded?: boolean;

  maximumPositionSize?: number | string | null;
  currentPositionExposure?: number | string;
  positionUtilization?: number | string;
  remainingPositionCapacity?: number | string;
  positionLimitExceeded?: boolean;

  pnlAvailable?: boolean;
  dailyPnl?: number | string;
  pnlMessage?: string;

  hasViolations?: boolean;
  hasCriticalViolations?: boolean;
  violationCount?: number | string;
  criticalViolationCount?: number | string;
  warningViolationCount?: number | string;

  ruleViolations?: unknown;
};

function money(value: unknown, currency = "USD") {
  const amount = Number(value ?? 0);

  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function percent(value: unknown) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function getViolations(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    return Object.values(value);
  }

  return [];
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);

  const [loading, setLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);

  const [showConnectForm, setShowConnectForm] = useState(false);

  const [connectingAccount, setConnectingAccount] = useState(false);

  const [editingAccount, setEditingAccount] = useState<TradingAccount | null>(null);

  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [riskDashboard, setRiskDashboard] = useState<RiskDashboard | null>(null);

  const [riskLoading, setRiskLoading] = useState(true);

  const [riskError, setRiskError] = useState("");

  const [connectForm, setConnectForm] = useState<ConnectAccountForm>({
    broker: "OTHER",
    accountLabel: "",
    externalId: "",
    baseCurrency: "USD",
  });

  const [editForm, setEditForm] = useState<EditAccountForm>({
    accountLabel: "",
    baseCurrency: "USD",
    balance: "0",
    status: "ACTIVE",
  });

  /*
   * Logout
   */
  async function handleLogout() {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Always redirect to login even if the API request fails.
    } finally {
      router.replace("/login");
    }
  }

  /*
   * Load dashboard
   */
  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const userResponse = await apiFetch("/auth/me");

        if (!userResponse.ok) {
          router.replace("/login");
          return;
        }

        const userData = await userResponse.json();

        setUser(userData.user ?? userData);

        const accountsResponse = await apiFetch("/trading-accounts");

        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();

          setAccounts(Array.isArray(accountsData) ? accountsData : []);
        } else if (accountsResponse.status === 401) {
          router.replace("/login");
          return;
        }

        const riskResponse = await apiFetch("/risk-rules/dashboard");

        if (riskResponse.ok) {
          const riskData = await riskResponse.json();

          setRiskDashboard(riskData);
          setRiskError("");
        } else if (riskResponse.status === 401) {
          router.replace("/login");
          return;
        } else {
          setRiskError("Failed to load risk dashboard.");
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
        setAccountsLoading(false);
        setRiskLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  /*
   * Edit account
   */
  function openEditModal(account: TradingAccount) {
    setEditingAccount(account);

    setEditForm({
      accountLabel: account.accountLabel,
      baseCurrency: account.baseCurrency,
      balance: String(account.balance ?? 0),
      status: account.status,
    });
  }

  function closeEditModal() {
    setEditingAccount(null);

    setEditForm({
      accountLabel: "",
      baseCurrency: "USD",
      balance: "0",
      status: "ACTIVE",
    });
  }

  /*
   * Connect account
   */
  async function handleConnectAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!connectForm.accountLabel.trim() || !connectForm.externalId.trim()) {
      alert("Please enter an Account Label and External Account ID.");

      return;
    }

    try {
      setConnectingAccount(true);

      const response = await apiFetch("/trading-accounts", {
        method: "POST",
        body: JSON.stringify({
          broker: connectForm.broker,
          accountLabel: connectForm.accountLabel.trim(),
          externalId: connectForm.externalId.trim(),
          baseCurrency: connectForm.baseCurrency.trim() || "USD",
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        alert(responseData?.message || "Failed to connect the trading account.");

        return;
      }

      setAccounts((currentAccounts) => [responseData, ...currentAccounts]);

      setConnectForm({
        broker: "OTHER",
        accountLabel: "",
        externalId: "",
        baseCurrency: "USD",
      });

      setShowConnectForm(false);

      alert("Trading account connected successfully.");
    } catch {
      alert("Failed to connect the trading account. Please try again.");
    } finally {
      setConnectingAccount(false);
    }
  }

  /*
   * Update account
   */
  async function handleEditAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingAccount) {
      return;
    }

    if (!editForm.accountLabel.trim()) {
      alert("Please enter an Account Label.");

      return;
    }

    const parsedBalance = Number(editForm.balance);

    if (Number.isNaN(parsedBalance) || parsedBalance < 0) {
      alert("Please enter a valid balance greater than or equal to 0.");

      return;
    }

    try {
      setSavingEdit(true);

      const response = await apiFetch(`/trading-accounts/${editingAccount.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          accountLabel: editForm.accountLabel.trim(),
          baseCurrency: editForm.baseCurrency.trim() || "USD",
          balance: parsedBalance,
          status: editForm.status,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        alert(responseData?.message || "Failed to update the trading account.");

        return;
      }

      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.id === editingAccount.id ? responseData : account,
        ),
      );

      closeEditModal();

      alert("Trading account updated successfully.");
    } catch {
      alert("Failed to update the trading account. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  }

  /*
   * Delete account
   */
  async function handleDeleteAccount(account: TradingAccount) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.accountLabel}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(account.id);

      const response = await apiFetch(`/trading-accounts/${account.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        alert(errorData?.message || "Failed to delete the trading account. Please try again.");

        return;
      }

      setAccounts((currentAccounts) =>
        currentAccounts.filter((currentAccount) => currentAccount.id !== account.id),
      );

      alert("Trading account deleted successfully.");
    } catch {
      alert("Failed to delete the trading account. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  /*
   * Loading
   */
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

  const riskScore = Number(riskDashboard?.riskScore ?? 0);

  const riskScoreWidth = Math.min(100, Math.max(0, riskScore));

  const violations = getViolations(riskDashboard?.ruleViolations);

  const violationCount = Number(riskDashboard?.violationCount ?? 0);

  return (
    <DashboardShell>
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* =====================================================
              HEADER
          ====================================================== */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Trading Overview
              </h1>

              <p className="mt-1 text-sm text-muted">Welcome back, {displayName}.</p>
            </div>

            {/* Notifications + Profile + Logout */}
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <NotificationBell />

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-raised sm:flex-none"
              >
                <span>ðŸ‘¤</span>
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 sm:flex-none"
              >
                <span>â†ª</span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* =====================================================
              SUMMARY CARDS
          ====================================================== */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Balance */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Account Balance</p>

              <p className="mt-2 text-2xl font-semibold text-foreground">
                $
                {totalBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="mt-2 text-xs text-primary">
                {accounts.length} connected {accounts.length === 1 ? "account" : "accounts"}
              </p>
            </div>

            {/* P&L */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Today&apos;s P&amp;L</p>

              <p className="mt-2 text-2xl font-semibold text-foreground">
                {riskDashboard?.pnlAvailable ? money(riskDashboard.dailyPnl) : "Unavailable"}
              </p>

              <p className="mt-2 text-xs text-muted">
                {riskDashboard?.pnlAvailable ? "Realized P&L" : "Exit/P&L data not stored yet"}
              </p>
            </div>

            {/* Risk */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Risk Score</p>

              <p className="mt-2 text-2xl font-semibold text-foreground">
                {riskLoading ? "..." : `${riskScore}/100`}
              </p>

              <p className="mt-2 text-xs text-primary">{riskDashboard?.riskLevel ?? "Loading"}</p>
            </div>

            {/* Trades */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">Today&apos;s Trades</p>

              <p className="mt-2 text-2xl font-semibold text-foreground">
                {riskLoading ? "..." : (riskDashboard?.tradesToday ?? 0)}
              </p>

              <p className="mt-2 text-xs text-muted">Trades recorded today</p>
            </div>
          </section>

          {/* =====================================================
              AI INSIGHTS
          ====================================================== */}
          <section className="mt-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
                    ðŸ¤–
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-foreground">AI Trading Insights</h2>

                    <p className="mt-1 text-sm text-muted">
                      Analyze your trading behaviour, risk and activity with FundGuard AI.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/dashboard/ai-insights")}
                className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
              >
                View AI Insights
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-surface-raised p-4">
                <p className="text-sm font-medium text-foreground">Trading Behaviour</p>

                <p className="mt-1 text-xs text-muted">
                  Understand your recorded trading activity.
                </p>
              </div>

              <div className="rounded-lg bg-surface-raised p-4">
                <p className="text-sm font-medium text-foreground">Risk Assessment</p>

                <p className="mt-1 text-xs text-muted">
                  Identify potential behavioural risk signals.
                </p>
              </div>

              <div className="rounded-lg bg-surface-raised p-4">
                <p className="text-sm font-medium text-foreground">Recommendations</p>

                <p className="mt-1 text-xs text-muted">Get actionable trading recommendations.</p>
              </div>
            </div>
          </section>

          {/* =====================================================
              RISK DASHBOARD
          ====================================================== */}
          <section className="mt-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">FundGuard Risk Dashboard</h2>

                <p className="mt-1 text-sm text-muted">
                  Real-time risk protection from your risk engine.
                </p>
              </div>

              {!riskLoading && riskDashboard && (
                <div
                  className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                    riskDashboard.hasCriticalViolations
                      ? "bg-red-500/10 text-red-400"
                      : riskDashboard.hasViolations
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {riskDashboard.riskStatus ?? "PROTECTED"}
                </div>
              )}
            </div>

            {riskLoading ? (
              <div className="mt-6 rounded-xl bg-surface-raised p-8 text-center">
                <p className="text-sm text-muted">Loading risk engine...</p>
              </div>
            ) : riskError ? (
              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                <p className="font-medium text-red-400">Risk Dashboard Error</p>

                <p className="mt-1 text-sm text-muted">{riskError}</p>
              </div>
            ) : riskDashboard ? (
              <div className="mt-6 space-y-5">
                {/* Risk Score */}
                <div className="rounded-xl border border-border bg-surface-raised p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted">Overall Risk Score</p>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">{riskScore}</span>

                        <span className="text-sm text-muted">/ 100</span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-muted">Risk Level</p>

                      <p className="mt-1 text-xl font-semibold text-primary">
                        {riskDashboard.riskLevel ?? "LOW"}
                      </p>
                    </div>
                  </div>

                  {/* Meter */}
                  <div className="mt-5">
                    <div className="h-3 overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${riskScoreWidth}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-[11px] text-muted">
                      <span>Critical</span>
                      <span>High</span>
                      <span>Medium</span>
                      <span>Low</span>
                    </div>
                  </div>
                </div>

                {/* Risk Metrics */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Position */}
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted">Position Exposure</p>

                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {money(riskDashboard.currentPositionExposure)}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Limit: {money(riskDashboard.maximumPositionSize)}
                    </p>
                  </div>

                  {/* Utilization */}
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted">Position Utilization</p>

                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {percent(riskDashboard.positionUtilization)}
                    </p>

                    <div className="mt-2 h-1.5 rounded-full bg-surface-raised">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(riskDashboard.positionUtilization ?? 0)),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Trades */}
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted">Today&apos;s Trades</p>

                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {riskDashboard.tradesToday ?? 0}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Daily value: {money(riskDashboard.dailyTradedValue)}
                    </p>
                  </div>

                  {/* Rules */}
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted">Active Risk Rules</p>

                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {riskDashboard.activeRules ?? 0}
                    </p>

                    <p className="mt-1 text-xs text-primary">Protection enabled</p>
                  </div>
                </div>

                {/* Risk Alerts */}
                <div className="rounded-xl border border-border p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Risk Alerts</h3>

                      <p className="mt-1 text-xs text-muted">
                        Current rule violations and warnings.
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        violationCount > 0
                          ? "bg-red-500/10 text-red-400"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {violationCount > 0
                        ? `${violationCount} violation${violationCount === 1 ? "" : "s"}`
                        : "No violations"}
                    </span>
                  </div>

                  {violations.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {violations.map((violation: Record<string, unknown>, index: number) => (
                        <div
                          key={index}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-4"
                        >
                          <p className="text-sm font-medium text-red-400">
                            {String(
                              violation?.name ?? violation?.ruleName ?? "Risk rule violation",
                            )}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {String(
                              violation?.message ??
                                violation?.reason ??
                                "A configured risk limit has been exceeded.",
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg bg-surface-raised p-4">
                      <p className="text-sm text-primary">
                        ✓ Your current trading activity is within configured risk limits.
                      </p>
                    </div>
                  )}
                </div>

                {/* Drawdown + P&L */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-border p-5">
                    <p className="text-sm font-medium text-foreground">Drawdown</p>

                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {Number(riskDashboard.drawdownPercentage ?? 0).toFixed(2)}%
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted">
                      {riskDashboard.drawdownAvailable
                        ? `${money(riskDashboard.drawdownAmount)} drawdown`
                        : (riskDashboard.drawdownMessage ??
                          "Historical maximum drawdown is unavailable because equity history is not stored yet.")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-5">
                    <p className="text-sm font-medium text-foreground">Realized P&amp;L</p>

                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {riskDashboard.pnlAvailable ? money(riskDashboard.dailyPnl) : "Unavailable"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted">
                      {riskDashboard.pnlAvailable
                        ? "Realized P&L data available."
                        : (riskDashboard.pnlMessage ??
                          "Realized P&L is unavailable until trade exit/P&L data is stored.")}
                    </p>
                  </div>
                </div>

                {/* Assessment */}
                {Array.isArray(riskDashboard.riskScoreReasons) &&
                  riskDashboard.riskScoreReasons.length > 0 && (
                    <div className="rounded-xl border border-border p-5">
                      <h3 className="font-semibold text-foreground">Risk Assessment</h3>

                      <div className="mt-4 space-y-2">
                        {riskDashboard.riskScoreReasons.map((reason, index) => (
                          <div
                            key={index}
                            className="rounded-lg bg-surface-raised px-4 py-3 text-sm text-muted"
                          >
                            <span className="mr-2 text-primary">âœ“</span>

                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-surface-raised p-6 text-center">
                <p className="text-sm text-muted">No risk dashboard data available.</p>
              </div>
            )}
          </section>

          {/* =====================================================
              TRADING ACCOUNTS
          ====================================================== */}
          <section className="mt-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Trading Accounts</h2>

                <p className="mt-1 text-sm text-muted">Your connected trading accounts.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowConnectForm((current) => !current)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                {showConnectForm ? "Cancel" : "Connect Trading Account"}
              </button>
            </div>

            {/* Connect Form */}
            {showConnectForm && (
              <form
                onSubmit={handleConnectAccount}
                className="mb-6 rounded-xl border border-border bg-surface-raised p-5"
              >
                <h3 className="mb-4 text-base font-semibold text-foreground">
                  Connect Trading Account
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Broker */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Broker</label>

                    <select
                      value={connectForm.broker}
                      onChange={(event) =>
                        setConnectForm((current) => ({
                          ...current,
                          broker: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                    >
                      <option value="OTHER">OTHER</option>

                      <option value="ALPACA">ALPACA</option>
                    </select>
                  </div>

                  {/* Account Label */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Account Label
                    </label>

                    <input
                      type="text"
                      value={connectForm.accountLabel}
                      onChange={(event) =>
                        setConnectForm((current) => ({
                          ...current,
                          accountLabel: event.target.value,
                        }))
                      }
                      placeholder="My Funded Account"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                    />
                  </div>

                  {/* External ID */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      External Account ID
                    </label>

                    <input
                      type="text"
                      value={connectForm.externalId}
                      onChange={(event) =>
                        setConnectForm((current) => ({
                          ...current,
                          externalId: event.target.value,
                        }))
                      }
                      placeholder="account-001"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Base Currency
                    </label>

                    <input
                      type="text"
                      value={connectForm.baseCurrency}
                      onChange={(event) =>
                        setConnectForm((current) => ({
                          ...current,
                          baseCurrency: event.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="USD"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={connectingAccount}
                  className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {connectingAccount ? "Connecting..." : "Connect Account"}
                </button>
              </form>
            )}

            {/* Accounts */}
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
                    className="rounded-lg border border-border p-4 transition hover:bg-surface-raised"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{account.accountLabel}</p>

                        <p className="mt-1 text-sm text-muted">
                          {account.broker} Â· {account.externalId}
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

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(account)}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-raised"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAccount(account)}
                        disabled={deletingId === account.id}
                        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === account.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =====================================================
              ANALYTICS CHARTS
          ====================================================== */}
          <AnalyticsCharts />

          {/* =====================================================
              PERFORMANCE + DAILY TRADING
          ====================================================== */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Performance */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">Performance</h2>

              <p className="mt-1 text-sm text-muted">Your trading performance will appear here.</p>

              <div className="mt-6 flex h-48 items-center justify-center rounded-lg bg-surface-raised">
                <span className="text-sm text-muted">Performance chart</span>
              </div>
            </div>

            {/* Daily Trading */}
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">Daily Trading</h2>

              <p className="mt-1 text-sm text-muted">Today&apos;s trading activity.</p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-surface-raised p-4">
                  <span className="text-sm text-muted">Buy Trades</span>

                  <span className="font-semibold text-foreground">
                    {riskDashboard?.buyTrades ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-surface-raised p-4">
                  <span className="text-sm text-muted">Sell Trades</span>

                  <span className="font-semibold text-foreground">
                    {riskDashboard?.sellTrades ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-surface-raised p-4">
                  <span className="text-sm text-muted">Fees</span>

                  <span className="font-semibold text-foreground">
                    {money(riskDashboard?.dailyFees)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              RECENT ACTIVITY
          ====================================================== */}
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

      {/* =========================================================
          EDIT ACCOUNT MODAL
      ========================================================== */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleEditAccount}
            className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Edit Trading Account</h2>

                <p className="mt-1 text-sm text-muted">Update your account details.</p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="text-sm text-muted transition hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {/* Account Label */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Account Label
                </label>

                <input
                  type="text"
                  value={editForm.accountLabel}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      accountLabel: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Base Currency
                </label>

                <input
                  type="text"
                  value={editForm.baseCurrency}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      baseCurrency: event.target.value.toUpperCase(),
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                />
              </div>

              {/* Balance */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Balance</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.balance}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      balance: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Status</label>

                <select
                  value={editForm.status}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>

                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={savingEdit}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-raised"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingEdit}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}
