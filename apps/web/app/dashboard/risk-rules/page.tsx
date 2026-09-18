"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type RiskRule = {
  id: string;
  name: string;
  type: string;
  action: string;
  thresholdValue: number | string;
  isActive: boolean;
  tradingAccountId?: string | null;
  createdAt?: string;
};

type RuleSummary = {
  totalRules: number;
  activeRules: number;
  warningRules: number;
  blockingRules: number;
  notifyOnlyRules: number;
};

const ruleTypes = ["MAX_DAILY_TRADES", "MAX_POSITION_SIZE"];

const ruleActions = ["WARN", "BLOCK", "NOTIFY_ONLY"];

export default function RiskRulesPage() {
  const [rules, setRules] = useState<RiskRule[]>([]);
  const [summary, setSummary] = useState<RuleSummary>({
    totalRules: 0,
    activeRules: 0,
    warningRules: 0,
    blockingRules: 0,
    notifyOnlyRules: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "MAX_DAILY_TRADES",
    action: "WARN",
    thresholdValue: "",
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [rulesResponse, summaryResponse] = await Promise.all([
        fetch(`${API_URL}/risk-rules`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/risk-rules/summary`, {
          credentials: "include",
        }),
      ]);

      if (!rulesResponse.ok) {
        throw new Error(`Risk rules request failed: ${rulesResponse.status}`);
      }

      if (!summaryResponse.ok) {
        throw new Error(`Risk summary request failed: ${summaryResponse.status}`);
      }

      const rulesData = await rulesResponse.json();
      const summaryData = await summaryResponse.json();

      setRules(Array.isArray(rulesData) ? rulesData : []);
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load risk rules. Please check that the API is running and you are logged in.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createRule() {
    if (!form.name.trim()) {
      alert("Please enter a rule name.");
      return;
    }

    if (!form.thresholdValue) {
      alert("Please enter a threshold value.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/risk-rules`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          type: form.type,
          action: form.action,
          thresholdValue: Number(form.thresholdValue),
          isActive: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message
            ? Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message
            : `Request failed with ${response.status}`,
        );
      }

      setShowAdd(false);

      setForm({
        name: "",
        type: "MAX_DAILY_TRADES",
        action: "WARN",
        thresholdValue: "",
      });

      await loadData();
    } catch (err) {
      console.error(err);

      alert(err instanceof Error ? err.message : "Failed to create risk rule.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRule(rule: RiskRule) {
    try {
      const response = await fetch(`${API_URL}/risk-rules/${rule.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !rule.isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.message
            ? Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message
            : `Request failed with ${response.status}`,
        );
      }

      await loadData();
    } catch (err) {
      console.error(err);

      alert(err instanceof Error ? err.message : "Failed to update risk rule.");
    }
  }

  async function deleteRule(rule: RiskRule) {
    const confirmed = window.confirm(`Delete "${rule.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/risk-rules/${rule.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.message
            ? Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message
            : `Request failed with ${response.status}`,
        );
      }

      await loadData();
    } catch (err) {
      console.error(err);

      alert(err instanceof Error ? err.message : "Failed to delete risk rule.");
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-400">FundGuard AI</p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Risk Rules</h1>

            <p className="mt-2 text-sm text-slate-400">
              Configure automatic trading risk protection rules.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            + Add Risk Rule
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard title="Total Rules" value={summary.totalRules} />

          <SummaryCard title="Active Rules" value={summary.activeRules} />

          <SummaryCard title="Warning" value={summary.warningRules} />

          <SummaryCard title="Blocking" value={summary.blockingRules} />

          <SummaryCard title="Notify Only" value={summary.notifyOnlyRules} />
        </div>

        {/* Rules */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-xl">
          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold">Your Risk Protection Rules</h2>

            <p className="mt-1 text-sm text-slate-400">
              These rules are evaluated by the FundGuard AI risk engine.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">Loading risk rules...</div>
          ) : rules.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mb-3 text-4xl">🛡️</div>

              <h3 className="text-lg font-semibold">No risk rules configured</h3>

              <p className="mt-2 text-sm text-slate-400">
                Add your first risk rule to protect your trading account.
              </p>

              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="mt-5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400"
              >
                Add First Rule
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-white/[0.02] sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{rule.name}</h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          rule.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {rule.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-3">
                      <div>
                        <span className="text-slate-500">Type:</span>{" "}
                        <span className="text-slate-200">{rule.type}</span>
                      </div>

                      <div>
                        <span className="text-slate-500">Action:</span>{" "}
                        <span className="text-slate-200">{rule.action}</span>
                      </div>

                      <div>
                        <span className="text-slate-500">Threshold:</span>{" "}
                        <span className="font-semibold text-white">
                          {String(rule.thresholdValue)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRule(rule)}
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      {rule.isActive ? "Disable" : "Enable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteRule(rule)}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Add Rule Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Add Risk Rule</h2>

                <p className="mt-1 text-sm text-slate-400">Create a new trading protection rule.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-lg px-3 py-2 text-2xl text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Rule Name</label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Maximum Daily Trades"
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Rule Type</label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-white outline-none focus:border-emerald-500"
                >
                  {ruleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Action</label>

                <select
                  value={form.action}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      action: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-white outline-none focus:border-emerald-500"
                >
                  {ruleActions.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Threshold Value
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.thresholdValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      thresholdValue: e.target.value,
                    })
                  }
                  placeholder="5"
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={createRule}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1220] p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
