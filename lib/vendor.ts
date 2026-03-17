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

export interface Vendor {
  _id: string;
  storeName: string;
  description: string;
  category: string;
  slug: string;
  logo?: string;
  rating: number;
  deliveryZones: string[];
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
  };
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
}

const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

// Apply to be a vendor
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
    return {
      success: false,
      message: "Network error during vendor application",
    };
  }
};

// Get all vendors (Public)
export const getAllVendors = async (params?: {
  category?: string;
  search?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: { total: number; vendors: Vendor[] };
}> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);

    const response = await fetch(`${API_BASE_URL}/vendors?${queryParams.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch vendors error:", error);
    return { success: false, message: "Network error fetching vendors" };
  }
};

// Get vendor by slug (Public)
export const getVendorBySlug = async (slug: string): Promise<{
  success: boolean;
  message: string;
  data?: { vendor: Vendor };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/store/${slug}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch vendor error:", error);
    return { success: false, message: "Network error fetching vendor" };
  }
};
