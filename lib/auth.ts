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
  code?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

const TOKEN_KEY = "wishcube_access_token";
const REFRESH_TOKEN_KEY = "wishcube_refresh_token";
const USER_KEY = "wishcube_user";
// The access token itself expires in 1h, but a valid refresh token (7d) can
// silently mint new ones (see lib/api-client.ts) - so the session cookie
// that gates routes in proxy.ts should track the refresh token's lifetime,
// not the short-lived access token's.
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, seconds

export const setAuth = (data: {
  accessToken: string;
  refreshToken: string;
  user: User;
}) => {
  if (!data || !data.user) return;
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  document.cookie = `${TOKEN_KEY}=${data.accessToken}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${data.refreshToken}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
};

// Update just the access-token cookie/localStorage after a silent refresh
// (see lib/api-client.ts), without touching the refresh token or user record.
export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
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

export const validateResetToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate-reset-token/${token}`);
    return await response.json();
  } catch (error) {
    console.error("Validate reset token error:", error);
    return { success: false, message: "Network error validating reset token" };
  }
};

const VENDOR_API_BASE_URL = "https://api.usewishcube.com/api/vendors";

export const vendorForgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${VENDOR_API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error("Vendor forgot password error:", error);
    return { success: false, message: "Network error during forgot password" };
  }
};

export const validateVendorResetToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${VENDOR_API_BASE_URL}/validate-reset-token/${token}`);
    return await response.json();
  } catch (error) {
    console.error("Validate vendor reset token error:", error);
    return { success: false, message: "Network error validating reset token" };
  }
};

export const vendorResetPassword = async (token: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${VENDOR_API_BASE_URL}/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Vendor reset password error:", error);
    return { success: false, message: "Network error during reset password" };
  }
};
