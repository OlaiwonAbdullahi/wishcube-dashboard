/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  RocketIcon,
  Copy01Icon,
  MusicNote01Icon,
  GiftIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Theme } from "./website-form";
import { cn } from "@/lib/utils";

interface WebsitePreviewProps {
  selectedTheme: Theme;
  selectedFont: string;
  occasion: string;
  recipientName: string;
  images: { url: string; publicId: string }[];
  message: string;
  customMessage: string;
  selectedMusic: any | null;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  copyGreetingLink: () => void;
  handlePublish: () => void;
  isPublishing: boolean;
  isCreating?: boolean;
}

// Map theme primary class → actual hex for inline styles
const THEME_HEX: Record<string, string> = {
  "bg-blue-600": "#2563eb",
  "bg-gray-700": "#374151",
  "bg-emerald-600": "#059669",
  "bg-purple-600": "#9333ea",
  "bg-red-800": "#991b1b",
  "bg-teal-600": "#0d9488",
  "bg-amber-600": "#d97706",
  "bg-indigo-600": "#4f46e5",
};

const THEME_NEUTRAL_HEX: Record<string, string> = {
  "bg-gray-50": "#f9fafb",
  "bg-gray-100": "#f3f4f6",
  "bg-white": "#ffffff",
};

export default function WebsitePreview({
  selectedTheme,
  selectedFont,
  occasion,
  recipientName,
  images,
  message,
  customMessage,
  selectedMusic,
  copyGreetingLink,
  handlePublish,
  isPublishing,
  isCreating,
}: WebsitePreviewProps) {
  const displayMessage = customMessage || message;
  const primaryHex = THEME_HEX[selectedTheme.primary] ?? "#6366f1";
  const bgHex = THEME_NEUTRAL_HEX[selectedTheme.bgNeutral] ?? "#f9fafb";

  return (
    <div className="flex flex-col gap-6">
      {/* Phone Frame */}
      <div className="mx-auto w-full max-w-[320px]">
        {/* Device chrome */}
        <div className="relative bg-[#191A23] rounded-[2.5rem] p-3 shadow-[0_40px_80px_rgba(25,26,35,0.4)]">
          {/* Top notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#191A23] rounded-full z-20" />

          {/* Screen */}
          <div
            className="relative rounded-[2rem] overflow-hidden"
            style={{ height: 580, background: bgHex }}
          >
            {/* Scrollable content */}
            <div
              className="absolute inset-0 overflow-y-auto"
              style={{ fontFamily: selectedFont }}
            >
              {/* Header bar with accent color */}
              <div
                className="relative px-5 pt-10 pb-5"
                style={{ background: primaryHex }}
              >
                {/* Occasion badge */}
                {occasion && (
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                    <HugeiconsIcon
                      icon={SparklesIcon}
                      size={10}
                      color="white"
                    />
                    <span
                      className="text-[9px] font-black uppercase tracking-widest text-white"
                    >
                      {occasion}
                    </span>
                  </div>
                )}
                {/* Recipient name */}
                <h1
                  className="text-2xl font-black text-white leading-tight"
                  style={{ fontFamily: selectedFont }}
                >
                  {recipientName ? `Hey, ${recipientName}! 🎉` : "Hey there! 🎉"}
                </h1>
                <div className="mt-1 flex items-center gap-1 opacity-70">
                  <HugeiconsIcon icon={RocketIcon} size={10} color="white" />
                  <span className="text-[9px] text-white font-medium">WishCube</span>
                </div>

                {/* Curved bottom */}
                <div
                  className="absolute -bottom-3 left-0 right-0 h-6 rounded-t-[50%]"
                  style={{ background: bgHex }}
                />
              </div>

              {/* Hero image */}
              {images.length > 0 ? (
                <div className="px-5 mt-5">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#191A23]/10 shadow-md aspect-[4/3]">
                    <img
                      src={images[0].url}
                      alt="Greeting"
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-[#191A23]/70 text-white rounded-full px-2 py-0.5 text-[8px] font-black">
                        +{images.length - 1}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mx-5 mt-5 h-28 rounded-2xl border-2 border-dashed border-[#191A23]/10 flex items-center justify-center">
                  <p className="text-[9px] text-[#191A23]/30 font-bold uppercase">
                    No images added
                  </p>
                </div>
              )}

              {/* Message */}
              {displayMessage ? (
                <div className="mx-5 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-[#191A23]/5">
                  <p
                    className="text-xs text-[#191A23] leading-relaxed"
                    style={{ fontFamily: selectedFont }}
                  >
                    {displayMessage}
                  </p>
                </div>
              ) : (
                <div className="mx-5 mt-4 p-4 bg-white/60 rounded-2xl border border-dashed border-[#191A23]/10">
                  <p className="text-[9px] text-[#191A23]/30 font-bold uppercase text-center">
                    Message will appear here
                  </p>
                </div>
              )}

              {/* Music player */}
              {selectedMusic && (
                <div className="mx-5 mt-3">
                  <div className="p-3 bg-white rounded-xl border border-[#191A23]/10 shadow-sm flex items-center gap-3">
                    <img
                      src={selectedMusic.cover}
                      alt={selectedMusic.title}
                      className="size-8 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-[#191A23] truncate">
                        {selectedMusic.title}
                      </p>
                      <p className="text-[8px] text-neutral-400 truncate">
                        {selectedMusic.artist}
                      </p>
                    </div>
                    <div
                      className="size-6 rounded-full flex items-center justify-center"
                      style={{ background: primaryHex }}
                    >
                      <HugeiconsIcon
                        icon={MusicNote01Icon}
                        size={10}
                        color="white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Gift placeholder */}
              <div className="mx-5 mt-3 mb-3">
                <div
                  className="p-3 rounded-xl flex items-center gap-3"
                  style={{ background: primaryHex + "18" }}
                >
                  <div
                    className="size-8 rounded-xl flex items-center justify-center"
                    style={{ background: primaryHex }}
                  >
                    <HugeiconsIcon icon={GiftIcon} size={14} color="white" />
                  </div>
                  <div>
                    <p
                      className="text-[9px] font-black uppercase"
                      style={{ color: primaryHex }}
                    >
                      Special Gift Attached
                    </p>
                    <p className="text-[8px] text-neutral-400">
                      Tap to redeem
                    </p>
                  </div>
                </div>
              </div>

              {/* Emoji reactions */}
              <div className="mx-5 mt-3 flex justify-center gap-2 pb-6">
                {["❤️", "🎉", "🔥", "🥹", "🙌"].map((e) => (
                  <div
                    key={e}
                    className="size-8 bg-white rounded-xl flex items-center justify-center text-sm shadow-sm border border-[#191A23]/5"
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Status bar overlay */}
            <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none" />
          </div>

          {/* Home indicator */}
          <div className="flex justify-center mt-2">
            <div className="w-24 h-1 bg-white/30 rounded-full" />
          </div>
        </div>

        {/* Theme label */}
        <p className="text-center text-[10px] font-bold uppercase text-neutral-400 mt-3 tracking-widest">
          {selectedTheme.name} · {selectedFont}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={copyGreetingLink}
          disabled={isCreating}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 text-sm font-black uppercase tracking-widest rounded-sm border-2 border-[#191A23] transition-all",
            isCreating
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-white text-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1",
          )}
        >
          <HugeiconsIcon icon={Copy01Icon} size={16} />
          {isCreating ? "Saving Draft..." : "Save & Copy Draft Link"}
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 text-sm font-black uppercase tracking-widest rounded-sm border-2 border-[#191A23] transition-all",
            isPublishing
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-[#FFF3B0] text-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1",
          )}
        >
          <HugeiconsIcon icon={RocketIcon} size={16} />
          {isPublishing ? "Publishing..." : "Publish Live 🚀"}
        </button>
      </div>

      {/* Watermark */}
      <div className="flex items-center justify-center gap-1.5 opacity-40">
        <HugeiconsIcon icon={RocketIcon} size={12} />
        <span className="text-[9px] font-black uppercase tracking-widest text-[#191A23]">
          Made with WishCube
        </span>
      </div>
    </div>
  );
}
