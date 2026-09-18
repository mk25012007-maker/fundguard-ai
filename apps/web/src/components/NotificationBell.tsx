"use client";

import { useEffect, useState } from "react";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/src/lib/api";

type Notification = {
  id: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  isRead: boolean;
  sentAt?: string | null;
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadNotifications() {
    try {
      setLoading(true);

      const data = await getNotifications();

      const items = Array.isArray(data) ? data : [];

      setNotifications(items);

      setUnreadCount(items.filter((notification: Notification) => !notification.isRead).length);
    } catch {
      // User may not be logged in.
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();

    const interval = window.setInterval(loadNotifications, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  async function handleMarkAsRead(notificationId: string) {
    try {
      setActionLoading(notificationId);

      await markNotificationAsRead(notificationId);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch {
      alert("Failed to mark notification as read.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      setActionLoading("all");

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch {
      alert("Failed to mark all notifications as read.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(notificationId: string) {
    try {
      setActionLoading(notificationId);

      const notification = notifications.find((item) => item.id === notificationId);

      await deleteNotification(notificationId);

      setNotifications((current) => current.filter((item) => item.id !== notificationId));

      if (notification && !notification.isRead) {
        setUnreadCount((current) => Math.max(0, current - 1));
      }
    } catch {
      alert("Failed to delete notification.");
    } finally {
      setActionLoading(null);
    }
  }

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-lg transition hover:bg-surface-raised"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 className="font-semibold text-foreground">Notifications</h3>

                <p className="mt-0.5 text-xs text-muted">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadNotifications}
                  disabled={loading}
                  className="rounded-md border border-border px-2.5 py-1.5 text-xs text-muted transition hover:bg-surface-raised hover:text-foreground disabled:opacity-50"
                >
                  {loading ? "..." : "Refresh"}
                </button>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    disabled={actionLoading === "all"}
                    className="rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 disabled:opacity-50"
                  >
                    {actionLoading === "all" ? "..." : "Read all"}
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-3xl">🔔</div>

                  <p className="mt-3 text-sm font-medium text-foreground">No notifications</p>

                  <p className="mt-1 text-xs text-muted">You're all caught up.</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-border p-4 transition last:border-b-0 ${
                        notification.isRead ? "bg-surface" : "bg-primary/5"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm">
                          {notification.type === "RISK_ALERT"
                            ? "⚠️"
                            : notification.type === "AI_INSIGHT"
                              ? "🤖"
                              : notification.type === "TRADE_EXECUTED"
                                ? "📈"
                                : notification.type === "ACCOUNT_STATUS"
                                  ? "💼"
                                  : "🔔"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={`text-sm ${
                                notification.isRead ? "font-medium" : "font-semibold"
                              } text-foreground`}
                            >
                              {notification.title}
                            </h4>

                            {!notification.isRead && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-muted">{notification.body}</p>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-muted">
                              {formatDate(notification.createdAt)}
                            </span>

                            <div className="flex gap-2">
                              {!notification.isRead && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  disabled={actionLoading === notification.id}
                                  className="text-[11px] font-medium text-primary hover:underline disabled:opacity-50"
                                >
                                  Read
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDelete(notification.id)}
                                disabled={actionLoading === notification.id}
                                className="text-[11px] font-medium text-red-400 hover:underline disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
