"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  createTrade,
  deleteTrade,
  getTradingAccounts,
  getTrades,
  updateTrade,
} from "@/src/lib/api";

type TradingAccount = {
  id: string;
  name?: string;
  accountName?: string;
  broker?: string;
  balance?: number | string;
};

type TradeStatus = "PENDING" | "FILLED" | "PARTIALLY_FILLED" | "CANCELLED" | "REJECTED";

type Trade = {
  id: string;
  tradingAccountId: string;
  symbol: string;
  assetClass: string;
  side: "BUY" | "SELL";
  status: TradeStatus;
  quantity: number | string;
  price: number | string;
  totalValue: number | string;
  fees: number | string;
  externalOrderId?: string | null;
  executedAt?: string | null;
  createdAt?: string;
};

type TradeForm = {
  tradingAccountId: string;
  symbol: string;
  assetClass: string;
  side: "BUY" | "SELL";
  status: TradeStatus;
  quantity: string;
  price: string;
  fees: string;
  externalOrderId: string;
  executedAt: string;
};

const emptyForm: TradeForm = {
  tradingAccountId: "",
  symbol: "",
  assetClass: "EQUITY",
  side: "BUY",
  status: "FILLED",
  quantity: "",
  price: "",
  fees: "0",
  externalOrderId: "",
  executedAt: "",
};

function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getAccountName(account?: TradingAccount) {
  if (!account) {
    return "Unknown account";
  }

  return account.name || account.accountName || account.broker || "Trading Account";
}

function getStatusClass(status: TradeStatus) {
  switch (status) {
    case "FILLED":
      return "border-green-500/20 bg-green-500/10 text-green-400";

    case "PARTIALLY_FILLED":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

    case "CANCELLED":
      return "border-slate-500/20 bg-slate-500/10 text-slate-400";

    case "REJECTED":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
  }
}

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const [form, setForm] = useState<TradeForm>(emptyForm);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [tradeData, accountData] = await Promise.all([getTrades(), getTradingAccounts()]);

      setTrades(Array.isArray(tradeData) ? tradeData : []);
      setAccounts(Array.isArray(accountData) ? accountData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trades.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredTrades = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return trades;
    }

    return trades.filter((trade) => {
      return (
        trade.symbol?.toLowerCase().includes(query) ||
        trade.side?.toLowerCase().includes(query) ||
        trade.status?.toLowerCase().includes(query) ||
        trade.assetClass?.toLowerCase().includes(query)
      );
    });
  }, [trades, search]);

  const totalTrades = trades.length;

  const buyCount = trades.filter((trade) => trade.side === "BUY").length;

  const sellCount = trades.filter((trade) => trade.side === "SELL").length;

  const totalValue = trades.reduce((sum, trade) => sum + Number(trade.totalValue ?? 0), 0);

  function openCreateModal() {
    setError("");
    setSuccess("");

    setForm({
      ...emptyForm,
      tradingAccountId: accounts[0]?.id ?? "",
    });

    setEditingTrade(null);
    setShowCreateModal(true);
  }

  function openEditModal(trade: Trade) {
    setError("");
    setSuccess("");

    setForm({
      tradingAccountId: trade.tradingAccountId,
      symbol: trade.symbol ?? "",
      assetClass: trade.assetClass ?? "EQUITY",
      side: trade.side ?? "BUY",
      status: trade.status ?? "FILLED",
      quantity: String(trade.quantity ?? ""),
      price: String(trade.price ?? ""),
      fees: String(trade.fees ?? "0"),
      externalOrderId: trade.externalOrderId ?? "",
      executedAt: trade.executedAt ? new Date(trade.executedAt).toISOString().slice(0, 16) : "",
    });

    setEditingTrade(trade);
    setShowCreateModal(false);
  }

  function closeModals() {
    if (saving) {
      return;
    }

    setShowCreateModal(false);
    setEditingTrade(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.tradingAccountId) {
      setError("Please select a trading account.");
      return;
    }

    if (!form.symbol.trim()) {
      setError("Please enter a symbol.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Price must be 0 or greater.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        symbol: form.symbol.trim().toUpperCase(),
        assetClass: form.assetClass,
        side: form.side,
        status: form.status,
        quantity: Number(form.quantity),
        price: Number(form.price),
        fees: Number(form.fees || 0),
        externalOrderId: form.externalOrderId.trim() || undefined,
        executedAt: form.executedAt ? new Date(form.executedAt).toISOString() : undefined,
      };

      if (editingTrade) {
        await updateTrade(editingTrade.id, payload);

        setSuccess("Trade updated successfully.");
      } else {
        await createTrade({
          tradingAccountId: form.tradingAccountId,
          ...payload,
        });

        setSuccess("Trade created successfully.");
      }

      closeModals();

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trade.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(trade: Trade) {
    const confirmed = window.confirm(`Delete ${trade.symbol} trade? This action cannot be undone.`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteTrade(trade.id);

      setSuccess("Trade deleted successfully.");

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete trade.");
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-xl">
                🛡️
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Trades</h1>

                <p className="text-sm text-slate-400">Manage and track your trading activity.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-green-500/10 transition hover:bg-green-400"
          >
            + Add Trade
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5 shadow-xl">
            <p className="text-sm text-slate-400">Total Trades</p>

            <p className="mt-2 text-3xl font-bold text-white">{totalTrades}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5 shadow-xl">
            <p className="text-sm text-slate-400">Buy Trades</p>

            <p className="mt-2 text-3xl font-bold text-green-400">{buyCount}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5 shadow-xl">
            <p className="text-sm text-slate-400">Sell Trades</p>

            <p className="mt-2 text-3xl font-bold text-red-400">{sellCount}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5 shadow-xl">
            <p className="text-sm text-slate-400">Total Value</p>

            <p className="mt-2 text-xl font-bold text-white">{formatMoney(totalValue)}</p>
          </div>
        </div>

        {/* Trade History */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422] shadow-2xl">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-white">Trade History</h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredTrades.length} trade
                {filteredTrades.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search trades..."
                className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-green-500/50 sm:w-72"
              />

              <button
                type="button"
                onClick={loadData}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-green-400" />

              <p className="text-sm text-slate-400">Loading trades...</p>
            </div>
          ) : filteredTrades.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl">📊</div>

              <h3 className="mt-4 font-bold text-white">No trades found</h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first trade to start tracking your activity.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="mt-5 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-green-400"
              >
                Add Trade
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-white/[0.03]">
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-4">Symbol</th>

                      <th className="px-5 py-4">Account</th>

                      <th className="px-5 py-4">Type</th>

                      <th className="px-5 py-4">Side</th>

                      <th className="px-5 py-4">Status</th>

                      <th className="px-5 py-4">Quantity</th>

                      <th className="px-5 py-4">Price</th>

                      <th className="px-5 py-4">Value</th>

                      <th className="px-5 py-4">Date</th>

                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTrades.map((trade) => {
                      const account = accounts.find((item) => item.id === trade.tradingAccountId);

                      return (
                        <tr
                          key={trade.id}
                          className="border-b border-white/5 transition hover:bg-white/[0.025]"
                        >
                          <td className="px-5 py-4">
                            <div className="font-bold text-white">{trade.symbol}</div>

                            <div className="mt-1 text-xs text-slate-500">{trade.assetClass}</div>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            {getAccountName(account)}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-slate-300">
                            {trade.assetClass}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={
                                trade.side === "BUY"
                                  ? "font-bold text-green-400"
                                  : "font-bold text-red-400"
                              }
                            >
                              {trade.side}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                trade.status,
                              )}`}
                            >
                              {trade.status.replace("_", " ")}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            {Number(trade.quantity).toLocaleString("en-IN")}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            {formatMoney(trade.price)}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold text-white">
                            {formatMoney(trade.totalValue)}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                            {formatDate(trade.createdAt)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(trade)}
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(trade)}
                                className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-white/5 md:hidden">
                {filteredTrades.map((trade) => {
                  const account = accounts.find((item) => item.id === trade.tradingAccountId);

                  return (
                    <div key={trade.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-bold text-white">{trade.symbol}</div>

                          <div className="mt-1 text-xs text-slate-500">
                            {getAccountName(account)}
                          </div>
                        </div>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            trade.status,
                          )}`}
                        >
                          {trade.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Asset</p>

                          <p className="mt-1 font-semibold text-slate-300">{trade.assetClass}</p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Side</p>

                          <p
                            className={
                              trade.side === "BUY"
                                ? "mt-1 font-bold text-green-400"
                                : "mt-1 font-bold text-red-400"
                            }
                          >
                            {trade.side}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Quantity</p>

                          <p className="mt-1 font-semibold text-slate-300">
                            {Number(trade.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Price</p>

                          <p className="mt-1 font-semibold text-slate-300">
                            {formatMoney(trade.price)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Total Value</p>

                          <p className="mt-1 font-bold text-white">
                            {formatMoney(trade.totalValue)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Date</p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(trade.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(trade)}
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(trade)}
                          className="flex-1 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(showCreateModal || editingTrade) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1422] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d1422] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingTrade ? "Edit Trade" : "Create Trade"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">Enter the trade details below.</p>
              </div>

              <button
                type="button"
                onClick={closeModals}
                disabled={saving}
                className="rounded-lg px-3 py-2 text-2xl text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              {/* Account */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Trading Account
                </label>

                <select
                  value={form.tradingAccountId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      tradingAccountId: event.target.value,
                    })
                  }
                  disabled={Boolean(editingTrade)}
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white outline-none focus:border-green-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" className="bg-[#0d1422]">
                    Select trading account
                  </option>

                  {accounts.map((account) => (
                    <option key={account.id} value={account.id} className="bg-[#0d1422]">
                      {getAccountName(account)}
                    </option>
                  ))}
                </select>

                {accounts.length === 0 && (
                  <p className="mt-2 text-xs text-red-400">No trading accounts found.</p>
                )}
              </div>

              {/* Symbol */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Symbol</label>

                <input
                  type="text"
                  value={form.symbol}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      symbol: event.target.value,
                    })
                  }
                  placeholder="RELIANCE"
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm uppercase text-white outline-none placeholder:text-slate-600 focus:border-green-500/50"
                />
              </div>

              {/* Asset / Side / Status */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Asset Class
                  </label>

                  <select
                    value={form.assetClass}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        assetClass: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#070b14] px-3 py-3 text-sm text-white outline-none focus:border-green-500/50"
                  >
                    <option value="EQUITY" className="bg-[#0d1422]">
                      EQUITY
                    </option>

                    <option value="CRYPTO" className="bg-[#0d1422]">
                      CRYPTO
                    </option>

                    <option value="FOREX" className="bg-[#0d1422]">
                      FOREX
                    </option>

                    <option value="OPTION" className="bg-[#0d1422]">
                      OPTION
                    </option>

                    <option value="FUTURE" className="bg-[#0d1422]">
                      FUTURE
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Side</label>

                  <select
                    value={form.side}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        side: event.target.value as "BUY" | "SELL",
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#070b14] px-3 py-3 text-sm text-white outline-none focus:border-green-500/50"
                  >
                    <option value="BUY" className="bg-[#0d1422]">
                      BUY
                    </option>

                    <option value="SELL" className="bg-[#0d1422]">
                      SELL
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Status</label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as TradeStatus,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#070b14] px-3 py-3 text-sm text-white outline-none focus:border-green-500/50"
                  >
                    <option value="PENDING" className="bg-[#0d1422]">
                      PENDING
                    </option>

                    <option value="FILLED" className="bg-[#0d1422]">
                      FILLED
                    </option>

                    <option value="PARTIALLY_FILLED" className="bg-[#0d1422]">
                      PARTIALLY FILLED
                    </option>

                    <option value="CANCELLED" className="bg-[#0d1422]">
                      CANCELLED
                    </option>

                    <option value="REJECTED" className="bg-[#0d1422]">
                      REJECTED
                    </option>
                  </select>
                </div>
              </div>

              {/* Quantity / Price / Fees */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.quantity}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        quantity: event.target.value,
                      })
                    }
                    placeholder="10"
                    className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-green-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Price</label>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price: event.target.value,
                      })
                    }
                    placeholder="1500"
                    className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-green-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Fees</label>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.fees}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        fees: event.target.value,
                      })
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-green-500/50"
                  />
                </div>
              </div>

              {/* External Order ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  External Order ID
                </label>

                <input
                  type="text"
                  value={form.externalOrderId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      externalOrderId: event.target.value,
                    })
                  }
                  placeholder="Optional"
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-green-500/50"
                />
              </div>

              {/* Executed At */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Executed At
                </label>

                <input
                  type="datetime-local"
                  value={form.executedAt}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      executedAt: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
                />
              </div>

              {/* Calculated Total */}
              {form.quantity && form.price && (
                <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Total Value</span>

                    <span className="text-lg font-bold text-green-400">
                      {formatMoney(Number(form.quantity) * Number(form.price))}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={saving}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingTrade ? "Update Trade" : "Create Trade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
