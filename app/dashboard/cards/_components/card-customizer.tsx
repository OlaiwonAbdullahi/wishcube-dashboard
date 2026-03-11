"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CardGenerator } from "./card-generator";
import { ColorPicker } from "./color-picker";
import { FALLBACK_FONTS, useGoogleFontsList } from "./use-google-fonts";
import { CardState } from "../page";
import { PaletteIcon, Search, Type, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoadFontPreview } from "./use-google-fonts";

function FontOption({
  font,
  isSelected,
  onSelect,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  font: any;
  isSelected: boolean;
  onSelect: (f: string) => void;
}) {
  useLoadFontPreview(font.family);

  return (
    <button
      onClick={() => onSelect(font.family)}
      className={cn(
        "w-full text-left px-3 py-2 border border-[#191A23] rounded-sm transition-all hover:bg-[#191A23]/5 flex items-center justify-between",
        isSelected
          ? "bg-[#191A23] text-white hover:bg-[#191A23]"
          : "bg-white text-[#191A23]",
      )}
    >
      <span style={{ fontFamily: font.family }} className="text-sm">
        {font.family}
      </span>
      {isSelected && <div className="size-1.5 bg-white rounded-full" />}
    </button>
  );
}

const PRESET_COLORS = [
  "#000000",
  "#1A1A1A",
  "#2D3748",
  "#191A23",
  "#FFFFFF",
  "#FFE5E5",
  "#E5F5FF",
  "#F5E5FF",
];

interface CardCustomizerProps {
  cardState: CardState;
  setCardState: (state: CardState) => void;
}
export function CardCustomizer({
  cardState,
  setCardState,
}: CardCustomizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fontSearch, setFontSearch] = useState("");
  const { fonts, loading } = useGoogleFontsList();

  // Use fetched fonts if available, otherwise fallback list
  const fontList = fonts.length > 0 ? fonts : FALLBACK_FONTS;
  const filteredFonts = fontList
    .filter((f) => f.family.toLowerCase().includes(fontSearch.toLowerCase()))
    .slice(0, 50); // Limit to 50 for performance

  const steps = [
    { title: "Details", icon: PaletteIcon },
    { title: "Text", icon: Type },
    { title: "Design", icon: Zap },
  ];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardState({ ...cardState, title: e.target.value });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCardState({ ...cardState, message: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardState({ ...cardState, fontSize: parseInt(e.target.value) });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    setCardState({ ...cardState, fontFamily });
  };

  const handleBackgroundColorChange = (color: string) => {
    setCardState({ ...cardState, backgroundColor: color });
  };

  const handleTextColorChange = (color: string) => {
    setCardState({ ...cardState, textColor: color });
  };

  const handleAccentColorChange = (color: string) => {
    setCardState({ ...cardState, accentColor: color });
  };

  /* handlePatternChange removed as unused */

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6 h-fit sticky top-4 font-space">
      {/* Step Indicator */}
      <div className="bg-[#F3F3F3] border border-[#191A23] p-1.5 rounded-sm flex items-center justify-between gap-1 shadow-sm">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isPast = currentStep > index;

          return (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-1 rounded-sm transition-all",
                isActive
                  ? "bg-[#191A23] text-white"
                  : isPast
                    ? "bg-[#191A23]/10 text-[#191A23]"
                    : "text-neutral-400 hover:bg-[#191A23]/5",
              )}
            >
              <div
                className={cn(
                  "size-5 rounded-full flex items-center justify-center text-[10px] border shrink-0",
                  isActive
                    ? "border-white bg-[#191A23]"
                    : "border-[#191A23] bg-white text-[#191A23]",
                )}
              >
                {index + 1}
              </div>
              <span className="text-[10px] font-bold uppercase hidden xl:inline">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[420px]">
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3] rounded-sm">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#191A23]">
                  <PaletteIcon className="size-4" />
                  BASIC DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <CardGenerator
                  cardState={cardState}
                  setCardState={setCardState}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3] rounded-sm">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#191A23]">
                  <Type className="size-4" />
                  EDIT TEXT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Title
                  </Label>
                  <Input
                    value={cardState.title}
                    onChange={handleTitleChange}
                    placeholder="Enter card title"
                    className="border-[#191A23] rounded-sm bg-white focus-visible:ring-1 focus-visible:ring-[#191A23] font-bold text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Message
                  </Label>
                  <textarea
                    value={cardState.message}
                    onChange={handleMessageChange}
                    placeholder="Enter your message"
                    rows={4}
                    className="w-full rounded-sm border border-[#191A23] bg-white px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#191A23] resize-none"
                  />
                </div>

                <Separator className="bg-[#191A23]/10" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase text-[#191A23]">
                      Font Size
                    </Label>
                    <span className="text-[10px] font-bold">
                      {cardState.fontSize}PX
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={cardState.fontSize}
                    onChange={handleFontSizeChange}
                    className="w-full accent-[#191A23]"
                  />
                </div>
                <Separator className="bg-[#191A23]/10" />

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Fonts
                  </Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-[#191A23]/40" />
                      <Input
                        placeholder="Search fonts..."
                        value={fontSearch}
                        onChange={(e) => setFontSearch(e.target.value)}
                        className="pl-8 border-[#191A23] rounded-sm bg-white focus-visible:ring-1 focus-visible:ring-[#191A23] font-bold text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {loading && (
                        <div className="text-[10px] font-bold uppercase text-neutral-400 py-4 text-center">
                          Loading the font library...
                        </div>
                      )}
                      {!loading && filteredFonts.length === 0 && (
                        <div className="text-[10px] font-bold uppercase text-neutral-400 py-4 text-center">
                          No fonts found matching &quot;{fontSearch}&quot;
                        </div>
                      )}
                      {filteredFonts.map((font) => (
                        <FontOption
                          key={font.family}
                          font={font}
                          isSelected={cardState.fontFamily === font.family}
                          onSelect={handleFontFamilyChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3] rounded-sm">
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#191A23]">
                  <PaletteIcon className="size-4" />
                  DESIGN & COLORS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Background Color
                  </Label>
                  <ColorPicker
                    value={cardState.backgroundColor}
                    onChange={handleBackgroundColorChange}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleBackgroundColorChange(color)}
                      className={cn(
                        "h-8 rounded-sm border transition-all",
                        cardState.backgroundColor === color
                          ? "border-[#191A23] border-b-4 -translate-y-0.5"
                          : "border-[#191A23]/20 hover:border-[#191A23]",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <Separator className="bg-[#191A23]/10" />

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Text Color
                  </Label>
                  <ColorPicker
                    value={cardState.textColor}
                    onChange={handleTextColorChange}
                  />
                </div>

                <Separator className="bg-[#191A23]/10" />

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase text-[#191A23]">
                    Accent Color
                  </Label>
                  <ColorPicker
                    value={cardState.accentColor}
                    onChange={handleAccentColorChange}
                  />
                </div>

                <Separator className="bg-[#191A23]/10" />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={cn(
            "flex-1 py-3 border border-[#191A23] rounded-sm font-bold uppercase text-[10px] transition-all",
            currentStep === 0
              ? "opacity-50 cursor-not-allowed bg-neutral-100"
              : "bg-white hover:translate-y-[-2px] border-b-4 hover:border-b-4 active:border-b-2 active:translate-y-0 shadow-sm",
          )}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className={cn(
            "flex-1 py-3 border border-[#191A23] rounded-sm font-bold uppercase text-[10px] transition-all",
            currentStep === steps.length - 1
              ? "bg-[#191A23] text-white opacity-50 cursor-default"
              : "bg-[#191A23] text-white hover:translate-y-[-2px] border-b-4 hover:border-b-4 active:border-b-2 active:translate-y-0 shadow-[0_4px_0_0_rgba(0,0,0,1)]",
          )}
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next Step"}
        </button>
      </div>
    </div>
  );
}
