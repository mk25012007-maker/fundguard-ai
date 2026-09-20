const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://fundguardapi-production.up.railway.app";

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${API_URL}${path}`;

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

/* =========================================================
   AI ANALYSIS
========================================================= */

export async function getAiTradeAnalysis() {
  const response = await apiFetch("/ai-analysis/trades", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`AI analysis request failed with status ${response.status}`);
  }

  return response.json();
}

/* =========================================================
   ANALYTICS
========================================================= */

export async function getDashboardAnalytics() {
  const response = await apiFetch("/analytics/dashboard", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Dashboard analytics request failed with status ${response.status}`);
  }

  return response.json();
}

/* =========================================================
   TRADES
========================================================= */

export async function getTrades() {
  const response = await apiFetch("/trades", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Trades request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getTrade(tradeId: string) {
  const response = await apiFetch(`/trades/${tradeId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Trade request failed with status ${response.status}`);
  }

  return response.json();
}

/* =========================================================
   TRADING ACCOUNTS
========================================================= */

export async function getTradingAccounts() {
  const response = await apiFetch("/trading-accounts", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Trading accounts request failed with status ${response.status}`);
  }

  return response.json();
}

export type CreateTradeData = {
  tradingAccountId: string;
  symbol: string;
  assetClass: string;
  side: string;
  status?: string;
  quantity: number;
  price: number;
  totalValue?: number;
  fees?: number;
  externalOrderId?: string;
  executedAt?: string;
};

export async function createTrade(data: CreateTradeData) {
  const response = await apiFetch("/trades", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || `Create trade failed with status ${response.status}`);
  }

  return response.json();
}

export type UpdateTradeData = {
  symbol?: string;
  assetClass?: string;
  side?: string;
  status?: string;
  quantity?: number;
  price?: number;
  totalValue?: number;
  fees?: number;
  externalOrderId?: string;
  executedAt?: string;
};

export async function updateTrade(tradeId: string, data: UpdateTradeData) {
  const response = await apiFetch(`/trades/${tradeId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || `Update trade failed with status ${response.status}`);
  }

  return response.json();
}

export async function deleteTrade(tradeId: string) {
  const response = await apiFetch(`/trades/${tradeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || `Delete trade failed with status ${response.status}`);
  }

  return response.json();
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

export async function getNotifications() {
  const response = await apiFetch("/notifications", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Notifications request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getUnreadNotificationCount() {
  const response = await apiFetch("/notifications/unread-count", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Unread notification count request failed with status ${response.status}`);
  }

  return response.json();
}

export async function markNotificationAsRead(notificationId: string) {
  const response = await apiFetch(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(`Mark notification as read failed with status ${response.status}`);
  }

  return response.json();
}

export async function markAllNotificationsAsRead() {
  const response = await apiFetch("/notifications/read-all", {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(`Mark all notifications as read failed with status ${response.status}`);
  }

  return response.json();
}

export async function deleteNotification(notificationId: string) {
  const response = await apiFetch(`/notifications/${notificationId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Delete notification failed with status ${response.status}`);
  }

  return response.json();
}

export async function createTestNotification(title?: string, message?: string) {
  const response = await apiFetch("/notifications/test", {
    method: "POST",
    body: JSON.stringify({
      title,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Create test notification failed with status ${response.status}`);
  }

  return response.json();
}
