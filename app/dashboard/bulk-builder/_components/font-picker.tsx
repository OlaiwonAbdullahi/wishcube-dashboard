"use client";

import { useGoogleFontsList, FALLBACK_FONTS } from "@/lib/use-google-fonts";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function FontOptionItem({
  font,
  isSelected,
  onSelect,
}: {
  font: { family: string };
  isSelected: boolean;
  onSelect: (f: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(font.family)}
      className={cn(
        "w-full text-left px-3 py-2.5 border-2 border-[#191A23] rounded-sm transition-all hover:bg-[#191A23]/5 flex items-center justify-between",
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
}

export function FontPicker({
  selectedFont,
  setSelectedFont,
  fontSearch,
  setFontSearch,
}: {
  selectedFont: string;
  setSelectedFont: (f: string) => void;
  fontSearch: string;
  setFontSearch: (s: string) => void;
}) {
  const { fonts } = useGoogleFontsList();
  const displayFonts = fonts.length > 0 ? fonts : FALLBACK_FONTS;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase text-[#191A23]">
        Select Font
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
          {displayFonts
            .filter((f) =>
              f.family.toLowerCase().includes(fontSearch.toLowerCase()),
            )
            .slice(0, 50)
            .map((font) => (
              <FontOptionItem
                key={font.family}
                font={font}
                isSelected={selectedFont === font.family}
                onSelect={setSelectedFont}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
