"use client";

import { toast } from "sonner";
import { getAuth, getRefreshToken, setAccessToken, clearAuth } from "./auth";

const REFRESH_URL = "https://api.usewishcube.com/api/auth/refresh";
// Only intercept calls to our own backend - never third-party requests
// (Google OAuth, Paystack, etc).
const OWN_API_HOST = "api.usewishcube.com";
// Endpoints whose own 401s are legitimate business responses (bad
// credentials, expired refresh token) rather than "access token expired" -
// retrying these after a refresh would be meaningless or looping.
const EXCLUDED_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/vendors/login"];

let patched = false;
let refreshPromise: Promise<string | null> | null = null;

const resolveUrl = (input: RequestInfo | URL): string =>
  typeof input === "string"
    ? input
    : input instanceof URL
      ? input.toString()
      : input.url;

const shouldIntercept = (url: string) =>
  url.includes(OWN_API_HOST) && !EXCLUDED_PATHS.some((p) => url.includes(p));

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json();
    if (json.success && json.data?.accessToken) {
      setAccessToken(json.data.accessToken);
      return json.data.accessToken as string;
    }
  } catch {
    // fall through to null
  }
  return null;
};

/**
 * Transparently refreshes an expired access token on a 401 and retries the
 * request once, instead of leaving every page silently broken for up to an
 * hour after the token expires. Patches window.fetch a single time so every
 * existing lib/*.ts call site benefits without being rewritten individually.
 */
export function initFetchInterceptor() {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);

    const url = resolveUrl(input);
    if (response.status !== 401 || !shouldIntercept(url)) {
      return response;
    }

    // Nothing to refresh if there's no session to begin with.
    if (!getAuth() && !getRefreshToken()) {
      return response;
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;

    if (!newToken) {
      clearAuth();
      if (!window.location.pathname.startsWith("/w/")) {
        toast.error("Your session expired. Please log in again.");
        window.location.href = "/";
      }
      return response;
    }

    const retryHeaders = new Headers(init?.headers);
    if (retryHeaders.has("Authorization")) {
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
    }

    return originalFetch(input, { ...init, headers: retryHeaders });
  };
}
