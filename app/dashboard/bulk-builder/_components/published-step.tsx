"use client";

import { Check, Link as LinkIcon, RefreshCcw } from "lucide-react";
import { Theme } from "./theme-picker";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface PublishedStepProps {
  selectedTheme: Theme;
  selectedFont: string;
  layout: "classic" | "modern";
  language: string;
  aiTone: string;
  onExport: () => void;
  onReset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function PublishedStep({
  selectedTheme,
  selectedFont,
  layout,
  language,
  aiTone,
  onExport,
  onReset,
}: PublishedStepProps) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden text-center">
        {/* Green accent bar */}
        <div className="h-1.5 bg-[#B4F8C8]" />

        <div className="px-8 py-10 space-y-5">
          {/* Check icon box */}
          <div className="mx-auto size-16 bg-[#B4F8C8] border-2 border-[#191A23] rounded-sm flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            <Check size={28} strokeWidth={3} color="#191A23" />
          </div>

          {/* Heading + description */}
          <div>
            <h2 className="text-xl font-black uppercase text-[#191A23]">
              Batch Published!
            </h2>
            <p className="text-sm font-medium text-neutral-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              The server is gradually generating personalised wishcube links and
              emailing each recipient.
            </p>
          </div>

          {/* Style summary pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#191A23]/10 rounded-sm bg-[#F3F3F3] text-[9px] font-black uppercase">
            {/* Colour swatch */}
            <span
              className="size-3.5 rounded-full border border-[#191A23]/20 shrink-0"
              style={{ backgroundColor: selectedTheme.hex }}
            />

            {/* Theme name */}
            <span className="text-neutral-600 capitalize">
              {selectedTheme.name.replace(/-/g, " ")}
            </span>

            <span className="text-neutral-300">·</span>

            {/* Font — rendered in the chosen typeface */}
            <span
              className="text-neutral-600"
              style={{ fontFamily: selectedFont }}
            >
              {selectedFont}
            </span>

            <span className="text-neutral-300">·</span>

            {/* Layout */}
            <span className="text-neutral-600">{layout}</span>

            <span className="text-neutral-300">·</span>

            {/* Language */}
            <span className="text-neutral-600">{language}</span>

            <span className="text-neutral-300">·</span>

            {/* AI Tone */}
            <span className="text-neutral-600">{aiTone}</span>
          </div>

          {/* Processing note */}
          <p className="text-xs font-medium text-neutral-500 max-w-xs mx-auto">
            Wait a few moments for background processing to complete, then
            download the CSV with all generated links.
          </p>

          {/* Export button */}
          <button
            type="button"
            onClick={onExport}
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-[#191A23] text-white hover:bg-[#191A23]/90 transition-all shadow-[3px_3px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <LinkIcon size={13} strokeWidth={2.5} />
            Download Generated Links CSV
          </button>

          {/* New batch ghost button */}
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-[#191A23]/20 rounded-sm text-[10px] font-black uppercase text-neutral-500 hover:border-[#191A23] hover:text-[#191A23] transition-all"
          >
            <RefreshCcw size={11} strokeWidth={2.5} />
            Start a New Batch
          </button>
        </div>
      </div>
    </div>
  );
}
