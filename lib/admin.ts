/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAuth } from "./auth";
import { ProductResponse } from "./products";

const API_BASE_URL = "http://localhost:5000/api";

export interface AdminResponse<T> {
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

// User Management
export const getAllUsers = async (): Promise<
  AdminResponse<{ total: number; users: any[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch users error:", error);
    return { success: false, message: "Network error fetching users" };
  }
};

// Vendor Management
export const getAllVendors = async (
  status?: string
): Promise<AdminResponse<{ total: number; vendors: any[] }>> => {
  try {
    const url = status
      ? `${API_BASE_URL}/vendors?status=${status}`
      : `${API_BASE_URL}/vendors`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch vendors error:", error);
    return { success: false, message: "Network error fetching vendors" };
  }
};

export const approveVendor = async (
  id: string
): Promise<AdminResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}/approve`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Approve vendor error:", error);
    return { success: false, message: "Network error approving vendor" };
  }
};

export const rejectVendor = async (
  id: string,
  reason: string
): Promise<AdminResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}/reject`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return await response.json();
  } catch (error) {
    console.error("Reject vendor error:", error);
    return { success: false, message: "Network error rejecting vendor" };
  }
};

// Waitlist Management
export const getWaitlist = async (): Promise<
  AdminResponse<{ total: number; waitlist: any[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/waitlist`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch waitlist error:", error);
    return { success: false, message: "Network error fetching waitlist" };
  }
};

// Digital Gift Management
export interface DigitalGiftData {
  name: string;
  price: number;
  description: string;
  images: { url: string; publicId: string }[];
}

export const createDigitalGift = async (
  data: DigitalGiftData
): Promise<AdminResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/digital-gifts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ...data,
        category: "Vouchers",
        stock: "Infinity",
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Create digital gift error:", error);
    return { success: false, message: "Network error creating digital gift" };
  }
};

export const getDigitalGifts = async (): Promise<
  AdminResponse<{ total: number; products: any[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/digital-gifts`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch digital gifts error:", error);
    return { success: false, message: "Network error fetching digital gifts" };
  }
};

export const deleteDigitalGift = async (
  id: string
): Promise<AdminResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/digital-gifts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Delete digital gift error:", error);
    return { success: false, message: "Network error deleting digital gift" };
  }
};

// Admin Image Upload

export const uploadProductImages = async (
  files: File[]
): Promise<
  ProductResponse<{ images: { url: string; publicId: string }[] }>
> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const auth = getAuth();
    // Corrected URL: removed extra /api prefix as API_BASE_URL already includes it
    const response = await fetch(`${API_BASE_URL}/products/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth?.token || ""}`,
      },
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Upload product images error:", error);
    return { success: false, message: "Network error uploading images" };
  }
};

// Deprecated: Use uploadProductImages instead. Keeping it for compatibility if needed.
export const uploadProductImage = async (
  file: File
): Promise<ProductResponse<{ url: string; publicId: string }>> => {
  const response = await uploadProductImages([file]);
  if (response.success && response.data && response.data.images.length > 0) {
    return {
      success: true,
      message: response.message,
      data: response.data.images[0],
    };
  }
  return {
    success: false,
    message: response.message || "Upload failed",
  };
};
