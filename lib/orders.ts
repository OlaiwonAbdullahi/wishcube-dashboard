/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/vendors";

export interface ProductSnapshot {
  name: string;
  price: number;
  imageUrl?: string;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface StatusHistoryEntry {
  status: string;
  updatedAt: string;
  note?: string;
}

export type OrderStatus =
  | "processing"
  | "out_for_delivery"
  | "in_transit"
  | "awaiting_confirmation"
  | "delivered"
  | "disputed"
  | "cancelled";

export interface Order {
  customerName: string;
  customerId: any;
  _id: string;
  giftId: string;
  vendorId: string;
  productId: string;
  senderId: string;
  productSnapshot: ProductSnapshot;
  deliveryAddress: DeliveryAddress;
  trackingNumber?: string | null;
  status: OrderStatus;
  totalAmount: number;
  commissionAmount: number;
  vendorEarnings: number;
  vendorPaidOut: boolean;
  vendorPaidOutAt: string | null;
  statusHistory: StatusHistoryEntry[];
  autoConfirmAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse<T> {
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

export const getVendorOrders = async (
  status?: OrderStatus,
): Promise<OrderResponse<{ total: number; orders: Order[] }>> => {
  try {
    const url = new URL(`${API_BASE_URL}/orders`);
    if (status) url.searchParams.set("status", status);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch vendor orders error:", error);
    return { success: false, message: "Network error fetching orders" };
  }
};

export interface UpdateOrderPayload {
  status: "out_for_delivery" | "in_transit" | "awaiting_confirmation";
  trackingNumber?: string;
  note?: string;
}

export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderPayload,
): Promise<OrderResponse<{ order: Order }>> => {
  try {
    const response = await fetch(`https://api.usewishcube.com/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, message: "Network error updating order status" };
  }
};

export const confirmDeliveryVendor = async (
  orderId: string,
  code: string,
): Promise<OrderResponse<{ order: Order }>> => {
  try {
    const response = await fetch(`https://api.usewishcube.com/api/orders/${orderId}/confirm`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ code, confirmedBy: "vendor" }),
    });
    return await response.json();
  } catch (error) {
    console.error("Confirm delivery error:", error);
    return { success: false, message: "Network error confirming delivery" };
  }
};

export interface DashboardOverviewData {
  stats: {
    totalOrders: number;
    activeOrders: number;
    totalProducts: number;
    totalRevenue: number;
    totalEarnings: number;
  };
  recentOrders: Order[];
}

export const getVendorDashboardOverview = async (): Promise<
  OrderResponse<DashboardOverviewData>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch dashboard overview error:", error);
    return { success: false, message: "Network error fetching dashboard" };
  }
};

export interface AnalyticsData {
  ordersByStatus: Array<{ _id: string; count: number }>;
  revenueHistory: Array<{
    _id: { month: number; year: number };
    revenue: number;
    earnings: number;
    count: number;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    totalSales: number;
    unitsSold: number;
  }>;
}

export const getVendorAnalytics = async (): Promise<
  OrderResponse<AnalyticsData>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch analytics error:", error);
    return { success: false, message: "Network error fetching analytics" };
  }
};
