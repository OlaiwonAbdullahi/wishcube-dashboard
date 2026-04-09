"use client";

import { useState, useEffect } from "react";

export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY || "";

export function useGoogleFontsList() {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_KEY) {
      setLoading(false);
      return;
    }

    const fetchFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`,
        );
        if (!response.ok) throw new Error("Failed to fetch fonts");
        const data = await response.json();
        setFonts(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  return { fonts, loading, error };
}

/**
 * Loads a subset of a Google Font to preview it efficiently.
 */
export function useLoadFontPreview(fontFamily: string) {
  useEffect(() => {
    if (!fontFamily || fontFamily === "Inter") return;

    const id = `google-font-preview-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";

    // Efficiently load only the font family name as characters to minimize payload
    const textPreview = encodeURIComponent(fontFamily);
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      /\s+/g,
      "+",
    )}:wght@400&text=${textPreview}&display=swap`;

    document.head.appendChild(link);
  }, [fontFamily]);
}

export function useLoadSelectedFont(fontFamily: string) {
  useEffect(() => {
    if (!fontFamily || fontFamily === "Inter") return;

    const id = `google-font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      /\s+/g,
      "+",
    )}:wght@400;700&display=swap`;

    document.head.appendChild(link);

    return () => {
      // Optional: keep it to avoid flicker or remove if memory is a concern
      // document.head.removeChild(link);
    };
  }, [fontFamily]);
}

// Keep the old list as fallback or for initial render
export const FALLBACK_FONTS = [
  { family: "Inter" },
  { family: "Playfair Display" },
  { family: "Lora" },
  { family: "Poppins" },
  { family: "Merriweather" },
  { family: "Caveat" },
  { family: "Montserrat" },
  { family: "Roboto" },
];
