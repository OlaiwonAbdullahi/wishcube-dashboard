"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/cards";

export interface Card {
  _id: string;
  userId: string;
  senderName: string;
  recipientName: string;
  recipientPhotoUrl?: string;
  recipientPhotoPublicId?: string;
  relationship?: string;
  occasion: string;
  language?: string;
  volumeNumber?: number;
  cardYear?: string;
  cardSubtitle?: string;
  message: string;
  closingLine?: string;
  brandingText?: string;
  isAiGenerated?: boolean;
  aiTone?: string;
  theme?: string;
  orientation?: "portrait" | "landscape" | "square";
  backgroundImageUrl?: string;
  backgroundImagePublicId?: string;
  backgroundColor: string;
  font: string;
  accentColor?: string;
  textColor: string;
  textSize: "small" | "medium" | "large";
  textBold?: boolean;
  textItalic?: boolean;
  textAlign?: "left" | "center" | "right";
  headlineColor?: string;
  headlineSizeOverride?: "small" | "medium" | "large" | null;
  headlineBold?: boolean;
  recipientNameColor?: string;
  recipientNameItalic?: boolean;
  status: "draft" | "completed";
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardResponse<T> {
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

// Get all cards for the current user
export const getCards = async (): Promise<
  CardResponse<{ total: number; cards: Card[] }>
> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch cards error:", error);
    return { success: false, message: "Network error fetching cards" };
  }
};

// Get a single card by ID
export const getCardById = async (
  id: string,
): Promise<CardResponse<{ card: Card }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch card error:", error);
    return { success: false, message: "Network error fetching card" };
  }
};

// Create a new card
export const createCard = async (
  cardData: Partial<Card>,
): Promise<CardResponse<{ card: Card }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cardData),
    });
    return await response.json();
  } catch (error) {
    console.error("Create card error:", error);
    return { success: false, message: "Network error creating card" };
  }
};

// Update an existing card
export const updateCard = async (
  id: string,
  cardData: Partial<Card>,
): Promise<CardResponse<{ card: Card }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(cardData),
    });
    return await response.json();
  } catch (error) {
    console.error("Update card error:", error);
    return { success: false, message: "Network error updating card" };
  }
};

// Delete a card
export const deleteCard = async (id: string): Promise<CardResponse<null>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Delete card error:", error);
    return { success: false, message: "Network error deleting card" };
  }
};

// Generate AI suggestions
export const generateAiMessage = async (payload: {
  recipientName: string;
  occasion: string;
  senderName?: string;
  relationship?: string;
  language?: string;
  tone?: string;
}): Promise<CardResponse<{ suggestions: string[] }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Generate AI message error:", error);
    return { success: false, message: "Network error generating message" };
  }
};
