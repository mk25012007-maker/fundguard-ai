import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistantScreen() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const handleAskAI = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      Alert.alert("Message required", "Please enter a question for FundGuard AI.");
      return;
    }

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!apiUrl) {
      Alert.alert("Configuration Error", "API URL is not configured.");
      return;
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedMessage,
    };

    setMessages((current) => [...current, userMessage]);

    setMessage("");
    setIsLoading(true);

    try {
      const apiResponse = await fetch(`${apiUrl}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        const errorMessage = Array.isArray(data?.message)
          ? data.message.join("\n")
          : data?.message || "AI request failed.";

        throw new Error(errorMessage);
      }

      if (!data?.success || !data?.response) {
        throw new Error("Invalid AI response from server.");
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.response,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unable to connect to FundGuard AI.";

      Alert.alert("AI Assistant Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    Alert.alert("Clear conversation", "Are you sure you want to clear this conversation?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => setMessages([]),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FundGuard AI</Text>

          <Text style={styles.subtitle}>AI Trading Risk Assistant</Text>
        </View>

        {messages.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearConversation}
            disabled={isLoading}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ask FundGuard AI</Text>

        <Text style={styles.description}>
          Ask questions about your trading risk, account limits, drawdown, or trading decisions.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ask something..."
          placeholderTextColor="#9ca3af"
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAskAI}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#ffffff" />

              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Ask AI</Text>
          )}
        </TouchableOpacity>
      </View>

      {messages.length > 0 && (
        <View style={styles.conversation}>
          <Text style={styles.conversationTitle}>Conversation</Text>

          {messages.map((item) => (
            <View
              key={item.id}
              style={[
                styles.messageBubble,
                item.role === "user" ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageRole,
                  item.role === "user" ? styles.userRole : styles.assistantRole,
                ]}
              >
                {item.role === "user" ? "You" : "FundGuard AI"}
              </Text>

              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f9fafb",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
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
  },

  clearButton: {
    marginTop: 22,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },

  clearButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dc2626",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6b7280",
    marginBottom: 16,
  },

  input: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#ffffff",
    textAlignVertical: "top",
    color: "#111827",
  },

  button: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#111827",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  conversation: {
    marginTop: 20,
  },

  conversationTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  messageBubble: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  userBubble: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },

  assistantBubble: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },

  messageRole: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },

  userRole: {
    color: "#2563eb",
  },

  assistantRole: {
    color: "#111827",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
});
