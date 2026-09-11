import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "../storage/authStorage";

type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  login: (email: string, password: string) => Promise<void>;

  setAuthTokens: (accessToken: string, refreshToken: string) => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<AuthUser | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // =========================
  // RESTORE SESSION
  // =========================

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const storedAccessToken = await getAccessToken();

        const storedRefreshToken = await getRefreshToken();

        if (!isMounted) {
          return;
        }

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to restore authentication:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      void restoreSession();
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = async (email: string, password: string) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    console.log("FundGuard API URL:", apiUrl);

    if (!apiUrl) {
      throw new Error("API URL is not configured.");
    }

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim().toLowerCase(),

        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join("\n")
        : data?.message || "Login failed.";

      throw new Error(message);
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: loggedInUser } = data;

    if (!newAccessToken || !newRefreshToken || !loggedInUser) {
      throw new Error("Invalid login response from server.");
    }

    await saveTokens(newAccessToken, newRefreshToken);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  // =========================
  // SET AUTH TOKENS
  // =========================

  const setAuthTokens = async (newAccessToken: string, newRefreshToken: string) => {
    await saveTokens(newAccessToken, newRefreshToken);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    try {
      if (apiUrl) {
        await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({}),

          credentials: "include",
        });
      }
    } catch (error) {
      console.error("API logout error:", error);
    } finally {
      await clearTokens();

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        accessToken,
        refreshToken,
        login,
        setAuthTokens,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
