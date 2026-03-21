"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/orders";

export interface OrderItem {
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  _id: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
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

// Get orders for the current vendor
export const getVendorOrders = async (): Promise<
  OrderResponse<{ total: number; orders: Order[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor`, {
      method: "GET",
      headers: getHeaders(),
    });
    
    // Fallback to mock data if the API fails or is not yet implemented
    if (!response.ok) {
        return getMockOrders();
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fetch vendor orders error:", error);
    return getMockOrders();
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<OrderResponse<{ order: Order }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return await response.json();
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, message: "Network error updating order status" };
  }
};

// Mock data generator for development
const getMockOrders = (): OrderResponse<{ total: number; orders: Order[] }> => {
  const mockOrders: Order[] = [
    {
      _id: "ORD-001",
      vendorId: "VEND-001",
      customerId: "CUST-001",
      customerName: "Adebayo Tunde",
      customerEmail: "adebayo@example.com",
      items: [
        {
          _id: "ITEM-001",
          productId: "PROD-001",
          productName: "Gourmet Gift Basket",
          quantity: 1,
          price: 25000,
        },
      ],
      totalAmount: 25000,
      status: "pending",
      paymentStatus: "paid",
      shippingAddress: {
        street: "123 Lekki Phase 1",
        city: "Lagos",
        state: "Lagos",
        zipCode: "100001",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "ORD-002",
      vendorId: "VEND-001",
      customerId: "CUST-002",
      customerName: "Chinelo Okoro",
      customerEmail: "chinelo@example.com",
      items: [
        {
          _id: "ITEM-002",
          productId: "PROD-002",
          productName: "Artisanal Chocolate Box",
          quantity: 2,
          price: 15000,
        },
      ],
      totalAmount: 30000,
      status: "processing",
      paymentStatus: "paid",
      shippingAddress: {
        street: "45 Independence Layout",
        city: "Enugu",
        state: "Enugu",
        zipCode: "400001",
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: "ORD-003",
      vendorId: "VEND-001",
      customerId: "CUST-003",
      customerName: "Musa Ibrahim",
      customerEmail: "musa@example.com",
      items: [
        {
          _id: "ITEM-003",
          productId: "PROD-003",
          productName: "Luxury Spa Set",
          quantity: 1,
          price: 45000,
        },
      ],
      totalAmount: 45000,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: {
        street: "78 Maitama District",
        city: "Abuja",
        state: "FCT",
        zipCode: "900001",
      },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  return {
    success: true,
    message: "Fetched mock orders",
    data: {
      total: mockOrders.length,
      orders: mockOrders,
    },
  };
};
