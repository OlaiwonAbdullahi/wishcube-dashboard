"use client";

import { getAuth } from "./auth";

const API_BASE_URL = "https://api.usewishcube.com/api/rsvp";

export type RsvpOccasion = "Birthday" | "Wedding" | "House Warming";

export interface RsvpAttendee {
  name: string;
  email: string;
  response: "yes" | "no" | "maybe";
  plusOnes: number;
  message: string;
  respondedAt: string;
}

export interface Rsvp {
  _id: string;
  userId?: string;
  occasion: RsvpOccasion;
  message?: string;
  venueName?: string;
  venueAddress?: string;
  occasionDate?: string;
  startTime?: string;
  endTime?: string;
  accentColor?: string;
  slug?: string;
  publicUrl?: string | null;
  views?: number;
  status: "draft" | "live" | "archived" | "expired";
  attendees?: RsvpAttendee[];
  createdAt?: string;
}

export interface RsvpCreateData {
  occasion: RsvpOccasion;
  message: string;
  venueName: string;
  venueAddress: string;
  occasionDate: string;
  startTime: string;
  endTime: string;
  accentColor: string;
}

export interface RsvpResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  // Real HTTP status code (the JSON body's own "status" field is just the
  // string "fail"/"error", not useful for distinguishing e.g. 410 vs 404).
  httpStatus?: number;
}

const getHeaders = () => {
  const auth = getAuth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token || ""}`,
  };
};

export const getRsvps = async (): Promise<
  RsvpResponse<{ total: number; rsvps: Rsvp[] }>
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

export const createRsvp = async (
  data: RsvpCreateData,
): Promise<RsvpResponse<{ rsvp: Rsvp }>> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Create RSVP error:", error);
    return { success: false, message: "Network error creating RSVP" };
  }
};

export const publishRsvp = async (
  id: string,
): Promise<RsvpResponse<{ rsvp: Rsvp; shareUrl: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/publish`, {
      method: "POST",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Publish RSVP error:", error);
    return { success: false, message: "Network error publishing RSVP" };
  }
};

export const deleteRsvp = async (id: string): Promise<RsvpResponse<null>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Delete RSVP error:", error);
    return { success: false, message: "Network error deleting RSVP" };
  }
};

// Get live RSVP page (Public)
export const getLiveRsvp = async (
  slug: string,
): Promise<RsvpResponse<{ rsvp: Rsvp }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/live/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    return { ...json, httpStatus: response.status };
  } catch (error) {
    console.error("Get live RSVP error:", error);
    return { success: false, message: "Network error fetching RSVP page" };
  }
};

// Submit a guest response (Public)
export const submitRsvpResponse = async (
  slug: string,
  data: {
    name: string;
    email: string;
    response: "yes" | "no" | "maybe";
    plusOnes: number;
    message: string;
  },
): Promise<RsvpResponse<{ response: RsvpAttendee }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/live/${slug}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Submit RSVP response error:", error);
    return { success: false, message: "Network error submitting your response" };
  }
};
