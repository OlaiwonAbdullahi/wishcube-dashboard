"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CardGenerator } from "./card-generator";
import { ColorPicker } from "./color-picker";
import { FALLBACK_FONTS, useGoogleFontsList } from "./use-google-fonts";
import { CARD_TEMPLATES } from "./card-templates";
import { CardState } from "../page";
import {
  PaletteIcon,
  Search,
  Type,
  Zap,
  ImagePlus,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoadFontPreview } from "./use-google-fonts";
import { toast } from "sonner";
import { getAuth } from "@/lib/auth";

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

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const previewBg = template.preview.backgroundColor || "#FFFFFF";
  const previewText = template.preview.textColor || "#000000";
  const previewAccent = template.preview.accentColor || "#191A23";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative group w-full border rounded-sm overflow-hidden transition-all duration-200",
        isSelected
          ? "border-2 border-[#191A23] shadow-lg scale-105"
          : "border border-[#191A23]/20 hover:border-[#191A23]/50 hover:shadow-md",
      )}
    >
      <div
        className="aspect-[3/4] flex flex-col items-center justify-center p-3"
        style={{ backgroundColor: previewBg, color: previewText }}
      >
        <div className="text-[8px] font-bold uppercase opacity-50 mb-1">
          Template
        </div>
        <div
          className="w-full h-1 rounded-full mb-2"
          style={{ backgroundColor: previewAccent }}
        />
        <div className="text-[10px] font-bold uppercase text-center line-clamp-2">
          {template.name}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-[8px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
        {template.description}
      </div>
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
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { fonts, loading } = useGoogleFontsList();

  const fontList = fonts.length > 0 ? fonts : FALLBACK_FONTS;
  const filteredFonts = fontList
    .filter((f) => f.family.toLowerCase().includes(fontSearch.toLowerCase()))
    .slice(0, 50);

  const steps = [
    { title: "Template", icon: Sparkles },
    { title: "Details", icon: PaletteIcon },
    { title: "Text", icon: Type },
    { title: "Design", icon: Zap },
  ];

  const applyTemplate = (templateId: string) => {
    const template = CARD_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      const newState = { ...cardState, ...template.preview };
      setCardState(newState);
      toast.success(`Applied "${template.name}" template`);
    }
  };

  const syncCardToBackend = async (newState: CardState) => {
    if (!newState._id) return;

    setIsSaving(true);
    const auth = getAuth();
    try {
      const res = await fetch(
        `https://api.usewishcube.com/api/cards/${newState._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          body: JSON.stringify(newState),
        },
      );
      const data = await res.json();
      if (!data.success) {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Error saving card");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCard = async () => {
    if (!cardState.senderName || !cardState.recipientName) {
      toast.error("Please provide names first");
      return;
    }

    setIsSaving(true);
    const auth = getAuth();
    try {
      const res = await fetch("https://api.usewishcube.com/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify(cardState),
      });
      const data = await res.json();
      if (data.success) {
        setCardState(data.data.card);
        setCurrentStep(1);
        toast.success("Card draft created!");
      } else {
        toast.error(data.message || "Failed to create card");
      }
    } catch (error) {
      console.error("Create card error:", error);
      toast.error("Error creating card draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cardState._id) return;

    setIsUploading(true);
    const auth = getAuth();
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.usewishcube.com/api/cards/${cardState._id}/background`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        setCardState({
          ...cardState,
          backgroundImageUrl: data.data.backgroundImageUrl,
        });
        toast.success("Background image uploaded!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    let size: "small" | "medium" | "large" = "medium";
    if (val <= 15) size = "small";
    else if (val >= 25) size = "large";

    const newState = { ...cardState, textSize: size };
    setCardState(newState);
    syncCardToBackend(newState);
  };

  const updateStateAndSync = (updates: Partial<CardState>) => {
    const newState = { ...cardState, ...updates };
    setCardState(newState);
    syncCardToBackend(newState);
  };

  const nextStep = () => {
    if (currentStep === 1 && !cardState._id) {
      handleCreateCard();
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const getFontSizeValue = () => {
    if (cardState.textSize === "small") return 12;
    if (cardState.textSize === "large") return 28;
    return 20;
  };

  return (
    <div className="space-y-6 h-fit sticky top-6 font-space">
      {/* Step Indicator */}
      <div className="bg-white border border-[#191A23]/10 shadow-sm p-2 rounded-lg flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isPast = currentStep > index;
          const StepIcon = step.icon;

          return (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-md transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#191A23] to-[#2D2E38] text-white shadow-md"
                  : isPast
                    ? "bg-[#E8F5E9] text-[#2E7D32]"
                    : "text-[#191A23]/40 hover:bg-[#F5F5F5]",
              )}
            >
              <StepIcon className="size-4" />
              <span className="text-[8px] font-bold uppercase hidden sm:inline text-center leading-tight">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[420px] animate-in fade-in duration-300">
        {/* Step 0: Template */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-[#191A23]/10 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#191A23] to-[#2D2E38] px-6 py-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                  <Sparkles className="size-5" />
                  Choose Template
                </h3>
              </div>
              <div className="p-6">
                <p className="text-xs font-medium text-[#191A23]/70 mb-4 leading-relaxed">
                  Select a template to get started or create a custom card from
                  scratch.
                </p>
                <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                  {CARD_TEMPLATES.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => applyTemplate(template.id)}
                    />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#191A23]/10">
                  <p className="text-[8px] font-bold uppercase text-[#191A23]/60 text-center">
                    💡 You can customize any template after selection
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-[#191A23]/10 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#191A23] to-[#2D2E38] px-6 py-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                  <PaletteIcon className="size-5" />
                  Basic Details
                </h3>
              </div>
              <div className="p-6">
                <CardGenerator
                  cardState={cardState}
                  setCardState={setCardState}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Text - FIXED */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-[#191A23]/10 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#191A23] to-[#2D2E38] px-6 py-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                  <Type className="size-5" />
                  Edit Text
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Message */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Message
                  </Label>
                  <textarea
                    value={cardState.message}
                    onChange={(e) =>
                      updateStateAndSync({ message: e.target.value })
                    }
                    placeholder="Enter your message"
                    rows={4}
                    className="w-full rounded-lg border border-[#191A23]/20 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#191A23] focus:border-transparent resize-none"
                  />
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase text-[#191A23]">
                      Font Size
                    </Label>
                    <span className="text-xs font-bold bg-[#F0F0F0] px-2 py-1 rounded">
                      {cardState.textSize?.toUpperCase() || "MEDIUM"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    step="8"
                    value={getFontSizeValue()}
                    onChange={handleFontSizeChange}
                    className="w-full accent-[#191A23] h-2 rounded-lg appearance-none cursor-pointer bg-[#E0E0E0]"
                  />
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Text Formatting */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Text Formatting
                  </Label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cardState.textBold || false}
                        onChange={(e) =>
                          updateStateAndSync({ textBold: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-[#191A23]/20 cursor-pointer"
                      />
                      <span className="text-xs font-bold">Bold</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cardState.textItalic || false}
                        onChange={(e) =>
                          updateStateAndSync({ textItalic: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-[#191A23]/20 cursor-pointer"
                      />
                      <span className="text-xs font-bold italic">Italic</span>
                    </label>
                  </div>
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Text Alignment */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Text Alignment
                  </Label>
                  <select
                    value={cardState.textAlign || "center"}
                    onChange={(e) =>
                      updateStateAndSync({
                        textAlign: e.target.value as
                          | "left"
                          | "center"
                          | "right",
                      })
                    }
                    className="w-full border border-[#191A23]/20 rounded-lg bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#191A23] appearance-none"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Headline Color */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Headline Color
                  </Label>
                  <ColorPicker
                    value={cardState.headlineColor || "#FFFFFF"}
                    onChange={(color) =>
                      updateStateAndSync({ headlineColor: color })
                    }
                  />
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Headline Size & Bold */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Headline Size
                  </Label>
                  <select
                    value={cardState.headlineSizeOverride || "null"}
                    className="w-full border border-[#191A23]/20 rounded-lg bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#191A23] appearance-none"
                  >
                    <option value="null">Default</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>

                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={cardState.headlineBold || false}
                      onChange={(e) =>
                        updateStateAndSync({ headlineBold: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-[#191A23]/20 cursor-pointer"
                    />
                    <span className="text-xs font-bold">Bold Headline</span>
                  </label>
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Recipient Name Color */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Recipient Name Color
                  </Label>
                  <ColorPicker
                    value={cardState.recipientNameColor || "#000000"}
                    onChange={(color) =>
                      updateStateAndSync({ recipientNameColor: color })
                    }
                  />
                </div>

                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardState.recipientNameItalic || false}
                      onChange={(e) =>
                        updateStateAndSync({
                          recipientNameItalic: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-[#191A23]/20 cursor-pointer"
                    />
                    <span className="text-xs font-bold italic">
                      Italic Name
                    </span>
                  </label>
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Fonts Section - FIXED */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Fonts
                  </Label>
                  <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#191A23]/40" />
                      <Input
                        placeholder="Search fonts..."
                        value={fontSearch}
                        onChange={(e) => setFontSearch(e.target.value)}
                        className="pl-10 border-[#191A23]/20 rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-[#191A23] font-medium text-sm"
                      />
                    </div>

                    {/* Font List */}
                    <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {loading && (
                        <div className="text-xs font-medium text-[#191A23]/40 py-4 text-center">
                          Loading fonts...
                        </div>
                      )}
                      {!loading && filteredFonts.length === 0 && (
                        <div className="text-xs font-medium text-[#191A23]/40 py-4 text-center">
                          No fonts found
                        </div>
                      )}
                      {filteredFonts.map((font) => (
                        <FontOption
                          key={font.family}
                          font={font}
                          isSelected={cardState.font === font.family}
                          onSelect={(f) => updateStateAndSync({ font: f })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Design */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border border-[#191A23]/10 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#191A23] to-[#2D2E38] px-6 py-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                  <Zap className="size-5" />
                  Design & Colors
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Background Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase text-[#191A23]">
                      Background Image
                    </Label>
                    {isUploading && (
                      <Loader2 className="size-4 animate-spin text-[#191A23]" />
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="bg-image-upload"
                    />
                    <label
                      htmlFor="bg-image-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#191A23]/30 rounded-lg cursor-pointer hover:bg-[#191A23]/5 hover:border-[#191A23] transition-all"
                    >
                      {cardState.backgroundImageUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={cardState.backgroundImageUrl}
                            alt="Background"
                            className="w-full h-full object-cover rounded-md opacity-50"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImagePlus className="size-6 text-[#191A23]" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <ImagePlus className="size-5 text-[#191A23]/60" />
                          <span className="text-[8px] font-bold uppercase text-[#191A23]/60">
                            Upload Image
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Background Color */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Background Color
                  </Label>
                  <ColorPicker
                    value={cardState.backgroundColor || "#FFFFFF"}
                    onChange={(color) =>
                      updateStateAndSync({ backgroundColor: color })
                    }
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        updateStateAndSync({ backgroundColor: color })
                      }
                      className={cn(
                        "h-10 rounded-lg border-2 transition-all hover:scale-110",
                        cardState.backgroundColor === color
                          ? "border-[#191A23] shadow-lg scale-110"
                          : "border-[#191A23]/20 hover:border-[#191A23]",
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Text Color */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Text Color
                  </Label>
                  <ColorPicker
                    value={cardState.textColor || "#000000"}
                    onChange={(color) =>
                      updateStateAndSync({ textColor: color })
                    }
                  />
                </div>

                <Separator className="bg-[#191A23]/10" />

                {/* Card Theme */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-[#191A23] block">
                    Card Theme
                  </Label>
                  <select
                    value={cardState.theme || "modern"}
                    onChange={(e) =>
                      updateStateAndSync({ theme: e.target.value })
                    }
                    className="w-full border border-[#191A23]/20 rounded-lg bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#191A23] appearance-none"
                  >
                    {["modern", "classic", "minimal", "playful"].map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={prevStep}
          disabled={currentStep === 0 || isSaving}
          className={cn(
            "flex-1 py-3 border border-[#191A23]/20 rounded-lg font-bold uppercase text-xs transition-all",
            currentStep === 0 || isSaving
              ? "opacity-40 cursor-not-allowed bg-[#F5F5F5] text-[#191A23]/40"
              : "bg-white text-[#191A23] hover:bg-[#F5F5F5] hover:border-[#191A23] active:scale-95 shadow-sm",
          )}
        >
          ← Previous
        </button>
        <button
          onClick={nextStep}
          disabled={isSaving}
          className={cn(
            "flex-1 py-3 rounded-lg font-bold uppercase text-xs transition-all text-white",
            isSaving
              ? "opacity-70 bg-[#191A23] cursor-not-allowed"
              : "bg-gradient-to-r from-[#191A23] to-[#2D2E38] hover:shadow-lg hover:shadow-[#191A23]/30 active:scale-95 shadow-md",
          )}
        >
          {isSaving ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : currentStep === steps.length - 1 ? (
            "Complete Setup ✓"
          ) : (
            "Next Step →"
          )}
        </button>
      </div>
    </div>
  );
}
