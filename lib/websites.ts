/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/websites";

export interface WebsiteImage {
  url: string;
  publicId: string;
  order: number;
}

export interface WebsiteData {
  recipientName: string;
  occasion: string;
  relationship: string;
  language: string;
  message: string;
  isAiGenerated: boolean;
  aiTone?: string;
  images: WebsiteImage[];
  videoUrl?: string | null;
  videoPublicId?: string | null;
  voiceMessageUrl?: string | null;
  voiceMessagePublicId?: string | null;
  musicTrack?: string;
  musicUrl?: string;
  theme: string;
  font: string;
  primaryColor: string;
  countdownDate: string;
  isPasswordProtected: boolean;
  password?: string | null;
  customSlug?: string;
  expiresAt: string;
}

export interface WebsiteResponse<T> {
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

// Get all websites for the current user
export const getWebsites = async (): Promise<
  WebsiteResponse<{ total: number; websites: any[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch websites error:", error);
    return { success: false, message: "Network error fetching websites" };
  }
};

// Create a website
export const createWebsite = async (
  websiteData: WebsiteData,
): Promise<WebsiteResponse<{ website: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(websiteData),
    });
    return await response.json();
  } catch (error) {
    console.error("Create website error:", error);
    return { success: false, message: "Network error creating website" };
  }
};

// Publish a website
export const publishWebsite = async (
  id: string,
  publishData: { customSlug: string; expiresAt: string },
): Promise<WebsiteResponse<{ website: any; shareUrl: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/publish`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(publishData),
    });
    return await response.json();
  } catch (error) {
    console.error("Publish website error:", error);
    return { success: false, message: "Network error publishing website" };
  }
};

// Upload website images
export const uploadWebsiteImages = async (
  files: File[],
): Promise<
  WebsiteResponse<{ images: { url: string; publicId: string }[] }>
> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const auth = getAuth();
    // Using the confirmed working products upload endpoint as a general purpose upload
    const response = await fetch(
      "https://api.usewishcube.com/api/products/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.token || ""}`,
        },
        body: formData,
      },
    );

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Non-JSON response from server:", errorText);
      return {
        success: false,
        message: `Server returned an invalid response (HTTP ${response.status})`,
      };
    }
  } catch (error) {
    console.error("Upload website images error:", error);
    return { success: false, message: "Network error uploading images" };
  }
};

// Get a single website by ID
export const getWebsite = async (
  id: string,
): Promise<WebsiteResponse<{ website: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Get website error:", error);
    return { success: false, message: "Network error fetching website" };
  }
};

// Update a website
export const updateWebsite = async (
  id: string,
  data: Partial<WebsiteData>,
): Promise<WebsiteResponse<{ website: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Update website error:", error);
    return { success: false, message: "Network error updating website" };
  }
};

// Delete a website
export const deleteWebsite = async (
  id: string,
): Promise<WebsiteResponse<null>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Delete website error:", error);
    return { success: false, message: "Network error deleting website" };
  }
};

// Get live website (Public)
export const getLiveWebsite = async (
  slug: string,
): Promise<WebsiteResponse<{ website: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/live/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get live website error:", error);
    return { success: false, message: "Network error fetching live website" };
  }
};

// Submit reaction
export const submitReaction = async (
  slug: string,
  emoji: string,
): Promise<WebsiteResponse<{ reaction: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/live/${slug}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    return await response.json();
  } catch (error) {
    console.error("Submit reaction error:", error);
    return { success: false, message: "Network error submitting reaction" };
  }
};

// Submit reply
export const submitReply = async (
  slug: string,
  message: string,
): Promise<WebsiteResponse<{ recipientReply: any }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/live/${slug}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return await response.json();
  } catch (error) {
    console.error("Submit reply error:", error);
    return { success: false, message: "Network error submitting reply" };
  }
};
