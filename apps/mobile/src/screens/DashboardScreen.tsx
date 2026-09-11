import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Unable to logout.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FundGuard AI</Text>

      <Text style={styles.subtitle}>Trading Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Overview</Text>

        <Text style={styles.cardText}>No trading account connected</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Risk Status</Text>

        <Text style={styles.status}>SAFE</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today&apos;s P&amp;L</Text>

        <Text style={styles.pnl}>$0.00</Text>
      </View>

      <TouchableOpacity style={styles.aiButton} onPress={() => navigation.navigate("AIAssistant")}>
        <Text style={styles.aiButtonText}>Ask FundGuard AI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9fafb",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 30,
  },

  subtitle: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
  },

  status: {
    fontSize: 20,
    fontWeight: "700",
  },

  pnl: {
    fontSize: 24,
    fontWeight: "700",
  },

  aiButton: {
    marginTop: 5,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#2563eb",
  },

  aiButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  logoutButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#111827",
  },

  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
