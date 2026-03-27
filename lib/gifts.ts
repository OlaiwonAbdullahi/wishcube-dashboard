"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/gifts";

export interface GiftData {
  websiteId: string;
  type: "digital" | "physical";
  amount: number;
  currency: string;
  productId?: string | null;
  paymentMethod: "paystack";
  giftMessage?: string;
}

export interface DigitalRedemptionData {
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
  };
}

export interface PhysicalRedemptionData {
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
}

export interface GiftResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

// Attach a gift to a website
export const attachGift = async (
  giftData: GiftData
): Promise<GiftResponse<{ gift: any; paymentUrl: string; reference: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(giftData),
    });
    return await response.json();
  } catch (error) {
    console.error("Attach gift error:", error);
    return { success: false, message: "Network error attaching gift" };
  }
};

// Redeem a gift (Recipient)
export const redeemGift = async (
  token: string,
  redemptionData: DigitalRedemptionData | PhysicalRedemptionData
): Promise<GiftResponse<{ gift: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/redeem/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(redemptionData),
    });
    return await response.json();
  } catch (error) {
    console.error("Redeem gift error:", error);
    return { success: false, message: "Network error redeeming gift" };
  }
};

// Verify gift payment
export const verifyGiftPayment = async (
  reference: string
): Promise<GiftResponse<{ gift: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-payment`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ reference }),
    });
    return await response.json();
  } catch (error) {
    console.error("Verify gift payment error:", error);
    return { success: false, message: "Network error verifying gift payment" };
  }
};
