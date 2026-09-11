"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/src/components/Alert";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Status } from "@/src/components/Status";

export default function Home() {
  const [message, setMessage] = useState("Checking API...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001")
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("API connection failed");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium text-primary">
            AI-POWERED TRADING RISK MANAGEMENT
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">FundGuard AI</h1>

          <p className="mt-3 max-w-2xl text-muted">
            Monitor trades, manage risk, and protect your trading capital with intelligent risk
            management.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card title="Risk Management" description="Monitor your trading risk in real time.">
            <div className="text-2xl font-semibold text-success">Protected</div>
          </Card>

          <Card title="Trading Accounts" description="Keep your trading accounts organized.">
            <div className="text-2xl font-semibold">Ready</div>
          </Card>

          <Card title="AI Monitoring" description="Intelligent monitoring for trading activity.">
            <div className="text-2xl font-semibold text-secondary">Active</div>
          </Card>
        </section>

        <section className="mt-6">
          {loading ? (
            <Status type="loading" message="Connecting to FundGuard API..." />
          ) : (
            <Alert
              type={message.includes("Cannot GET") ? "info" : "success"}
              title="API Connection"
            >
              {message}
            </Alert>
          )}
        </section>

        <section className="mt-8 flex gap-3">
          <Button onClick={() => window.location.reload()}>Refresh Status</Button>

          <Button variant="ghost">Dashboard</Button>
        </section>
      </div>
    </main>
  );
}
