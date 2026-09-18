"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

type TradingAccount = {
  id: string;
  userId: string;
  broker: string;
  accountLabel: string;
  externalId: string;
  status: string;
  baseCurrency: string;
  balance: number | string;
  connectedAt: string;
  updatedAt: string;
};

export default function TradingAccountDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const accountId = params.id as string;

  const [account, setAccount] = useState<TradingAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [accountLabel, setAccountLabel] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadAccount() {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(`/trading-accounts/${accountId}`);

        if (!response.ok) {
          throw new Error("Failed to load trading account.");
        }

        const data: TradingAccount = await response.json();

        setAccount(data);
        setAccountLabel(data.accountLabel);
        setBaseCurrency(data.baseCurrency);
        setBalance(String(data.balance));
        setStatus(data.status);
      } catch {
        setError("Failed to load the trading account. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (accountId) {
      loadAccount();
    }
  }, [accountId]);

  function startEditing() {
    if (!account) {
      return;
    }

    setAccountLabel(account.accountLabel);
    setBaseCurrency(account.baseCurrency);
    setBalance(String(account.balance));
    setStatus(account.status);

    setIsEditing(true);
  }

  function cancelEditing() {
    if (account) {
      setAccountLabel(account.accountLabel);
      setBaseCurrency(account.baseCurrency);
      setBalance(String(account.balance));
      setStatus(account.status);
    }

    setIsEditing(false);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account) {
      return;
    }

    try {
      setSaving(true);

      const response = await apiFetch(`/trading-accounts/${account.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          accountLabel,
          baseCurrency,
          balance: Number(balance),
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        alert(errorData?.message || "Failed to update the trading account.");

        return;
      }

      const updatedAccount: TradingAccount = await response.json();

      setAccount(updatedAccount);

      setAccountLabel(updatedAccount.accountLabel);
      setBaseCurrency(updatedAccount.baseCurrency);
      setBalance(String(updatedAccount.balance));
      setStatus(updatedAccount.status);

      setIsEditing(false);

      alert("Trading account updated successfully.");
    } catch {
      alert("Failed to update the trading account. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-6xl">
          <p className="text-muted">Loading trading account...</p>
        </div>
      </main>
    );
  }

  if (error || !account) {
    return (
      <main className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mb-6 text-sm font-medium text-primary"
          >
            ← Back to Dashboard
          </button>

          <div className="rounded-xl border border-border bg-surface p-6">
            <h1 className="text-2xl font-bold">Trading Account Not Available</h1>

            <p className="mt-2 text-muted">
              {error || "The requested trading account could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm font-medium text-primary transition hover:opacity-80"
        >
          ← Back to Dashboard
        </button>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{account.accountLabel}</h1>

              <p className="mt-2 text-sm text-muted">Trading Account Details</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-raised"
                >
                  Edit Account
                </button>
              )}

              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                {account.status}
              </span>
            </div>
          </div>

          {!isEditing ? (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-surface-raised p-5">
                  <p className="text-sm text-muted">Current Balance</p>

                  <p className="mt-2 text-2xl font-bold">
                    {account.baseCurrency}{" "}
                    {Number(account.balance).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="rounded-xl bg-surface-raised p-5">
                  <p className="text-sm text-muted">Broker</p>

                  <p className="mt-2 text-xl font-semibold">{account.broker}</p>
                </div>

                <div className="rounded-xl bg-surface-raised p-5">
                  <p className="text-sm text-muted">External Account ID</p>

                  <p className="mt-2 text-xl font-semibold">{account.externalId}</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border p-6">
                <h2 className="text-2xl font-bold">Account Information</h2>

                <div className="mt-6 divide-y divide-border">
                  <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-muted">Account ID</span>

                    <span className="break-all text-sm font-semibold">{account.id}</span>
                  </div>

                  <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-muted">Currency</span>

                    <span className="font-semibold">{account.baseCurrency}</span>
                  </div>

                  <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-muted">Connected At</span>

                    <span className="font-semibold">
                      {new Date(account.connectedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-muted">Last Updated</span>

                    <span className="font-semibold">
                      {new Date(account.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="mt-6 rounded-xl border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Edit Trading Account</h2>

                  <p className="mt-1 text-sm text-muted">
                    Update your trading account information.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="accountLabel" className="mb-2 block text-sm font-medium">
                    Account Label
                  </label>

                  <input
                    id="accountLabel"
                    type="text"
                    value={accountLabel}
                    onChange={(event) => setAccountLabel(event.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="baseCurrency" className="mb-2 block text-sm font-medium">
                    Base Currency
                  </label>

                  <input
                    id="baseCurrency"
                    type="text"
                    value={baseCurrency}
                    onChange={(event) => setBaseCurrency(event.target.value.toUpperCase())}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="balance" className="mb-2 block text-sm font-medium">
                    Current Balance
                  </label>

                  <input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(event) => setBalance(event.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="mb-2 block text-sm font-medium">
                    Account Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
                  >
                    <option value="ACTIVE">ACTIVE</option>

                    <option value="INACTIVE">INACTIVE</option>

                    <option value="DISCONNECTED">DISCONNECTED</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-5 py-3 font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-lg border border-border px-5 py-3 font-semibold transition hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-2xl font-bold">Trading Performance</h2>

          <p className="mt-2 text-sm text-muted">
            Trading performance analytics will appear here as trade synchronization is added.
          </p>

          <div className="mt-6 flex h-48 items-center justify-center rounded-xl bg-surface-raised">
            <span className="text-sm text-muted">Performance analytics coming soon</span>
          </div>
        </section>
      </div>
    </main>
  );
}
