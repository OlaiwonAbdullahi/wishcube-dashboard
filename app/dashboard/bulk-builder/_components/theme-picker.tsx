"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  THEMES,
  Theme,
} from "@/app/dashboard/website/_components/website-form";

export { THEMES };
export type { Theme };

export function ThemePicker({
  selectedTheme,
  setSelectedTheme,
}: {
  selectedTheme: Theme;
  setSelectedTheme: (t: Theme) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase text-[#191A23]">
        Colour Theme
      </label>

      <div className="flex items-center justify-between border-2 border-[#191A23] rounded-sm px-3 py-2 bg-white shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]">
        <button
          type="button"
          onClick={() => setShowPicker((p) => !p)}
          className="flex items-center gap-2.5 flex-1 text-left"
        >
          <span
            className="size-5 rounded-full border-2 border-[#191A23] shrink-0 shadow-[1px_1px_0px_0px_rgba(25,26,35,1)]"
            style={{ backgroundColor: selectedTheme.hex }}
          />
          <span className="text-xs font-bold text-[#191A23] capitalize">
            {selectedTheme.name.replace(/-/g, " ")}
          </span>
          <span className="text-[9px] font-mono text-neutral-400 ml-1">
            {selectedTheme.hex}
          </span>
          <span
            className={cn(
              "ml-auto text-[#191A23] transition-transform duration-200",
              showPicker ? "rotate-180" : "",
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 4l4 4 4-4"
                stroke="#191A23"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {showPicker && (
        <div className="border-2 border-[#191A23] rounded-sm bg-white p-3 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] animate-in slide-in-from-top-2 duration-200">
          <p className="text-[9px] font-black uppercase text-neutral-400 mb-2.5 tracking-wider">
            {THEMES.length} colours available
          </p>
          <div className="flex flex-wrap gap-2.5">
            {THEMES.map((theme) => {
              const isSelected = selectedTheme.name === theme.name;
              return (
                <button
                  key={theme.name}
                  type="button"
                  title={theme.name.replace(/-/g, " ")}
                  onClick={() => {
                    setSelectedTheme(theme);
                    setShowPicker(false);
                  }}
                  className={cn(
                    "group relative size-8 rounded-full border-2 transition-all duration-150 focus:outline-none",
                    isSelected
                      ? "border-[#191A23] scale-110 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
                      : "border-transparent hover:border-[#191A23] hover:scale-105",
                  )}
                  style={{ backgroundColor: theme.hex }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
