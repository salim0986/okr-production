"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export type UserRole = "admin" | "team-lead" | "employee";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
  organization_id?: string;
  team_id: string;
  // Add other fields from your token payload if needed
}

interface AuthContextType {
  user: DecodedToken | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    orgName: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const decodedUser: DecodedToken = jwtDecode(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      setUser(decodedUser);

      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    name: string,
    orgName: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, orgName, email, password, role }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      const decodedUser: DecodedToken = jwtDecode(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      setUser(decodedUser);

      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
