"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/subscriptions";

export type PlanType = "pro" | "premium";
export type SubscriptionStatus = "active" | "inactive" | "expired";

export interface SubscriptionPlan {
  planType: PlanType;
  label: string;
  price: number;
  tier: string;
}

export const PLANS: SubscriptionPlan[] = [
  { planType: "pro", label: "Pro", price: 10000, tier: "pro" },
  { planType: "premium", label: "Premium", price: 50000, tier: "premium" },
];

export interface InitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface SubscriptionStatusData {
  tier: "free" | PlanType;
  status: SubscriptionStatus;
  expiry: string | null;
}

export interface SubscriptionResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

export const initializeSubscription = async (
  planType: PlanType,
  callbackUrl?: string
): Promise<SubscriptionResponse<InitializeResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        planType,
        ...(callbackUrl ? { callbackUrl } : {}),
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Initialize subscription error:", error);
    return { success: false, message: "Network error initializing subscription" };
  }
};

export const verifySubscription = async (
  reference: string
): Promise<SubscriptionResponse<SubscriptionStatusData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify/${reference}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Verify subscription error:", error);
    return { success: false, message: "Network error verifying subscription" };
  }
};

export const getSubscriptionStatus = async (): Promise<
  SubscriptionResponse<SubscriptionStatusData>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch subscription status error:", error);
    return { success: false, message: "Network error fetching subscription status" };
  }
};
