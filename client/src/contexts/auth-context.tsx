import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { AdminAuthResponse } from "../types";

type AuthContextType = {
  token: string | null;
  user: AdminAuthResponse["user"] | null;
  isAuthenticated: boolean;
  login: (data: AdminAuthResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "portfolio_admin_token";
const USER_KEY = "portfolio_admin_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AdminAuthResponse["user"] | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login: (data: AdminAuthResponse) => {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
