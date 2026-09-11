import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import TradingAccountsScreen from "../screens/TradingAccountsScreen";
import RiskMonitorScreen from "../screens/RiskMonitorScreen";
import AIAssistantScreen from "../screens/AIAssistantScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  TradingAccounts: undefined;
  RiskMonitor: undefined;
  AIAssistant: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Create Account" }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "FundGuard AI" }}
        />

        <Stack.Screen
          name="TradingAccounts"
          component={TradingAccountsScreen}
          options={{ title: "Trading Accounts" }}
        />

        <Stack.Screen
          name="RiskMonitor"
          component={RiskMonitorScreen}
          options={{ title: "Risk Monitor" }}
        />

        <Stack.Screen
          name="AIAssistant"
          component={AIAssistantScreen}
          options={{ title: "AI Assistant" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
