import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function RiskMonitorScreen() {
  const dailyLoss = 0;
  const dailyLossLimit = 5;
  const drawdown = 0;
  const maxDrawdown = 10;
  const riskPerTrade = 0.5;
  const remainingRisk = 5;

  const getRiskStatus = () => {
    if (drawdown >= maxDrawdown || dailyLoss >= dailyLossLimit) {
      return "DANGER";
    }

    if (drawdown >= maxDrawdown * 0.7 || dailyLoss >= dailyLossLimit * 0.7) {
      return "WARNING";
    }

    return "SAFE";
  };

  const riskStatus = getRiskStatus();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Risk Monitor</Text>
      <Text style={styles.subtitle}>FundGuard AI risk protection</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>CURRENT RISK STATUS</Text>

        <Text
          style={[
            styles.status,
            riskStatus === "SAFE" && styles.safe,
            riskStatus === "WARNING" && styles.warning,
            riskStatus === "DANGER" && styles.danger,
          ]}
        >
          {riskStatus}
        </Text>

        <Text style={styles.statusDescription}>
          {riskStatus === "SAFE"
            ? "Your account is within safe risk limits."
            : riskStatus === "WARNING"
              ? "Risk levels are approaching your limits."
              : "Trading risk limit has been reached."}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Loss</Text>
        <Text style={styles.value}>${dailyLoss.toFixed(2)}</Text>
        <Text style={styles.limit}>Limit: ${dailyLossLimit.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Maximum Drawdown</Text>
        <Text style={styles.value}>{drawdown.toFixed(2)}%</Text>
        <Text style={styles.limit}>Limit: {maxDrawdown.toFixed(2)}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Risk Per Trade</Text>
        <Text style={styles.value}>{riskPerTrade.toFixed(2)}%</Text>
        <Text style={styles.limit}>FundGuard recommended maximum</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Remaining Risk</Text>
        <Text style={styles.value}>{remainingRisk.toFixed(2)}%</Text>
        <Text style={styles.limit}>Available risk for today</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Risk Protection</Text>
        <Text style={styles.infoText}>
          FundGuard AI monitors your trading risk and helps prevent excessive daily losses and
          drawdown.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f9fafb",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 5,
    marginBottom: 25,
  },

  statusCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },

  statusLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 8,
  },

  status: {
    fontSize: 30,
    fontWeight: "800",
  },

  safe: {
    color: "#16a34a",
  },

  warning: {
    color: "#d97706",
  },

  danger: {
    color: "#dc2626",
  },

  statusDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  value: {
    fontSize: 26,
    fontWeight: "700",
  },

  limit: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: "#eef2ff",
    borderRadius: 12,
    padding: 20,
    marginTop: 5,
    marginBottom: 20,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },
});
