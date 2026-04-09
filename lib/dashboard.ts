"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/dashboard";

export interface DashboardOverviewResponse {
  success: boolean;
  message?: string;
  data?: {
    stats: {
      cardsCount: number;
      websitesCount: number;
      giftsCount: number;
      walletBalance: number;
    };
    recentWorks: {
      websites: {
        _id: string;
        recipientName: string;
        occasion: string;
        status: string;
        createdAt: string;
        theme: string;
      }[];
      cards: {
        _id: string;
        recipientName: string;
        occasion: string;
        status: string;
        createdAt: string;
        backgroundColor: string;
      }[];
    };
  };
}

const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

export const getDashboardOverview = async (): Promise<DashboardOverviewResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/overview`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch dashboard overview error:", error);
    return { success: false, message: "Network error fetching dashboard overview" };
  }
};
