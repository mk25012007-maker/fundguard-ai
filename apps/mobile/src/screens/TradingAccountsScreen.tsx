import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../context/AuthContext";

type TradingAccount = {
  id: string;
  userId: string;
  broker: string;
  accountLabel: string;
  externalId: string;
  status: string;
  baseCurrency: string;
  balance: string;
  apiKeyEncrypted: string | null;
  connectedAt: string;
  updatedAt: string;
};

export default function TradingAccountsScreen() {
  const { accessToken } = useAuth();

  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3001";

  const loadAccounts = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(`${apiUrl}/trading-accounts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = (await response.json()) as TradingAccount[];

      setAccounts(data);
    } catch (err) {
      console.error("Failed to load trading accounts:", err);
      setError("Unable to load trading accounts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken, apiUrl]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadAccounts();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [loadAccounts]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAccounts();
  };

  const renderAccount = ({ item }: { item: TradingAccount }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.accountLabel}>{item.accountLabel}</Text>
            <Text style={styles.broker}>{item.broker}</Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Account ID</Text>
          <Text style={styles.value}>{item.externalId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Currency</Text>
          <Text style={styles.value}>{item.baseCurrency}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>
            {item.baseCurrency} {item.balance}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading accounts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trading Accounts</Text>
      <Text style={styles.subtitle}>Monitor your connected trading accounts</Text>

      {accounts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No trading accounts</Text>
          <Text style={styles.emptyText}>
            Connect a trading account to start monitoring it with FundGuard AI.
          </Text>
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderAccount}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginTop: 5,
    marginBottom: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6b7280",
  },

  error: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  accountLabel: {
    fontSize: 18,
    fontWeight: "700",
  },

  broker: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: "#6b7280",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
  },

  balance: {
    fontSize: 16,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 25,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 21,
  },
});
