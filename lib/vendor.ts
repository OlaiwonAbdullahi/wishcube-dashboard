/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAuth } from "./auth";
import { Product } from "./products";

const API_BASE_URL = "https://api.usewishcube.com/api";

export interface Bank {
  id: number;
  name: string;
  code: string;
  slug: string;
}

export const getBanks = async (): Promise<{
  success: boolean;
  message: string;
  data?: { total: number; banks: Bank[] };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/general/banks`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch banks error:", error);
    return { success: false, message: "Network error fetching banks" };
  }
};

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
  userId: any;
  storeName: string;
  description: string;
  category: string;
  slug: string;
  logo?: string;
  rating: number;
  totalEarnings: number;
  deliveryZones: string[];
  bankDetails: {
    bankCode: string;
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

export const registerVendor = async (data: {
  ownerName: string;
  email: string;
  password: string;
  storeName: string;
  category: string;
  description?: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await response.json();

    return resData;
  } catch (error) {
    console.log("Vendor registration error:", error);
    return {
      success: false,
      message: "Network error during vendor registration",
    };
  }
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

// Update the currently authenticated vendor's profile
export const updateVendorProfile = async (
  payload: Partial<
    Pick<
      VendorApplication,
      "storeName" | "description" | "category" | "deliveryZones" | "bankDetails"
    >
  >,
): Promise<{
  success: boolean;
  message: string;
  data?: { vendor: Vendor };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/me`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Update vendor profile error:", error);
    return { success: false, message: "Network error updating vendor profile" };
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

// Resolve Bank Account
export const resolveAccount = async (
  accountNumber: string,
  bankCode: string,
): Promise<{
  success: boolean;
  message: string;
  data?: { account_number: string; account_name: string; bank_id: number };
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/general/resolve-account?accountNumber=${accountNumber}&bankCode=${bankCode}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Resolve account error:", error);
    return { success: false, message: "Network error resolving account" };
  }
};
