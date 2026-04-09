import { Card } from "@/lib/cards";

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  occasion: string;
  preview: Partial<Card>;
}

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "elegant-modern",
    name: "Elegant Modern",
    description: "Clean, minimalist design with sophisticated typography",
    occasion: "Birthday",
    preview: {
      backgroundColor: "#FFFFFF",
      textColor: "#1a1a1a",
      accentColor: "#191A23",
      font: "Inter",
      theme: "modern",
      orientation: "portrait",
      textSize: "medium",
      textAlign: "center",
      headlineColor: "#191A23",
      headlineBold: true,
      recipientNameColor: "#191A23",
      recipientNameItalic: false,
    },
  },
  {
    id: "warm-classic",
    name: "Warm Classic",
    description: "Traditional design with warm, inviting colors",
    occasion: "Birthday",
    preview: {
      backgroundColor: "#FFF5F0",
      textColor: "#3D2817",
      accentColor: "#D4A574",
      font: "Georgia",
      theme: "classic",
      orientation: "portrait",
      textSize: "medium",
      textAlign: "center",
      headlineColor: "#8B4513",
      headlineBold: true,
      recipientNameColor: "#D4A574",
      recipientNameItalic: true,
    },
  },
  {
    id: "vibrant-playful",
    name: "Vibrant Playful",
    description: "Colorful and fun design perfect for celebrations",
    occasion: "Birthday",
    preview: {
      backgroundColor: "#FFF9E6",
      textColor: "#FF1493",
      accentColor: "#FFD700",
      font: "Comic Sans MS",
      theme: "fun",
      orientation: "portrait",
      textSize: "large",
      textAlign: "center",
      headlineColor: "#FF1493",
      headlineBold: true,
      recipientNameColor: "#FFD700",
      recipientNameItalic: false,
    },
  },
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    description: "Premium design with gold accents and elegant styling",
    occasion: "Wedding",
    preview: {
      backgroundColor: "#1C1C1C",
      textColor: "#E5D4C1",
      accentColor: "#C9A84C",
      font: "Playfair Display",
      theme: "luxury",
      orientation: "portrait",
      textSize: "large",
      textAlign: "center",
      headlineColor: "#C9A84C",
      headlineBold: true,
      recipientNameColor: "#C9A84C",
      recipientNameItalic: true,
    },
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    description: "Gentle, soothing colors with a modern touch",
    occasion: "Thank You",
    preview: {
      backgroundColor: "#F3E5F5",
      textColor: "#5E35B1",
      accentColor: "#B39DDB",
      font: "Quicksand",
      theme: "soft",
      orientation: "portrait",
      textSize: "medium",
      textAlign: "center",
      headlineColor: "#7E57C2",
      headlineBold: true,
      recipientNameColor: "#B39DDB",
      recipientNameItalic: false,
    },
  },
  {
    id: "professional-blue",
    name: "Professional Blue",
    description: "Business-appropriate design with trust-building colors",
    occasion: "Congratulations",
    preview: {
      backgroundColor: "#F0F4F8",
      textColor: "#1E3A5F",
      accentColor: "#2E5090",
      font: "Roboto",
      theme: "professional",
      orientation: "portrait",
      textSize: "medium",
      textAlign: "left",
      headlineColor: "#1E3A5F",
      headlineBold: true,
      recipientNameColor: "#2E5090",
      recipientNameItalic: false,
    },
  },
  {
    id: "festive-red",
    name: "Festive Red",
    description: "Bold and celebratory design for special moments",
    occasion: "Holiday",
    preview: {
      backgroundColor: "#FFFAF0",
      textColor: "#8B0000",
      accentColor: "#DC143C",
      font: "Fredoka",
      theme: "festive",
      orientation: "portrait",
      textSize: "large",
      textAlign: "center",
      headlineColor: "#8B0000",
      headlineBold: true,
      recipientNameColor: "#DC143C",
      recipientNameItalic: false,
    },
  },
  {
    id: "nature-green",
    name: "Nature Green",
    description: "Eco-friendly design with natural, calming aesthetics",
    occasion: "Congratulations",
    preview: {
      backgroundColor: "#F1F8F4",
      textColor: "#1B5E20",
      accentColor: "#4CAF50",
      font: "Poppins",
      theme: "natural",
      orientation: "portrait",
      textSize: "medium",
      textAlign: "center",
      headlineColor: "#2E7D32",
      headlineBold: true,
      recipientNameColor: "#4CAF50",
      recipientNameItalic: false,
    },
  },
];

export const getTemplatesByOccasion = (occasion: string): CardTemplate[] => {
  return CARD_TEMPLATES.filter(
    (t) =>
      t.occasion === occasion ||
      occasion.toLowerCase().includes(t.occasion.toLowerCase()),
  );
};

export const getAllOccasions = (): string[] => {
  return Array.from(new Set(CARD_TEMPLATES.map((t) => t.occasion)));
};
