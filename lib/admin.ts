"use client";

import { getAuth } from "./auth";

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
export const getAllUsers = async (): Promise<AdminResponse<{ total: number; users: any[] }>> => {
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
export const getAllVendors = async (status?: string): Promise<AdminResponse<{ total: number; vendors: any[] }>> => {
  try {
    const url = status ? `${API_BASE_URL}/vendors?status=${status}` : `${API_BASE_URL}/vendors`;
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

export const approveVendor = async (id: string): Promise<AdminResponse<any>> => {
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

export const rejectVendor = async (id: string, reason: string): Promise<AdminResponse<any>> => {
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
export const getWaitlist = async (): Promise<AdminResponse<{ total: number; waitlist: any[] }>> => {
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
