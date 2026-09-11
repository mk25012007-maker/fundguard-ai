"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { apiFetch } from "@/src/lib/api";

export function Topbar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await apiFetch("/auth/logout", {
        method: "POST",
      });

      router.push("/login");
    } catch {
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>

        <p className="text-xs text-muted">Monitor your trading activity and risk</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">Trader</p>

          <p className="text-xs text-muted">FundGuard Account</p>
        </div>

        <Button variant="ghost">Profile</Button>

        <Button variant="ghost" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
}
