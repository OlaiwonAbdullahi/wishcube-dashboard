"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/products";

export interface Product {
  _id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  images: { url: string; publicId: string }[];
  category: string;
  occasionTags: string[];
  deliveryZones: string[];
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface ProductResponse<T> {
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

// Get all products with filters
export const getProducts = async (
  params?: Record<string, string>
): Promise<ProductResponse<{ total: number; products: Product[] }>> => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch products error:", error);
    return { success: false, message: "Network error fetching products" };
  }
};

// Get digital gifts
export const getDigitalGifts = async (): Promise<
  ProductResponse<{ products: Product[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/digital-gifts`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch digital gifts error:", error);
    return { success: false, message: "Network error fetching digital gifts" };
  }
};

// Get products by vendor ID
export const getProductsByVendorId = async (
  vendorId: string,
): Promise<ProductResponse<{ total: number; products: Product[] }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}?vendorId=${vendorId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch products by vendor error:", error);
    return {
      success: false,
      message: "Network error fetching vendor products",
    };
  }
};

// Get products for the current vendor (identifies by token)
export const getVendorProducts = async (): Promise<
  ProductResponse<{ total: number; products: Product[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch vendor products error:", error);
    return {
      success: false,
      message: "Network error fetching vendor products",
    };
  }
};

// Get a single product by ID
export const getProductById = async (
  id: string,
): Promise<ProductResponse<{ product: Product }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch product error:", error);
    return { success: false, message: "Network error fetching product" };
  }
};

// Create a new product
export const createProduct = async (
  productData: Partial<Product>,
): Promise<ProductResponse<{ product: Product }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    console.error("Create product error:", error);
    return { success: false, message: "Network error creating product" };
  }
};

// Update an existing product
export const updateProduct = async (
  id: string,
  productData: Partial<Product>,
): Promise<ProductResponse<{ product: Product }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, message: "Network error updating product" };
  }
};

// Delete a product
export const deleteProduct = async (
  id: string,
): Promise<ProductResponse<null>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, message: "Network error deleting product" };
  }
};

// Upload product images
export const uploadProductImages = async (
  files: File[],
): Promise<
  ProductResponse<{ images: { url: string; publicId: string }[] }>
> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const auth = getAuth();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth?.token || ""}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Upload product images error:", error);
    return { success: false, message: "Network error uploading images" };
  }
};

// Deprecated: Use uploadProductImages instead. Keeping it for compatibility if needed.
export const uploadProductImage = async (
  file: File,
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
