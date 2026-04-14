/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  RocketIcon,
  MusicNote01Icon,
  GiftIcon,
  SparklesIcon,
  FavouriteIcon,
  SentIcon,
  CameraIcon,
  Save,
  AudioWaveIcon,
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
  layout?: "classic" | "modern";
  voiceMessageUrl?: string | null;
}

function SectionLabel({
  icon,
  label,
  accent,
}: {
  icon: any;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span
        className="size-4 rounded-md flex items-center justify-center"
        style={{ background: accent + "20" }}
      >
        <HugeiconsIcon icon={icon} size={9} color={accent} />
      </span>
      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
    </div>
  );
}

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
  layout = "classic",
  voiceMessageUrl,
}: WebsitePreviewProps) {
  const displayMessage = customMessage || message;
  const accent = selectedTheme.hex ?? "#6366f1";

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto w-full max-w-[280px]">
        <div
          className="relative rounded-[2.8rem] p-[10px]"
          style={{
            background:
              "linear-gradient(145deg, #2a2d3a 0%, #191A23 60%, #111318 100%)",
          }}
        >
          <div className="absolute left-[-3px] top-[90px] w-[3px] h-7 rounded-l-sm bg-[#111318]" />
          <div className="absolute left-[-3px] top-[128px] w-[3px] h-10 rounded-l-sm bg-[#111318]" />
          <div className="absolute left-[-3px] top-[178px] w-[3px] h-10 rounded-l-sm bg-[#111318]" />
          <div className="absolute right-[-3px] top-[130px] w-[3px] h-14 rounded-r-sm bg-[#111318]" />
          <div
            className="rounded-[2.2rem] overflow-hidden"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="relative rounded-[2.2rem] overflow-hidden bg-slate-50"
              style={{ height: 560 }}
            >
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 z-30 rounded-full"
                style={{
                  width: 72,
                  height: 18,
                  background: "#191A23",
                }}
              />
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-2 pb-1">
                <span className="text-[7px] font-bold text-white drop-shadow">
                  9:41
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-[2px] items-end h-2.5">
                    {[40, 60, 80, 100].map((h, i) => (
                      <div
                        key={i}
                        className="w-[2px] rounded-full bg-white"
                        style={{ height: `${h}%`, opacity: 0.8 }}
                      />
                    ))}
                  </div>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="white">
                    <path d="M0 3l1.5-1.5 1.5 1.5L5 1l1.5 1.5L8 1 9.5 2.5l-7 7z" />
                  </svg>
                  <div className="flex items-center gap-0.5">
                    <div
                      className="h-2 rounded-full bg-white"
                      style={{ width: 12 }}
                    />
                    <div className="h-2.5 w-[2px] rounded-full bg-white opacity-40" />
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                style={{
                  fontFamily: `'${selectedFont}', 'Inter', sans-serif`,
                  scrollbarWidth: "none",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    minHeight: 140,
                    ...(layout === "modern" && images.length > 0
                      ? {
                          backgroundImage: `url('${images[0].url}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {
                          background: `linear-gradient(135deg, ${accent}ee 0%, ${accent}bb 100%)`,
                        }),
                  }}
                >
                  {/* Overlay — only in modern mode */}
                  {layout === "modern" && images.length > 0 && (
                    <div
                      className="absolute inset-0"
                      style={{ background: `${accent}cc` }}
                    />
                  )}
                  <div
                    className="absolute -top-8 -right-8 size-28 rounded-full"
                    style={{ background: "rgba(255,255,255,0.10)" }}
                  />
                  <div
                    className="absolute -bottom-6 -left-6 size-20 rounded-full"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <div className="relative px-4 pt-10 pb-10">
                    {occasion && (
                      <span
                        className="inline-flex items-center capitalize gap-1 text-white text-[7px] font-semibold px-2.5 py-1 rounded-full mb-2"
                        style={{ background: "rgba(255,255,255,0.22)" }}
                      >
                        <HugeiconsIcon
                          icon={SparklesIcon}
                          size={7}
                          color="white"
                        />
                        {occasion}
                      </span>
                    )}
                    <p className="text-white/70 text-[7px] font-medium mb-0.5">
                      A special message for
                    </p>
                    <h1 className="text-lg font-bold text-white leading-tight">
                      {recipientName || "Your Recipient"}
                    </h1>

                    <div className="flex items-center gap-1 mt-1 text-white/60">
                      <HugeiconsIcon
                        icon={FavouriteIcon}
                        size={7}
                        color="white"
                      />
                      <p className="text-[7px]">
                        Someone who cares made this for you
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0">
                    <svg
                      viewBox="0 0 1440 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                      className="w-full"
                      style={{ display: "block" }}
                    >
                      <path
                        d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z"
                        fill="#f8fafc"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  className="px-3 pb-6 -mt-1 space-y-3"
                  style={{ background: "#f8fafc" }}
                >
                  {images.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-100">
                      <SectionLabel
                        icon={CameraIcon}
                        label="Memories"
                        accent={accent}
                      />
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={images[0].url}
                          alt="Memory"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {images.length > 1 && (
                        <div className="flex justify-center gap-1 mt-2">
                          {images.slice(0, 5).map((_, i) => (
                            <div
                              key={i}
                              className="h-1 rounded-full transition-all"
                              style={{
                                width: i === 0 ? 14 : 5,
                                background: i === 0 ? accent : "#CBD5E1",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-100">
                      <SectionLabel
                        icon={CameraIcon}
                        label="Memories"
                        accent={accent}
                      />
                      <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-slate-100 flex items-center justify-center">
                        <p className="text-[7px] text-slate-300 font-bold uppercase">
                          No images added
                        </p>
                      </div>
                    </div>
                  )}

                  {voiceMessageUrl && (
                    <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-100">
                      <SectionLabel
                        icon={AudioWaveIcon}
                        label="Voice Message"
                        accent={accent}
                      />
                      <div
                        className="flex items-center gap-3 p-2 rounded-lg border"
                        style={{
                          background: accent + "08",
                          borderColor: accent + "20",
                        }}
                      >
                        <div
                          className="size-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: accent }}
                        >
                          <HugeiconsIcon
                            icon={AudioWaveIcon}
                            size={14}
                            color="white"
                          />
                        </div>
                        <div className="flex-1">
                          <div
                            className="h-1 w-full rounded-full bg-slate-200 overflow-hidden"
                            style={{ background: accent + "20" }}
                          >
                            <div
                              className="h-full w-1/3 rounded-full"
                              style={{ background: accent }}
                            />
                          </div>
                        </div>
                        <span className="text-[7px] font-bold text-slate-400">
                          0:42
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-100 relative overflow-hidden">
                    <div
                      className="absolute -top-1 -left-0.5 text-[50px] font-serif leading-none opacity-[0.04] select-none pointer-events-none"
                      style={{ color: accent }}
                    >
                      &ldquo;
                    </div>
                    <SectionLabel
                      icon={SparklesIcon}
                      label="A message for you"
                      accent={accent}
                    />
                    {displayMessage ? (
                      <p className="text-[8px] leading-relaxed text-slate-700 relative z-10">
                        {displayMessage}
                      </p>
                    ) : (
                      <p className="text-[7px] text-slate-300 font-bold uppercase text-center py-3">
                        Message will appear here
                      </p>
                    )}
                  </div>
                  {selectedMusic && (
                    <div
                      className="flex items-center gap-2 p-2.5 rounded-xl border"
                      style={{
                        background: accent + "08",
                        borderColor: accent + "25",
                      }}
                    >
                      <div
                        className="size-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: accent }}
                      >
                        <HugeiconsIcon
                          icon={MusicNote01Icon}
                          size={14}
                          color="white"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[7px] font-semibold uppercase tracking-widest text-slate-400">
                          Background Track
                        </p>
                        <p className="text-[8px] font-semibold text-slate-800 truncate">
                          {selectedMusic.title}
                        </p>
                      </div>
                    </div>
                  )}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${accent}30` }}
                  >
                    <div
                      className="h-14 flex items-center justify-center"
                      style={{ background: accent + "15" }}
                    >
                      <HugeiconsIcon
                        icon={GiftIcon}
                        size={24}
                        color={accent}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div
                      className="p-3"
                      style={{
                        background: `linear-gradient(135deg, ${accent}06, ${accent}14)`,
                      }}
                    >
                      <span
                        className="inline-flex items-center gap-1 text-[7px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
                        style={{ background: accent + "20", color: accent }}
                      >
                        <HugeiconsIcon
                          icon={GiftIcon}
                          size={7}
                          color={accent}
                        />
                        A gift for you
                      </span>
                      <p className="text-[9px] font-bold text-slate-800">
                        Special Gift Attached
                      </p>
                      <button
                        className="mt-2 w-full py-1.5 rounded-lg text-[8px] font-semibold text-white"
                        style={{ background: accent }}
                      >
                        Redeem My Gift →
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-100 text-center space-y-2">
                    <p className="text-[8px] font-semibold text-slate-800">
                      How does this make you feel?
                    </p>
                    <p className="text-[7px] text-slate-400">
                      Tap an emoji to react
                    </p>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {["❤️", "🎉", "🔥", "🥹", "🙌", "😍", "🫶"].map((e) => (
                        <div
                          key={e}
                          className="size-7 text-sm flex items-center justify-center rounded-xl bg-slate-50"
                        >
                          {e}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-100 space-y-2">
                    <SectionLabel
                      icon={SentIcon}
                      label="Send a Reply"
                      accent={accent}
                    />
                    <div className="w-full px-2.5 py-2 rounded-lg border border-slate-200 min-h-[40px] flex items-start">
                      <p className="text-[7px] text-slate-300">
                        Write a heartfelt thank you…
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[7px] font-semibold text-white"
                        style={{ background: accent }}
                      >
                        <HugeiconsIcon icon={SentIcon} size={8} color="white" />
                        Send Reply
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-3 space-y-1">
                    <div className="flex items-center justify-center gap-1 text-slate-300">
                      <HugeiconsIcon
                        icon={RocketIcon}
                        size={8}
                        color="currentColor"
                      />
                      <p className="text-[7px]">
                        Made with <span style={{ color: accent }}>♥</span> via{" "}
                        <span
                          className="font-semibold"
                          style={{ color: accent }}
                        >
                          WishCube
                        </span>
                      </p>
                    </div>
                    <p className="text-[7px] text-slate-300">
                      Create your own celebration page →
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2 mb-1">
            <div className="w-20 h-[3px] bg-white/25 rounded-full" />
          </div>
        </div>
        <p className="text-center text-[9px] font-bold uppercase text-neutral-400 mt-3 tracking-widest">
          {selectedTheme.name} · {selectedFont}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
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
          <HugeiconsIcon icon={Save} size={16} />
          {isCreating ? "Saving Draft..." : "Save as Draft"}
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
          {isPublishing ? "Publishing..." : "Publish Live"}
        </button>
      </div>
    </div>
  );
}
