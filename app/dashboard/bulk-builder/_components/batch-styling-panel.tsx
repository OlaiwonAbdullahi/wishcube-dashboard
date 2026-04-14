"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemePicker, Theme } from "./theme-picker";
import { FontPicker } from "./font-picker";
import WebsitePreview from "@/app/dashboard/website/_components/website-preview";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AiTone =
  | "Heartfelt"
  | "Funny"
  | "Poetic"
  | "Professional"
  | "Playful";

export interface BatchStylingProps {
  // open/close
  stylingOpen: boolean;
  setStylingOpen: (v: boolean) => void;
  // theme
  selectedTheme: Theme;
  setSelectedTheme: (t: Theme) => void;
  // font
  selectedFont: string;
  setSelectedFont: (f: string) => void;
  fontSearch: string;
  setFontSearch: (s: string) => void;
  // layout
  layout: "classic" | "modern";
  setLayout: (l: "classic" | "modern") => void;
  // locale / tone
  language: string;
  setLanguage: (l: string) => void;
  aiTone: AiTone;
  setAiTone: (t: AiTone) => void;
  // expiry + password
  expiresAt: string;
  setExpiresAt: (d: string) => void;
  isPasswordProtected: boolean;
  setIsPasswordProtected: (v: boolean) => void;
  password: string;
  setPassword: (p: string) => void;
  // for live preview
  occasion?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const LANGUAGES = ["English", "Yoruba", "Igbo", "Hausa", "Pidgin", "French"];
const AI_TONES: AiTone[] = [
  "Heartfelt",
  "Funny",
  "Poetic",
  "Professional",
  "Playful",
];

const PREVIEW_MESSAGE =
  "Wishing you a truly special day filled with joy and celebration! Your hard work, dedication, and positive energy have been an inspiration to everyone around you. May this occasion bring you all the happiness you deserve. 🎉";

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function BatchStylingPanel({
  stylingOpen,
  setStylingOpen,
  selectedTheme,
  setSelectedTheme,
  selectedFont,
  setSelectedFont,
  fontSearch,
  setFontSearch,
  layout,
  setLayout,
  language,
  setLanguage,
  aiTone,
  setAiTone,
  expiresAt,
  setExpiresAt,
  isPasswordProtected,
  setIsPasswordProtected,
  password,
  setPassword,
  occasion,
}: BatchStylingProps) {
  return (
    <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
      {/* ── Toggle header ── */}
      <button
        type="button"
        onClick={() => setStylingOpen(!stylingOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F3F3F3] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="size-7 bg-[#9151FF] rounded-sm flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={SparklesIcon} size={13} color="white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-black uppercase text-[#191A23]">
              Batch Styling
            </p>
            <p className="text-[9px] font-medium text-neutral-400 mt-0.5">
              Theme · Font · Layout · Language · AI Tone · Expiry · Password
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick swatch pill — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#191A23]/10 rounded-sm bg-[#F3F3F3]">
            <span
              className="size-3.5 rounded-full border border-[#191A23]/20 shrink-0"
              style={{ backgroundColor: selectedTheme.hex }}
            />
            <span
              className="text-[10px] font-bold text-[#191A23]"
              style={{ fontFamily: selectedFont }}
            >
              {selectedFont}
            </span>
            <span className="text-[9px] text-neutral-400 capitalize">
              · {layout}
            </span>
          </div>

          {stylingOpen ? (
            <ChevronUp size={16} className="text-[#191A23]" />
          ) : (
            <ChevronDown size={16} className="text-[#191A23]" />
          )}
        </div>
      </button>

      {/* ── Collapsible body ── */}
      {stylingOpen && (
        <div className="border-t-2 border-[#191A23] animate-in slide-in-from-top-2 duration-200">
          {/* Two-column: form (left) + preview (right) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-0 xl:gap-0">
            {/* ── LEFT: all form controls ── */}
            <div className="p-5 space-y-6 xl:border-r-2 xl:border-[#191A23]/10">
              {/* a. Layout picker */}
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-bold uppercase text-[#191A23]">
                  Layout Style
                </label>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {/* Classic */}
                  <button
                    type="button"
                    onClick={() => setLayout("classic")}
                    className={cn(
                      "flex flex-col gap-2 p-3 border-2 rounded-sm text-left transition-all",
                      layout === "classic"
                        ? "border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] bg-white"
                        : "border-[#191A23]/20 bg-white hover:border-[#191A23]/60",
                    )}
                  >
                    <div
                      className="w-full h-10 rounded-sm"
                      style={{ backgroundColor: selectedTheme.hex }}
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#191A23]">
                        Classic
                        {layout === "classic" && (
                          <span className="ml-1.5 inline-flex items-center justify-center size-3 rounded-full bg-[#B4F8C8] border border-[#191A23]" />
                        )}
                      </p>
                      <p className="text-[9px] text-neutral-400 font-medium mt-0.5">
                        Solid colour header
                      </p>
                    </div>
                  </button>

                  {/* Modern */}
                  <button
                    type="button"
                    onClick={() => setLayout("modern")}
                    className={cn(
                      "flex flex-col gap-2 p-3 border-2 rounded-sm text-left transition-all",
                      layout === "modern"
                        ? "border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] bg-white"
                        : "border-[#191A23]/20 bg-white hover:border-[#191A23]/60",
                    )}
                  >
                    <div className="relative w-full h-10 rounded-sm overflow-hidden bg-slate-200">
                      <div
                        className="absolute inset-0 opacity-70"
                        style={{ backgroundColor: selectedTheme.hex }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[7px] font-bold text-white/80 uppercase tracking-wider">
                          Photo
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#191A23]">
                        Modern
                        {layout === "modern" && (
                          <span className="ml-1.5 inline-flex items-center justify-center size-3 rounded-full bg-[#B4F8C8] border border-[#191A23]" />
                        )}
                      </p>
                      <p className="text-[9px] text-neutral-400 font-medium mt-0.5">
                        Image + colour overlay
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* b. Theme + Font */}
              <div className="grid grid-cols-1 gap-6">
                <ThemePicker
                  selectedTheme={selectedTheme}
                  setSelectedTheme={setSelectedTheme}
                />
                <FontPicker
                  selectedFont={selectedFont}
                  setSelectedFont={setSelectedFont}
                  fontSearch={fontSearch}
                  setFontSearch={setFontSearch}
                />
              </div>

              {/* c. Language + AI Tone + Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Language */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Language
                  </label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="rounded-sm w-full py-5 border-2 border-[#191A23] text-sm font-medium bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* AI Tone */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#191A23]">
                    AI Tone
                  </label>
                  <Select
                    value={aiTone}
                    onValueChange={(v) => setAiTone(v as AiTone)}
                  >
                    <SelectTrigger className="rounded-sm border-2 w-full py-5 border-[#191A23] text-sm font-medium bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_TONES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Expiry */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Expiration Date
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="rounded-sm px-4 py-2.5 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium"
                  />
                </div>
              </div>

              {/* d. Password block */}
              <div className="p-4 w-full border-2 border-[#9151FF]/30 rounded-sm bg-[#F3F3F3] shadow-[4px_4px_0px_0px_rgba(145,81,255,0.25)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black uppercase text-[#191A23]">
                      Password Protection
                    </p>
                    <p className="text-[9px] font-medium text-neutral-400 mt-0.5">
                      Require a password to view each wishcube
                    </p>
                  </div>

                  {/* Toggle switch */}
                  <button
                    type="button"
                    className={cn(
                      "h-5 w-10 rounded-full border-2 border-[#191A23] transition-colors relative shrink-0",
                      isPasswordProtected ? "bg-[#B4F8C8]" : "bg-neutral-200",
                    )}
                    onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 size-3 bg-[#191A23] rounded-full transition-all",
                        isPasswordProtected ? "left-[22px]" : "left-0.5",
                      )}
                    />
                  </button>
                </div>

                {isPasswordProtected && (
                  <div className="flex flex-col space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-[10px] font-bold uppercase text-[#191A23]">
                      Set Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter access password"
                      className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none bg-white font-medium"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: sticky live preview ── */}
            <div className="xl:sticky xl:top-6 xl:self-start border-t-2 xl:border-t-0 xl:border-l-0 border-[#191A23]/10">
              <div className="bg-[#F3F3F3] border-0 xl:border-l-2 xl:border-[#191A23]/10 p-5 h-full">
                {/* Preview header — traffic lights + label */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-[#191A23]/10">
                  <h2 className="text-sm font-black text-[#191A23] uppercase tracking-widest">
                    Live Preview
                  </h2>
                  <div className="flex gap-1">
                    <div className="size-3 rounded-full bg-red-400 border border-red-500" />
                    <div className="size-3 rounded-full bg-yellow-400 border border-yellow-500" />
                    <div className="size-3 rounded-full bg-green-400 border border-green-500" />
                  </div>
                </div>

                {/* The actual phone mockup preview */}
                <WebsitePreview
                  selectedTheme={selectedTheme}
                  selectedFont={selectedFont}
                  occasion={occasion || ""}
                  recipientName="Sample Recipient"
                  images={[]}
                  message=""
                  customMessage={PREVIEW_MESSAGE}
                  selectedMusic={null}
                  toggleMenu={() => {}}
                  isMenuOpen={false}
                  copyGreetingLink={() => {}}
                  handlePublish={() => {}}
                  isPublishing={false}
                  isCreating={false}
                  layout={layout}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
