"use client";

const API_BASE_URL = "https://api.usewishcube.com/api/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

// Token management
const TOKEN_KEY = "wishcube_access_token";
const REFRESH_TOKEN_KEY = "wishcube_refresh_token";
const USER_KEY = "wishcube_user";

export const setAuth = (data: {
  accessToken: string;
  refreshToken: string;
  user: User;
}) => {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

export const getAuth = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  return token && user ? { token, user: JSON.parse(user) as User } : null;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// API calls
export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setAuth(data.data);
    }
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Network error during registration" };
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setAuth(data.data);
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error during login" };
  }
};

export const googleAuth = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setAuth(data.data);
    }
    return data;
  } catch (error) {
    console.error("Google auth error:", error);
    return {
      success: false,
      message: "Network error during Google authentication",
    };
  }
};
