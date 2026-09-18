"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../src/lib/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await apiFetch("/auth/me");

        console.log("Account /auth/me status:", response.status);

        if (!response.ok) {
          const text = await response.text();
          console.error("Account API error:", text);
          setError(`Unable to load account (${response.status})`);
          return;
        }

        const data = await response.json();

        console.log("Account user:", data);

        setUser(data);
      } catch (err) {
        console.error("Failed to load account:", err);
        setError("Unable to connect to FundGuard AI API.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1220] p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-emerald-400">FundGuard AI</p>

            <h1 className="mt-1 text-3xl font-bold">Account</h1>

            <p className="mt-2 text-gray-400">Manage your FundGuard AI account information.</p>
          </div>

          {loading && (
            <div className="rounded-xl bg-white/5 p-6 text-gray-400">
              Loading account information...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && user && (
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-2xl font-bold text-emerald-400">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      {user.firstName} {user.lastName}
                    </h2>

                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">First Name</p>

                  <p className="mt-2 text-lg font-semibold">{user.firstName}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">Last Name</p>

                  <p className="mt-2 text-lg font-semibold">{user.lastName}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">Email</p>

                  <p className="mt-2 break-all text-lg font-semibold">{user.email}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">Role</p>

                  <p className="mt-2 text-lg font-semibold">{user.role}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">Account Status</p>

                  <p className="mt-2 text-lg font-semibold text-emerald-400">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">Email Verification</p>

                  <p className="mt-2 text-lg font-semibold">
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="font-semibold text-emerald-300">Account connected successfully</p>

                <p className="mt-1 text-sm text-gray-400">
                  Your FundGuard AI account is authenticated and connected to the backend.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
