/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/vendors";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

/* ─── GET /api/vendors/orders ────────────────────────────────────────────── */

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

/* ─── PUT /api/vendors/orders/:orderId ───────────────────────────────────── */

export interface UpdateOrderPayload {
  status: "shipped" | "delivered";
  trackingNumber?: string;
  note?: string;
}

export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderPayload,
): Promise<OrderResponse<{ order: Order }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, message: "Network error updating order status" };
  }
};
