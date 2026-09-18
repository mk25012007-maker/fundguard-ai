"use client";

import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../lib/api";

type AnalyticsData = {
  summary: {
    totalTrades: number;
    totalVolume: number;
  };

  sideBreakdown: {
    buyTrades: number;
    sellTrades: number;
    buyVolume: number;
    sellVolume: number;
  };

  topSymbols: Array<{
    symbol: string;
    trades: number;
    volume: number;
  }>;

  assetClassBreakdown: Array<{
    assetClass: string;
    trades: number;
    volume: number;
  }>;

  dailyActivity: Array<{
    date: string;
    trades: number;
    volume: number;
    fees: number;
  }>;
};

function shortMoney(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }

  return `$${value.toFixed(0)}`;
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function AnalyticsCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const result = await getDashboardAnalytics();

        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load analytics");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="mt-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="animate-pulse">
            <div className="h-6 w-48 rounded bg-slate-800" />

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="h-72 rounded-xl bg-slate-800" />
              <div className="h-72 rounded-xl bg-slate-800" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8">
        <div className="rounded-2xl border border-red-900 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-white">Analytics Charts</h2>

          <p className="mt-3 text-sm text-red-400">{error}</p>

          <p className="mt-2 text-xs text-slate-500">
            Make sure the API is running and you are logged in.
          </p>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const maxDailyTrades = Math.max(...data.dailyActivity.map((day) => day.trades), 1);

  const maxSymbolVolume = Math.max(...data.topSymbols.map((item) => item.volume), 1);

  const maxAssetVolume = Math.max(...data.assetClassBreakdown.map((item) => item.volume), 1);

  const totalSideTrades = data.sideBreakdown.buyTrades + data.sideBreakdown.sellTrades;

  const buyPercentage =
    totalSideTrades > 0 ? (data.sideBreakdown.buyTrades / totalSideTrades) * 100 : 0;

  const sellPercentage =
    totalSideTrades > 0 ? (data.sideBreakdown.sellTrades / totalSideTrades) * 100 : 0;

  return (
    <section className="mt-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics Charts</h2>

        <p className="mt-1 text-sm text-slate-400">
          Visual analysis of your real trading activity.
        </p>
      </div>

      {/* 7 Day Trading Activity */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-bold text-white">7-Day Trading Activity</h3>

        <p className="mt-1 text-xs text-slate-500">Daily number of recorded trades</p>

        <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4">
          {data.dailyActivity.map((day) => {
            const height = (day.trades / maxDailyTrades) * 100;

            return (
              <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center justify-end">
                <span className="mb-2 text-xs font-semibold text-white">{day.trades}</span>

                <div className="flex h-52 w-full items-end justify-center">
                  <div
                    className="w-full max-w-12 rounded-t-lg bg-emerald-500 transition-all"
                    style={{
                      height: `${Math.max(height, day.trades > 0 ? 5 : 1)}%`,
                    }}
                  />
                </div>

                <span className="mt-3 text-[10px] text-slate-500 sm:text-xs">
                  {formatDate(day.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buy vs Sell and Volume */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Buy vs Sell */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-bold text-white">Buy vs Sell</h3>

          <p className="mt-1 text-xs text-slate-500">Trade count distribution</p>

          <div className="mt-8">
            <div className="flex h-8 overflow-hidden rounded-full bg-slate-800">
              <div
                className="bg-emerald-500 transition-all"
                style={{
                  width: `${buyPercentage}%`,
                }}
              />

              <div
                className="bg-red-500 transition-all"
                style={{
                  width: `${sellPercentage}%`,
                }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">🟢 Buy</p>

                <p className="mt-2 text-2xl font-bold text-white">{data.sideBreakdown.buyTrades}</p>

                <p className="mt-1 text-xs text-slate-500">{buyPercentage.toFixed(1)}%</p>

                <p className="mt-2 text-xs text-slate-500">
                  Volume {shortMoney(data.sideBreakdown.buyVolume)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">🔴 Sell</p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {data.sideBreakdown.sellTrades}
                </p>

                <p className="mt-1 text-xs text-slate-500">{sellPercentage.toFixed(1)}%</p>

                <p className="mt-2 text-xs text-slate-500">
                  Volume {shortMoney(data.sideBreakdown.sellVolume)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Volume */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-bold text-white">Trading Volume</h3>

          <p className="mt-1 text-xs text-slate-500">Buy and sell volume comparison</p>

          <div className="mt-8 space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Buy Volume</span>

                <span className="font-semibold text-emerald-400">
                  {shortMoney(data.sideBreakdown.buyVolume)}
                </span>
              </div>

              <div className="mt-3 h-4 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      data.summary.totalVolume > 0
                        ? (data.sideBreakdown.buyVolume / data.summary.totalVolume) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Sell Volume</span>

                <span className="font-semibold text-red-400">
                  {shortMoney(data.sideBreakdown.sellVolume)}
                </span>
              </div>

              <div className="mt-3 h-4 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${
                      data.summary.totalVolume > 0
                        ? (data.sideBreakdown.sellVolume / data.summary.totalVolume) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5">
              <p className="text-xs text-slate-500">Total Volume</p>

              <p className="mt-1 text-3xl font-bold text-white">
                {shortMoney(data.summary.totalVolume)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Symbols */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-bold text-white">Top Symbols</h3>

        <p className="mt-1 text-xs text-slate-500">Ranked by trading volume</p>

        {data.topSymbols.length === 0 ? (
          <div className="mt-6 rounded-xl bg-slate-800 p-8 text-center">
            <p className="text-sm text-slate-500">No symbol data available yet.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {data.topSymbols.map((item, index) => {
              const width = (item.volume / maxSymbolVolume) * 100;

              return (
                <div key={item.symbol}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-400">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-semibold text-white">{item.symbol}</span>

                        <span className="shrink-0 text-sm text-slate-300">
                          {shortMoney(item.volume)}
                        </span>
                      </div>

                      <div className="mt-2 h-2 rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-slate-500">{item.trades} trades</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset Class Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-bold text-white">Asset Class Breakdown</h3>

        <p className="mt-1 text-xs text-slate-500">Trading volume by asset class</p>

        {data.assetClassBreakdown.length === 0 ? (
          <div className="mt-6 rounded-xl bg-slate-800 p-8 text-center">
            <p className="text-sm text-slate-500">No asset class data available yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.assetClassBreakdown.map((item) => {
              const width = (item.volume / maxAssetVolume) * 100;

              return (
                <div key={item.assetClass} className="rounded-xl bg-slate-800 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">{item.assetClass}</span>

                    <span className="text-xs text-slate-500">{item.trades} trades</span>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-white">{shortMoney(item.volume)}</p>

                  <div className="mt-4 h-2 rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
