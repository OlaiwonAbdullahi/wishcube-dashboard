"use client";

import { getAuth } from "./auth";
import { Product } from "./products";

const API_BASE_URL = "https://api.usewishcube.com/api";

export interface VendorApplication {
  storeName: string;
  description: string;
  category: string;
  deliveryZones: string[];
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  logo?: string;
}

export interface Vendor {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userId: any; // Populated user object
  storeName: string;
  description: string;
  category: string;
  slug: string;
  logo?: string;
  rating: number;
  totalEarnings: number;
  deliveryZones: string[];
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
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
    console.log("Vendor application error:", error);
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

    const response = await fetch(
      `${API_BASE_URL}/vendors?${queryParams.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Fetch vendors error:", error);
    return { success: false, message: "Network error fetching vendors" };
  }
};

// Get vendor by slug (Public)
export const getVendorBySlug = async (
  slug: string,
): Promise<{
  success: boolean;
  message: string;
  data?: { vendor: Vendor; products: Product[] };
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

// Get the currently authenticated vendor's profile
export const getMyVendorProfile = async (): Promise<{
  success: boolean;
  message: string;
  data?: { vendor: Vendor };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch my vendor profile error:", error);
    return { success: false, message: "Network error fetching vendor profile" };
  }
};

// Upload vendor logo
export const uploadVendorLogo = async (
  logo: File,
): Promise<{
  success: boolean;
  message: string;
  data?: { logo: string };
}> => {
  try {
    const formData = new FormData();
    formData.append("logo", logo);

    const auth = getAuth();
    const response = await fetch(`${API_BASE_URL}/vendors/logo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth?.token || ""}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Upload logo error:", error);
    return { success: false, message: "Network error uploading logo" };
  }
};
