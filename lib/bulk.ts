"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/bulk";

export interface BulkUpload {
  _id?: string;
  userId?: string;
  bulk_id: string;
  occasion: string;
  total: number;
  status?: "pending" | "published";
  published_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkRecipient {
  _id?: string;
  bulkId?: string;
  row_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
  original_message?: string;
  ai_message?: string;
  gift?: {
    type: string;
    amount: number;
    currency: string;
    gift_id?: string;
  } | null;
  status: "pending" | "gift_attached" | "published";
  images?: { url: string; publicId: string }[];
  voiceMessageUrl?: string | null;
  voiceMessagePublicId?: string | null;
  wishcube_link?: string;
  websiteId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkStyleConfig {
  theme?: string;
  font?: string;
  layout?: "classic" | "modern";
  language?: string;
  aiTone?: string;
  expiresAt?: string;
  isPasswordProtected?: boolean;
  password?: string;
}

export interface BulkResponse<T> {
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

const getFormDataHeaders = () => {
  const auth = getAuth();
  return {
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

// Download Excel template
export const downloadTemplate = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/template`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to download template");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wishcube_bulk_template.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error("Template download error:", error);
    throw error;
  }
};

// Upload Excel for processing
// Handles both legacy {success, data:{upload,preview}} and new flat {bulk_id, occasion, total, recipients} shapes
export const uploadBulkFile = async (
  file: File,
  occasion: string,
): Promise<BulkResponse<{ upload: BulkUpload; preview: BulkRecipient[] }>> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("occasion", occasion);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: getFormDataHeaders(),
      body: formData,
    });

    const json = await response.json();

    // New flat API shape: { bulk_id, occasion, total, recipients: [...] }
    if (json.bulk_id && Array.isArray(json.recipients)) {
      const { recipients, ...uploadInfo } = json as {
        bulk_id: string;
        occasion: string;
        total: number;
        recipients: BulkRecipient[];
        [key: string]: unknown;
      };
      return {
        success: true,
        message: "Uploaded and processed successfully",
        data: {
          upload: uploadInfo as BulkUpload,
          preview: recipients,
        },
      };
    }

    // Legacy wrapped shape: { success, message, data: { upload, preview } }
    if ("success" in json) {
      return json as BulkResponse<{
        upload: BulkUpload;
        preview: BulkRecipient[];
      }>;
    }

    // Error shape returned by the API
    if (json.message) {
      return { success: false, message: json.message };
    }

    return {
      success: false,
      message: "Unexpected response format from server",
    };
  } catch (error) {
    console.error("Bulk upload error:", error);
    return { success: false, message: "Network error uploading bulk file" };
  }
};

// Attach gift to a single recipient
export const attachGiftToRecipient = async (
  bulkId: string,
  rowId: string,
  giftData: {
    type: string;
    amount: number;
    currency: string;
    gift_id?: string;
  },
): Promise<BulkResponse<{ recipient: BulkRecipient }>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${bulkId}/recipient/${rowId}/gift`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(giftData),
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Attach gift error:", error);
    return { success: false, message: "Network error attaching gift" };
  }
};

// Attach images and voice message to a single recipient
export const attachAssetsToRecipient = async (
  bulkId: string,
  rowId: string,
  assetData: {
    images?: { url: string; publicId: string }[];
    voiceMessageUrl?: string | null;
    voiceMessagePublicId?: string | null;
  },
): Promise<BulkResponse<{ recipient: BulkRecipient }>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${bulkId}/recipient/${rowId}/assets`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(assetData),
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Attach assets error:", error);
    return { success: false, message: "Network error attaching assets" };
  }
};

// Update individual recipient message
export const updateRecipientMessage = async (
  bulkId: string,
  rowId: string,
  ai_message: string,
): Promise<BulkResponse<{ recipient: BulkRecipient }>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${bulkId}/recipient/${rowId}/message`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ ai_message }),
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Update message error:", error);
    return { success: false, message: "Network error updating message" };
  }
};

// Regenerate AI message for a recipient
export const regenerateRecipientMessage = async (
  bulkId: string,
  rowId: string,
  aiTone?: string,
  language?: string,
): Promise<BulkResponse<{ recipient: BulkRecipient }>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${bulkId}/recipient/${rowId}/regenerate`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ aiTone, language }),
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Regenerate message error:", error);
    return { success: false, message: "Network error regenerating message" };
  }
};

// Get summary of the batch
export const getBulkSummary = async (
  bulkId: string,
): Promise<
  BulkResponse<{
    bulk_id: string;
    total: number;
    gift_attached: number;
    pending: number;
    ai_generation_status: "pending" | "completed" | "failed";
    ready_to_publish: boolean;
  }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${bulkId}/summary`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch summary error:", error);
    return { success: false, message: "Network error fetching bulk summary" };
  }
};

// Publish the bulk generation, optionally with global style config
export const publishBulk = async (
  bulkId: string,
  styleConfig?: BulkStyleConfig,
): Promise<BulkResponse<null>> => {
  try {
    const body = styleConfig ? JSON.stringify(styleConfig) : undefined;
    const response = await fetch(`${API_BASE_URL}/${bulkId}/publish`, {
      method: "POST",
      headers: getHeaders(),
      body,
    });
    return await response.json();
  } catch (error) {
    console.error("Publish bulk error:", error);
    return { success: false, message: "Network error publishing bulk" };
  }
};

// Export created links
export const exportBulkLinks = async (bulkId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${bulkId}/export`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to download export");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wishcube_bulk_${bulkId}_links.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error("Export download error:", error);
    throw error;
  }
};
