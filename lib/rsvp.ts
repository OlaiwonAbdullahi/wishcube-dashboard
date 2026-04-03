"use client";
import { getAuth } from "./auth";
const API_BASE_URL = "https://api.usewishcube.com/api/rsvp";

export interface RSVP {
  id: string;
  occasion: "Birthday" | "Wedding" | "House Warming";
  message: string;
  images: {
    url: string;
    publicId: string;
    order: number;
  }[];
  font: string;
  color: string;
  publicUrl: string | null;
  views: number;
  createdAt: Date;
  venueName: string;
  venueAddress: string;
  occasionDate: Date;
  startTime: string;
  endTime: string;
  schedule: [
    {
      title: string;
      duration: string;
      description: string;
    },
  ];
  colorCode: string;
  heroTitle: string;
  heroParagraph: string;
  ScheduleTitle: string;
  accentColor: string;
  messageTitle: string;
}

export interface RsvpResponse<T> {
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

export const getRSVPs = async (): Promise<
  RsvpResponse<{ total: number; rsvp: RSVP[] }>
> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch RSVPs error:", error);
    return { success: false, message: "Network error fetching RSVPs" };
  }
};

export const createRSVP = async (
  rsvp: RSVP,
): Promise<RsvpResponse<{ total: number; rsvp: RSVP[] }>> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(rsvp),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch RSVPs error:", error);
    return { success: false, message: "Network error fetching RSVPs" };
  }
};
export const publishRSVP = async (
  id: string,
): Promise<RsvpResponse<{ total: number; rsvp: RSVP[] }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/publish`, {
      method: "POST",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch RSVPs error:", error);
    return { success: false, message: "Network error fetching RSVPs" };
  }
};
