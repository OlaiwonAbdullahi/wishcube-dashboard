"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "http://localhost:5000/api";

export interface VendorApplication {
  storeName: string;
  description: string;
  category: string;
  deliveryZones: string[];
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
  };
}

const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

export const applyVendor = async (application: VendorApplication) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/apply`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(application),
    });
    return await response.json();
  } catch (error) {
    console.error("Vendor application error:", error);
    return { success: false, message: "Network error during vendor application" };
  }
};
