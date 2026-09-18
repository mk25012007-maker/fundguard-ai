"use client";

import { useEffect, useState } from "react";
import { getAiTradeAnalysis } from "../../../src/lib/api";

type AiAnalysisResponse = {
  success: boolean;
  analysisAvailable: boolean;
  analysisMode: string;
  tradeCount: number;
  message: string;
  analysis?: {
    summary: string;
    behaviour: string;
    riskAssessment: string;
    warnings: string[];
    recommendations: string[];
    metrics: {
      totalTrades: number;
      buyTrades: number;
      sellTrades: number;
      filledTrades: number;
      pendingTrades: number;
      cancelledTrades: number;
      totalTradeValue: number;
      totalFees: number;
      averageTradeValue: number;
      symbols: string[];
      mostTradedSymbol: string | null;
    };
    dataLimitations: string[];
  };
};

export default function AiInsightsPage() {
  const [data, setData] = useState<AiAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        setError("");

        const result = await getAiTradeAnalysis();

        setData(result);
      } catch (err) {
        console.error("AI analysis error:", err);
        setError("Unable to load AI analysis.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <p className="text-slate-400">Loading AI trading analysis...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-8">
            <h1 className="text-xl font-semibold">AI Insights</h1>

            <p className="mt-2 text-red-300">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const analysis = data.analysis;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-emerald-400">FundGuard AI</p>

              <h1 className="mt-1 text-3xl font-bold">AI Insights</h1>

              <p className="mt-2 text-slate-400">
                AI-powered analysis of your recorded trading activity.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Analysis mode</p>

              <p className="mt-1 font-semibold text-emerald-400">{data.analysisMode}</p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-xl">
              🤖
            </div>

            <div>
              <h2 className="font-semibold">Analysis Status</h2>

              <p className="text-sm text-slate-400">{data.message}</p>
            </div>
          </div>
        </section>

        {!analysis ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <h2 className="text-xl font-semibold">No AI analysis available</h2>

            <p className="mt-2 text-slate-400">Record some trades to generate trading insights.</p>
          </section>
        ) : (
          <>
            {/* Summary */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Trading Summary</h2>

              <p className="mt-3 leading-7 text-slate-300">{analysis.summary}</p>
            </section>

            {/* Behaviour + Risk */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-lg font-semibold">🧠 Behaviour</h2>

                <p className="mt-3 leading-7 text-slate-300">{analysis.behaviour}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-lg font-semibold">🛡️ Risk Assessment</h2>

                <p className="mt-3 leading-7 text-slate-300">{analysis.riskAssessment}</p>
              </div>
            </section>

            {/* Metrics */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">Trading Metrics</h2>

              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                <MetricCard label="Total Trades" value={analysis.metrics.totalTrades} />

                <MetricCard label="BUY Trades" value={analysis.metrics.buyTrades} />

                <MetricCard label="SELL Trades" value={analysis.metrics.sellTrades} />

                <MetricCard label="Filled" value={analysis.metrics.filledTrades} />

                <MetricCard label="Pending" value={analysis.metrics.pendingTrades} />

                <MetricCard label="Cancelled" value={analysis.metrics.cancelledTrades} />

                <MetricCard
                  label="Trade Value"
                  value={analysis.metrics.totalTradeValue.toFixed(2)}
                />

                <MetricCard label="Fees" value={analysis.metrics.totalFees.toFixed(2)} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-800/60 p-4">
                  <p className="text-sm text-slate-400">Average Trade Value</p>

                  <p className="mt-1 text-lg font-semibold">
                    {analysis.metrics.averageTradeValue.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-4">
                  <p className="text-sm text-slate-400">Most Traded Symbol</p>

                  <p className="mt-1 text-lg font-semibold">
                    {analysis.metrics.mostTradedSymbol ?? "N/A"}
                  </p>
                </div>
              </div>
            </section>

            {/* Warnings */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">⚠️ Warnings</h2>

              {analysis.warnings.length === 0 ? (
                <p className="mt-4 rounded-xl bg-emerald-950/40 p-4 text-emerald-300">
                  No major behavioural warnings detected.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {analysis.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-amber-200"
                    >
                      {warning}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recommendations */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">💡 Recommendations</h2>

              {analysis.recommendations.length === 0 ? (
                <p className="mt-4 text-slate-400">No additional recommendations at this time.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-slate-200"
                    >
                      <span className="mr-2 text-emerald-400">{index + 1}.</span>

                      {recommendation}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Limitations */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">ℹ️ Data Limitations</h2>

              <div className="mt-4 space-y-3">
                {analysis.dataLimitations.map((limitation, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-slate-800/50 p-4 text-sm text-slate-400"
                  >
                    {limitation}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
