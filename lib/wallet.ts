/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/wallet";

export interface Transaction {
  _id: string;
  user: string;
  type: "credit" | "debit";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  description: string;
  status: "success" | "pending" | "failed";
  metadata?: {
    paystackData?: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface WalletResponse<T> {
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

// Get wallet balance
export const getWalletBalance = async (): Promise<
  WalletResponse<{ walletBalance: number }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/balance`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch wallet balance error:", error);
    return { success: false, message: "Network error fetching wallet balance" };
  }
};

// Fund wallet
export const fundWallet = async (
  amount: number,
  callbackUrl?: string,
): Promise<WalletResponse<{ paymentUrl: string; reference: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fund`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, ...(callbackUrl ? { callbackUrl } : {}) }),
    });
    return await response.json();
  } catch (error) {
    console.error("Fund wallet error:", error);
    return { success: false, message: "Network error funding wallet" };
  }
};

// Verify wallet funding
export const verifyWalletFunding = async (
  reference: string,
): Promise<WalletResponse<{ newBalance: number }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ reference }),
    });
    return await response.json();
  } catch (error) {
    console.error("Verify wallet funding error:", error);
    return {
      success: false,
      message: "Network error verifying wallet funding",
    };
  }
};

// Get wallet transactions
export const getWalletTransactions = async (
  page = 1,
  limit = 10,
): Promise<WalletResponse<TransactionsResponse>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Fetch wallet transactions error:", error);
    return { success: false, message: "Network error fetching transactions" };
  }
};
