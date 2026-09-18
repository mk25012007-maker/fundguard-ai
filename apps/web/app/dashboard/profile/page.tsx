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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiFetch("/auth/me");

        if (!response.ok) {
          setError(`Unable to load profile (${response.status})`);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Unable to connect to FundGuard AI API.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1220] p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-xl">
          <p className="text-sm font-medium text-emerald-400">FundGuard AI</p>

          <h1 className="mt-1 text-3xl font-bold">Profile</h1>

          <p className="mt-2 text-gray-400">View your FundGuard AI trading profile.</p>

          {loading && (
            <div className="mt-8 rounded-xl bg-white/5 p-6 text-gray-400">Loading profile...</div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && user && (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-2xl font-bold text-emerald-400">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </h2>

                    <p className="mt-1 text-gray-400">{user.email}</p>

                    <span className="mt-3 inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">Personal Information</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-400">First Name</p>
                    <p className="mt-1 font-medium">{user.firstName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Last Name</p>
                    <p className="mt-1 font-medium">{user.lastName}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="mt-1 break-all font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">Account Information</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-400">Account Status</p>
                    <p className="mt-1 font-semibold text-emerald-400">
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Email Verification</p>
                    <p className="mt-1 font-semibold">
                      {user.emailVerified ? "Verified" : "Not verified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">User Role</p>
                    <p className="mt-1 font-semibold">{user.role}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="mt-1 break-all text-xs text-gray-300">{user.id}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="font-semibold text-emerald-300">Profile connected successfully</p>

                <p className="mt-1 text-sm text-gray-400">
                  Your profile is connected to the FundGuard AI backend.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
