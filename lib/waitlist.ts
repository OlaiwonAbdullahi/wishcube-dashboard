"use client";

const API_BASE_URL = "https://api.usewishcube.com/api/waitlist";

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

// Join the waitlist (Public). Treats "already signed up" as a success too,
// since from the user's perspective their interest is already on record.
export const joinWaitlist = async (
  name: string,
  email: string,
): Promise<WaitlistResponse> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    if (data.success || /already exists/i.test(data.message || "")) {
      return { success: true, message: "You're on the list!" };
    }
    return { success: false, message: data.message || "Failed to join the waitlist" };
  } catch (error) {
    console.error("Join waitlist error:", error);
    return { success: false, message: "Network error joining the waitlist" };
  }
};
