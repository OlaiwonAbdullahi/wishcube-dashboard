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

const TOKEN_KEY = "wishcube_access_token";
const REFRESH_TOKEN_KEY = "wishcube_refresh_token";
const USER_KEY = "wishcube_user";

export const setAuth = (data: {
  accessToken: string;
  refreshToken: string;
  user: User;
}) => {
  if (!data || !data.user) return;
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  document.cookie = `${TOKEN_KEY}=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${data.refreshToken}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=86400; SameSite=Lax`;
};
export const getAuth = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);

  if (!token || !user || user === "undefined") return null;

  try {
    return { token, user: JSON.parse(user) as User };
  } catch (error) {
    console.error("Auth parsing error:", error);
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${USER_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

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
    // Do not call setAuth here because the backend now requires email verification and doesn't send tokens immediately.
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
    console.log("Login response:", data);
    if (data.success && data.data) {
      setAuth(data.data);
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error during login" };
  }
};
export const vendorLogin = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(
      `https://api.usewishcube.com/api/vendors/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );
    const data = await response.json();
    if (data.success && data.data) {
      const authData = {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        user: {
          id: data.data.vendor.id || data.data.vendor._id,
          name: data.data.vendor.ownerName,
          email: data.data.vendor.email,
          role: "vendor",
          authProvider: "local",
          avatar: data.data.vendor.logo,
        },
      };
      setAuth(authData);
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

export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-email/${token}`);
    return await response.json();
  } catch (error) {
    console.error("Verify email error:", error);
    return { success: false, message: "Network error during email verification" };
  }
};

export const resendVerification = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error("Resend verification error:", error);
    return { success: false, message: "Network error while resending verification" };
  }
};

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, message: "Network error during forgot password" };
  }
};

export const resetPassword = async (token: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, message: "Network error during reset password" };
  }
};
