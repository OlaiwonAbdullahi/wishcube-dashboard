/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/gifts";

/* ─── Payload types ────────────────────────────────────────────── */
export interface PurchaseGiftPayload {
  type: "digital" | "physical";
  paymentMethod: "paystack" | "wallet";
  amount?: number; // required for digital
  productId?: string; // required for physical
  websiteId?: string; // optional link
  giftMessage?: string;
  callbackUrl?: string;
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

/* ─── Response / entity types ──────────────────────────────────── */
export interface ProductSnapshot {
  name: string;
  price: number;
  imageUrl?: string;
  vendorId?: string;
  storeName?: string;
}

export interface GiftWebsite {
  _id: string;
  recipientName: string;
  occasion: string;
  slug: string;
  publicUrl: string;
}

export interface GiftProductRef {
  _id: string;
  name: string;
  images: { url: string; publicId: string }[];
}

export interface Gift {
  _id: string;
  senderId: string;
  websiteId: GiftWebsite | null;
  type: "digital" | "physical";
  amount: number | null;
  currency: string;
  paymentMethod: "paystack" | "wallet";
  paymentReference: string | null;
  amountPaid: number;
  escrowStatus: "holding" | "released" | "refunded";
  giftMessage?: string;
  status: "pending" | "active" | "redeemed" | "expired";
  redeemToken: string;
  redeemedAt: string | null;
  expiresAt: string | null;
  payoutReference: string | null;
  payoutStatus: "pending" | "processing" | "completed";
  productId: GiftProductRef | null;
  productSnapshot: ProductSnapshot | null;
  recipientBankDetails?: DigitalRedemptionData["bankDetails"];
  deliveryAddress?: PhysicalRedemptionData["deliveryAddress"];
  createdAt: string;
  updatedAt: string;
}

export interface GiftResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/* ─── Helpers ──────────────────────────────────────────────────── */
const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

/* ─── Purchase a gift  POST /api/gifts ─────────────────────────── */
export const purchaseGift = async (
  payload: PurchaseGiftPayload
): Promise<GiftResponse<{ gift: Gift; paymentUrl?: string; reference?: string }>> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Purchase gift error:", error);
    return { success: false, message: "Network error purchasing gift" };
  }
};

/* ─── Get unattached gifts  GET /api/gifts/unattached ──────────── */
export const getUnattachedGifts = async (): Promise<
  GiftResponse<{ total: number; gifts: Gift[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/unattached`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Get unattached gifts error:", error);
    return { success: false, message: "Network error fetching unattached gifts" };
  }
};

/* ─── Get sent gifts  GET /api/gifts/sent ──────────────────────── */
export const getSentGifts = async (): Promise<
  GiftResponse<{ total: number; gifts: Gift[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sent`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Get sent gifts error:", error);
    return { success: false, message: "Network error fetching sent gifts" };
  }
};

/* ─── Verify payment  POST /api/gifts/verify-payment ───────────── */
export const verifyGiftPayment = async (
  reference: string
): Promise<GiftResponse<{ gift: Gift }>> => {
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

/* ─── Redeem a gift  POST /api/gifts/redeem/:token  (public) ───── */
export const redeemGift = async (
  token: string,
  redemptionData: DigitalRedemptionData | PhysicalRedemptionData
): Promise<GiftResponse<{ gift: Gift; order?: any }>> => {
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
