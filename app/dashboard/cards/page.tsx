"use client";

import { useState } from "react";
import { CardPreview } from "./_components/card-preview";
import { CardCustomizer } from "./_components/card-customizer";
import { useLoadSelectedFont } from "./_components/use-google-fonts";

export interface CardTemplate {
  id: string;
  name: string;
  occasion: string;
  colors: string[];
  defaultText: {
    title: string;
    message: string;
  };
}

export interface CardState {
  templateId: string;
  userName: string;
  recipientName: string;
  occasion: string;
  title: string;
  message: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontSize: number;
  fontFamily: string;
}

export default function CardsPage() {
  const [cardState, setCardState] = useState<CardState>({
    templateId: "birthday",
    userName: "404 dev",
    recipientName: "Abdullahi",
    occasion: "Birthday",
    title: "Happy Birthday! 🎉",
    message:
      "Wishing you a wonderful day filled with joy and celebration! On your special day, we're celebrating the incredible person you are - kind, generous, and full of life.",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    accentColor: "#EAB308",
    fontSize: 14,
    fontFamily: "Inter",
  });

  useLoadSelectedFont(cardState.fontFamily);

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#191A23]">
            Greeting Card Generator
          </h1>
          <p className="text-sm text-neutral-600 max-w-2xl">
            Create beautiful, personalized greeting cards for any occasion.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Customizer */}
        <div className="lg:col-span-1">
          <CardCustomizer cardState={cardState} setCardState={setCardState} />
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-2">
          <CardPreview cardState={cardState} />
        </div>
      </div>
    </div>
  );
}
