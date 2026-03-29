/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  ClipboardIcon,
  CloudUploadIcon,
  AiImageIcon,
  MagicWand01Icon,
  GiftIcon,
} from "@hugeicons/core-free-icons";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import GiftSelector from "./gift";
import Music from "./music";
import VoiceMessage from "./voiceMessage";
import { FALLBACK_FONTS, useLoadFontPreview } from "@/lib/use-google-fonts";

export interface Theme {
  name: string;
  hex: string;       // actual CSS hex for primaryColor payload
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  bgNeutral: string;
  textNeutral: string;
  bgAccent?: string;
  hoverAccent?: string;
}

export interface Occasion {
  value: string;
  label: string;
}

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  bgColor: string;
}

export const THEMES: Theme[] = [
  {
    name: "corporate-blue",
    hex: "#2563EB",
    primary: "bg-blue-600",
    secondary: "bg-blue-800",
    textPrimary: "text-blue-600",
    textSecondary: "text-blue-800",
    bgNeutral: "bg-gray-50",
    textNeutral: "text-gray-50",
    bgAccent: "bg-blue-100",
    hoverAccent: "hover:bg-blue-100",
  },
  {
    name: "elegant-charcoal",
    hex: "#374151",
    primary: "bg-gray-700",
    secondary: "bg-gray-900",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-900",
    bgNeutral: "bg-gray-100",
    textNeutral: "text-gray-100",
    bgAccent: "bg-gray-200",
    hoverAccent: "hover:bg-gray-200",
  },
  {
    name: "emerald-success",
    hex: "#059669",
    primary: "bg-emerald-600",
    secondary: "bg-emerald-800",
    textPrimary: "text-emerald-600",
    textSecondary: "text-emerald-800",
    bgNeutral: "bg-white",
    textNeutral: "text-white",
    bgAccent: "bg-emerald-100",
    hoverAccent: "hover:bg-emerald-100",
  },
  {
    name: "royal-purple",
    hex: "#9333EA",
    primary: "bg-purple-600",
    secondary: "bg-purple-900",
    textPrimary: "text-purple-600",
    textSecondary: "text-purple-900",
    bgNeutral: "bg-gray-50",
    textNeutral: "text-gray-50",
    bgAccent: "bg-purple-100",
    hoverAccent: "hover:bg-purple-100",
  },
  {
    name: "classic-maroon",
    hex: "#991B1B",
    primary: "bg-red-800",
    secondary: "bg-red-900",
    textPrimary: "text-red-800",
    textSecondary: "text-red-900",
    bgNeutral: "bg-gray-100",
    textNeutral: "text-gray-100",
    bgAccent: "bg-red-100",
    hoverAccent: "hover:bg-red-100",
  },
  {
    name: "teal-professional",
    hex: "#0D9488",
    primary: "bg-teal-600",
    secondary: "bg-teal-800",
    textPrimary: "text-teal-600",
    textSecondary: "text-teal-800",
    bgNeutral: "bg-white",
    textNeutral: "text-white",
    bgAccent: "bg-teal-100",
    hoverAccent: "hover:bg-teal-100",
  },
  {
    name: "amber-accent",
    hex: "#D97706",
    primary: "bg-amber-600",
    secondary: "bg-amber-800",
    textPrimary: "text-amber-600",
    textSecondary: "text-amber-800",
    bgNeutral: "bg-gray-50",
    textNeutral: "text-gray-50",
    bgAccent: "bg-amber-100",
    hoverAccent: "hover:bg-amber-100",
  },
  {
    name: "indigo-modern",
    hex: "#4F46E5",
    primary: "bg-indigo-600",
    secondary: "bg-indigo-900",
    textPrimary: "text-indigo-600",
    textSecondary: "text-indigo-900",
    bgNeutral: "bg-white",
    textNeutral: "text-white",
    bgAccent: "bg-indigo-100",
    hoverAccent: "hover:bg-indigo-100",
  },
];

export const OCCASIONS: Occasion[] = [
  { value: "", label: "Select an Occasion" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "congratulations", label: "Congratulations" },
  { value: "appreciation", label: "Appreciation" },
  { value: "wedding", label: "Wedding" },
  { value: "getwell", label: "Get Well" },
  { value: "professional", label: "Professional Greeting" },
  { value: "holiday", label: "Holiday" },
  { value: "other", label: "Other" },
];

const FontOption = ({
  font,
  isSelected,
  onSelect,
}: {
  font: any;
  isSelected: boolean;
  onSelect: (f: string) => void;
}) => {
  useLoadFontPreview(font.family);
  return (
    <button
      type="button"
      onClick={() => onSelect(font.family)}
      className={cn(
        "w-full text-left px-3 py-2.5 border-2 border-[#191A23] rounded-sm transition-all hover:bg-[#191A23]/5 flex items-center justify-between group",
        isSelected
          ? "bg-[#191A23] text-white hover:bg-[#191A23] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
          : "bg-white text-[#191A23]",
      )}
    >
      <span
        style={{ fontFamily: font.family, fontStyle: "normal" }}
        className="text-sm font-medium"
      >
        {font.family}
      </span>
      {isSelected && (
        <div className="size-2 bg-[#B4F8C8] border border-[#191A23] rounded-full" />
      )}
    </button>
  );
};

interface WebsiteFormProps {
  recipientName: string;
  setRecipientName: (val: string) => void;
  occasion: string;
  setOccasion: (val: string) => void;
  customMessage: string;
  setCustomMessage: (val: string) => void;
  generatedMessage: string;
  isGeneratingMessage: boolean;
  generateMessage: () => void;
  handlePasteMessage: () => void;
  useGeneratedMessage: () => void;
  messageRef: React.RefObject<HTMLTextAreaElement | null>;
  images: { url: string; publicId: string }[];
  isUploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  generateAIImage: () => void;
  isGeneratingImage: boolean;
  selectedTheme: Theme;
  setSelectedTheme: (theme: Theme) => void;
  suggestTheme: () => void;
  isSuggestingTheme: boolean;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  fontSearch: string;
  setFontSearch: (val: string) => void;
  suggestFont: () => void;
  isSuggestingFont: boolean;
  fonts: any[];
  isOn: boolean;
  setIsOn: (val: boolean) => void;
  addMusic: boolean;
  setAddMusic: (val: boolean) => void;
  suggestGifts: () => void;
  isSuggestingGifts: boolean;
  giftSuggestions: string[];
  selectedGiftId: string | null;
  setSelectedGiftId: (id: string | null) => void;
  selectedMusic: any | null;
  setSelectedMusic: (track: any) => void;
  setIsPreviewMode: (val: boolean) => void;
  password: string;
  setPassword: (val: string) => void;
  customSlug: string;
  setCustomSlug: (val: string) => void;
  expiresAt: string;
  setExpiresAt: (val: string) => void;
  isPasswordProtected: boolean;
  setIsPasswordProtected: (val: boolean) => void;
  voiceMessageUrl: string | null;
  voiceMessagePublicId: string | null;
  setVoiceMessageUrl: (url: string | null) => void;
  setVoiceMessagePublicId: (id: string | null) => void;
}

export default function WebsiteForm({
  recipientName,
  setRecipientName,
  occasion,
  setOccasion,
  customMessage,
  setCustomMessage,
  generatedMessage,
  isGeneratingMessage,
  generateMessage,
  handlePasteMessage,
  useGeneratedMessage,
  messageRef,
  images,
  isUploading,
  handleImageUpload,
  removeImage,
  fileInputRef,
  generateAIImage,
  isGeneratingImage,
  selectedTheme,
  setSelectedTheme,
  suggestTheme,
  isSuggestingTheme,
  selectedFont,
  setSelectedFont,
  fontSearch,
  setFontSearch,
  suggestFont,
  isSuggestingFont,
  fonts,
  isOn,
  setIsOn,
  addMusic,
  setAddMusic,
  suggestGifts,
  isSuggestingGifts,
  giftSuggestions,
  selectedGiftId,
  setSelectedGiftId,
  selectedMusic,
  setSelectedMusic,
  setIsPreviewMode,
  password,
  setPassword,
  customSlug,
  setCustomSlug,
  expiresAt,
  setExpiresAt,
  isPasswordProtected,
  setIsPasswordProtected,
  voiceMessageUrl,
  voiceMessagePublicId,
  setVoiceMessageUrl,
  setVoiceMessagePublicId,
}: WebsiteFormProps) {
  const isFormValid = recipientName.trim() !== "";

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {/* Recipient Name & Custom Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="recipientName"
            className="text-[10px] font-bold uppercase text-[#191A23]"
          >
            Recipient&apos;s Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="recipientName"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Enter recipient's name"
            required
            className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="customSlug"
            className="text-[10px] font-bold uppercase text-[#191A23] flex items-center gap-2"
          >
            Custom Slug
            <span className="px-1.5 py-0.5 bg-[#9151FF] text-white text-[8px] font-black uppercase rounded-sm tracking-wider">
              PRO
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="customSlug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="e.g. happy-birthday-john"
              className="w-full rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium"
            />
          </div>
          <p className="text-[9px] text-[#9151FF] font-bold">Upgrade to Pro to use a custom URL slug</p>
        </div>
      </div>

      {/* Occasion & Expiration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="occasion"
            className="text-[10px] font-bold uppercase text-[#191A23]"
          >
            Occasion
          </label>
          <select
            id="occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium appearance-none cursor-pointer"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="%23191A23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
          >
            {OCCASIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="font-space font-medium"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="expiresAt"
            className="text-[10px] font-bold uppercase text-[#191A23]"
          >
            Expiration Date
          </label>
          <input
            type="datetime-local"
            id="expiresAt"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium"
          />
        </div>
      </div>

      {/* Password Protection — PRO */}
      <div className="p-4 border-2 border-[#9151FF]/30 rounded-sm bg-[#F3F3F3] shadow-[4px_4px_0px_0px_rgba(145,81,255,0.25)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase text-[#191A23]">
                Password Protection
              </span>
              <span className="px-1.5 py-0.5 bg-[#9151FF] text-white text-[8px] font-black uppercase rounded-sm tracking-wider">
                PRO
              </span>
            </div>
            <span className="text-[9px] font-bold text-[#9151FF]">
              Upgrade to Pro to restrict access with a password
            </span>
          </div>
          <button
            type="button"
            className={cn(
              "h-5 w-10 rounded-full border-2 border-[#191A23] transition-colors relative",
              isPasswordProtected ? "bg-[#B4F8C8]" : "bg-neutral-200",
            )}
            onClick={() => setIsPasswordProtected(!isPasswordProtected)}
          >
            <div
              className={cn(
                "absolute top-0.5 size-3 bg-[#191A23] rounded-full transition-all",
                isPasswordProtected ? "left-5.5" : "left-0.5",
              )}
            />
          </button>
        </div>

        {isPasswordProtected && (
          <div className="flex flex-col space-y-1.5 animate-in slide-in-from-top-2 duration-200">
            <label
              htmlFor="password"
              className="text-[10px] font-bold uppercase text-[#191A23]"
            >
              Set Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access password"
              className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none bg-white font-medium"
            />
          </div>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col space-y-1.5 mb-4">
        <label
          htmlFor="message"
          className="text-[10px] font-bold uppercase text-[#191A23] flex items-center justify-between"
        >
          <span>Custom Message (Optional)</span>
          {isGeneratingMessage && (
            <span className="animate-pulse text-purple-600 normal-case font-black">
              AI is writing...
            </span>
          )}
        </label>
        <textarea
          id="message"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          ref={messageRef}
          cols={20}
          rows={5}
          placeholder="Write your message here..."
          className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium resize-none shadow-sm"
        ></textarea>
        <div className="mt-2.5 flex items-center justify-between border border-[#191A23] bg-[#F3F3F3] p-2 rounded-sm shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]">
          <button
            type="button"
            onClick={generateMessage}
            disabled={isGeneratingMessage}
            className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase text-[#191A23] hover:translate-y-px transition-all disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={SparklesIcon}
              size={12}
              color={isGeneratingMessage ? "#6366f1" : "currentColor"}
              className={isGeneratingMessage ? "animate-spin" : ""}
            />
            {isGeneratingMessage ? "Generating..." : "Generate AI Message"}
          </button>
          <div className="w-px h-4 bg-[#191A23]/20"></div>
          <button
            type="button"
            onClick={handlePasteMessage}
            className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase text-[#191A23] hover:translate-y-px transition-all"
          >
            <HugeiconsIcon
              icon={ClipboardIcon}
              size={12}
              color="currentColor"
            />
            Paste Message
          </button>
        </div>
        {generatedMessage && !isGeneratingMessage && (
          <div className="text-[#191A23] mt-4 bg-[#B4F8C8] p-4 rounded-sm border-2 border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            <p className="text-sm font-medium">{generatedMessage}</p>
            <button
              type="button"
              onClick={useGeneratedMessage}
              className="mt-3 w-full py-2 bg-white border border-[#191A23] text-[10px] font-bold uppercase hover:-translate-y-px shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all"
            >
              Use this message
            </button>
          </div>
        )}
      </div>

      {/* Multi-Image Upload */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-[10px] font-bold uppercase text-[#191A23] flex items-center justify-between">
          <span>Upload Images (Max 5)</span>
          <button
            type="button"
            onClick={generateAIImage}
            disabled={isGeneratingImage || images.length >= 5}
            className="flex items-center gap-1 px-2 py-1 bg-purple-100 border border-purple-300 rounded-sm text-[8px] font-black text-purple-700 hover:bg-purple-200 transition-all disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={AiImageIcon}
              size={10}
              className={isGeneratingImage ? "animate-bounce" : ""}
            />
            {isGeneratingImage ? "GENERATING..." : "MAGIC GENERATE"}
          </button>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <div
              key={img.publicId}
              className="relative group aspect-square border-2 border-[#191A23] rounded-sm overflow-hidden shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]"
            >
              <img
                src={img.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-full flex items-center justify-center border border-[#191A23] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <label
              className={cn(
                "aspect-square border-2 border-dashed border-[#191A23] rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3F3F3] transition-all bg-white",
                isUploading && "opacity-50 pointer-events-none",
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <HugeiconsIcon
                icon={CloudUploadIcon}
                size={20}
                className={isUploading ? "animate-bounce" : ""}
              />
              <span className="text-[8px] font-black uppercase mt-1">
                {isUploading ? "Uploading..." : "Add Image"}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Theme Picker */}
      <div className="flex flex-col">
        <label className="text-[10px] font-bold uppercase text-[#191A23] mb-2 flex items-center justify-between">
          <span>Select Theme</span>
          <button
            type="button"
            onClick={suggestTheme}
            disabled={isSuggestingTheme}
            className="flex items-center gap-1 px-2 py-1 bg-indigo-100 border border-indigo-300 rounded-sm text-[8px] font-black text-indigo-700 hover:bg-indigo-200 transition-all disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={MagicWand01Icon}
              size={10}
              className={isSuggestingTheme ? "animate-pulse" : ""}
            />
            {isSuggestingTheme ? "SUGGESTING..." : "MAGIC SUGGEST"}
          </button>
        </label>
        <div className="grid grid-cols-4 gap-3">
          {THEMES.map((theme) => (
            <div
              key={theme.name}
              onClick={() => setSelectedTheme(theme)}
              className={`rounded-lg cursor-pointer transition-all duration-200 ${
                selectedTheme.name === theme.name
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "hover:ring-1 hover:ring-gray-300"
              }`}
            >
              <div className="flex flex-col h-16 w-full rounded-lg overflow-hidden">
                <div className={`flex flex-row flex-1`}>
                  <div className={`flex-1 ${theme.primary}`} />
                  <div className={`flex-1 ${theme.bgNeutral}`} />
                </div>
                <div className={`flex-1 ${theme.secondary}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Picker */}
      <div className="flex flex-col">
        <label className="text-[10px] font-bold uppercase text-[#191A23] mb-2 flex items-center justify-between">
          <span>Select Font</span>
          <button
            type="button"
            onClick={suggestFont}
            disabled={isSuggestingFont}
            className="flex items-center gap-1 px-2 py-1 bg-green-100 border border-green-300 rounded-sm text-[8px] font-black text-green-700 hover:bg-green-200 transition-all disabled:opacity-50"
          >
            <HugeiconsIcon
              icon={MagicWand01Icon}
              size={10}
              className={isSuggestingFont ? "animate-spin" : ""}
            />
            {isSuggestingFont ? "SUGGESTING..." : "MAGIC SUGGEST"}
          </button>
        </label>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-[#191A23]/40" />
            <input
              type="text"
              placeholder="Search fonts..."
              value={fontSearch}
              onChange={(e) => setFontSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border-2 border-[#191A23] rounded-sm text-xs font-bold focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all bg-white"
            />
          </div>
          <div className="">Popular Fonts</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {(fonts.length > 0 ? fonts : FALLBACK_FONTS)
              .filter((f) =>
                f.family.toLowerCase().includes(fontSearch.toLowerCase()),
              )
              .slice(0, 50)
              .map((font) => (
                <FontOption
                  key={font.family}
                  font={font}
                  isSelected={selectedFont === font.family}
                  onSelect={setSelectedFont}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className=" space-y-4">
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Additional Features
          </h3>
          <div className=" flex items-center justify-between  mx-auto border border-gray-300 rounded-xl p-3">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <h2 className=" text-xl font-medium">Add Gift</h2>
                {isOn && (
                  <button
                    type="button"
                    onClick={suggestGifts}
                    disabled={isSuggestingGifts}
                    className="p-1.5 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-700 hover:bg-yellow-200 transition-all disabled:opacity-50"
                    title="Magic Gift Suggest"
                  >
                    <HugeiconsIcon
                      icon={GiftIcon}
                      size={14}
                      className={isSuggestingGifts ? "animate-bounce" : ""}
                    />
                  </button>
                )}
              </div>
              {isOn && giftSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {giftSuggestions.map((gift, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-[8px] font-bold text-yellow-800 rounded-full uppercase"
                    >
                      {gift}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className={`h-5 w-10 rounded-xl border border-gray-400 flex items-center cursor-pointer transition-colors duration-200 ${
                isOn ? "bg-gray-200" : "bg-gray-200"
              }`}
              onClick={() => setIsOn(!isOn)}
            >
              <div
                className={`bg-gray-800 h-4 w-4 rounded-full shadow-sm transition-transform duration-200 ${
                  isOn
                    ? "transform translate-x-5 "
                    : "transform translate-x-0.5 bg-gray-700"
                }`}
              />
            </button>
          </div>
          <div className=" flex items-center justify-between  mx-auto border border-gray-300 rounded-xl p-3 mt-4">
            <div className="">
              <h2 className=" text-xl font-medium">Add Music</h2>
            </div>
            <button
              type="button"
              className={`h-5 w-10 rounded-xl border border-gray-400 flex items-center cursor-pointer transition-colors duration-200 ${
                addMusic ? "bg-gray-200" : "bg-gray-200"
              }`}
              onClick={() => setAddMusic(!addMusic)}
            >
              <div
                className={`bg-gray-800 h-4 w-4 rounded-full shadow-sm transition-transform duration-200 ${
                  addMusic
                    ? "transform translate-x-5 "
                    : "transform translate-x-0.5 bg-gray-700"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {isOn && (
            <div className="">
              <GiftSelector
                selectedGiftId={selectedGiftId}
                onSelectGift={setSelectedGiftId}
              />
            </div>
          )}
          {addMusic && (
            <div className="">
              <Music
                onSelectMusic={setSelectedMusic}
                selectedMusic={selectedMusic}
              />
            </div>
          )}
          <VoiceMessage
            voiceMessageUrl={voiceMessageUrl}
            voiceMessagePublicId={voiceMessagePublicId}
            onUpload={(url, publicId) => {
              setVoiceMessageUrl(url);
              setVoiceMessagePublicId(publicId);
            }}
            onRemove={() => {
              setVoiceMessageUrl(null);
              setVoiceMessagePublicId(null);
            }}
          />
        </div>
      </div>

      {/* Info strip — replaces old preview button */}
      {!isFormValid && (
        <p className="text-[10px] font-bold uppercase text-red-500 text-center tracking-wider">
          Please enter recipient&apos;s name to enable publishing
        </p>
      )}
    </form>
  );
}
