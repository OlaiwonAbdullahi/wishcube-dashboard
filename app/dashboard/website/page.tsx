/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit01Icon,
  Delete01Icon,
  ArrowUpRight01Icon,
  RocketIcon,
  Add01Icon,
  Calendar01Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import {
  useGoogleFontsList,
  useLoadSelectedFont,
} from "@/lib/use-google-fonts";
import { toast } from "sonner";
import {
  createWebsite,
  publishWebsite,
  getWebsites,
  uploadWebsiteImages,
  deleteWebsite,
} from "@/lib/websites";
import { verifyGiftPayment } from "@/lib/gifts";
import { useRouter, useSearchParams } from "next/navigation";
import { callAI } from "@/lib/ai";
import WebsiteForm, {
  THEMES,
  Theme,
} from "./_components/website-form";
import WebsitePreview from "./_components/website-preview";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-500 border-neutral-300",
  live: "bg-[#B4F8C8] text-[#191A23] border-[#191A23]",
  archived: "bg-amber-100 text-amber-700 border-amber-300",
  expired: "bg-red-100 text-red-700 border-red-300",
};

export default function WebsitePage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "create">("list");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const res = await getWebsites();
      if (res.success && res.data) {
        setWebsites(res.data.websites || []);
      }
    } catch (error) {
      console.error("Fetch websites error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this website? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await deleteWebsite(id);
      if (res.success) {
        toast.success("Website deleted");
        setWebsites((prev) => prev.filter((w) => w._id !== id));
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete website");
    } finally {
      setDeletingId(null);
    }
  };

  if (view === "list") {
    return (
      <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-[#191A23]">
              My Websites
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              Personalized gift pages for your loved ones.
            </p>
          </div>
          <button
            onClick={() => setView("create")}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#191A23] text-white text-xs font-black uppercase rounded-sm border-b-4 border-black hover:-translate-y-1 active:border-b-0 active:translate-y-0 transition-all shadow-sm"
          >
            <HugeiconsIcon icon={Add01Icon} size={14} />
            New Website
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 bg-neutral-100 animate-pulse rounded-sm border-2 border-[#191A23]/10"
              />
            ))}
          </div>
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-[#191A23]/20 rounded-sm gap-4">
            <div className="size-16 bg-[#FFF3B0] border-2 border-[#191A23] rounded-sm flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
              <HugeiconsIcon icon={RocketIcon} size={28} />
            </div>
            <p className="text-sm font-black uppercase text-neutral-400">
              No websites yet
            </p>
            <button
              onClick={() => setView("create")}
              className="px-6 py-2 bg-[#191A23] text-white text-xs font-black uppercase rounded-sm border-b-4 border-black hover:-translate-y-1 active:border-b-0 active:translate-y-0 transition-all"
            >
              Create your first website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {websites.map((ws) => (
              <div
                key={ws._id}
                className="bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] rounded-sm overflow-hidden flex flex-col hover:-translate-y-1 transition-all group"
              >
                {/* Color band */}
                <div className="h-2 bg-[#191A23]" />

                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  {/* Status + date */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase border",
                        STATUS_COLOR[ws.status] || STATUS_COLOR.draft,
                      )}
                    >
                      {ws.status}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar01Icon} size={10} />
                      {new Date(ws.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Name & occasion */}
                  <div className="flex-1">
                    <h3 className="text-base font-black uppercase truncate text-[#191A23]">
                      {ws.recipientName}
                    </h3>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase mt-0.5">
                      {ws.occasion}
                    </p>
                    {ws.publicUrl && (
                      <p className="text-[9px] font-medium text-neutral-300 mt-1 truncate">
                        {ws.publicUrl}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#191A23]/10">
                    {ws.status === "live" && ws.slug && (
                      <button
                        onClick={() =>
                          window.open(`/w/${ws.slug}`, "_blank")
                        }
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#B4F8C8] border border-[#191A23] text-[10px] font-black uppercase hover:bg-[#191A23] hover:text-white transition-all rounded-sm"
                      >
                        <HugeiconsIcon icon={EyeIcon} size={12} />
                        View
                      </button>
                    )}
                    <button
                      title="Edit (coming soon)"
                      className="p-2 border border-[#191A23] rounded-sm hover:bg-neutral-50 transition-colors"
                    >
                      <HugeiconsIcon icon={Edit01Icon} size={14} />
                    </button>
                    {ws.status !== "live" && (
                      <button
                        title="Share / Open"
                        onClick={() =>
                          ws.slug && window.open(`/w/${ws.slug}`, "_blank")
                        }
                        className="p-2 border border-[#191A23] rounded-sm hover:bg-neutral-50 transition-colors"
                      >
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(ws._id)}
                      disabled={deletingId === ws._id}
                      title="Delete"
                      className="p-2 border border-red-200 rounded-sm hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView("list")}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#191A23]">
            Create Website
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            Fill in the left panel — see the preview update live on the right.
          </p>
        </div>
      </div>
      <Suspense fallback={<div>Loading generator...</div>}>
        <Generator />
      </Suspense>
    </div>
  );
}

const Generator: React.FC = () => {
  // Form state
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [recipientName, setRecipientName] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");
  const [customSlug, setCustomSlug] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<any | null>(null);
  const [greetingId, setGreetingId] = useState<string>("");
  const [isOn, setIsOn] = useState(false);
  const [addMusic, setAddMusic] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isSuggestingTheme, setIsSuggestingTheme] = useState(false);
  const [isSuggestingGifts, setIsSuggestingGifts] = useState(false);
  const [isSuggestingFont, setIsSuggestingFont] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [giftSuggestions, setGiftSuggestions] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState<string>("Space Grotesk");
  const [fontSearch, setFontSearch] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      handleVerifyPayment(reference);
    }
  }, [searchParams]);

  const handleVerifyPayment = async (reference: string) => {
    try {
      const res = await verifyGiftPayment(reference);
      if (res.success) {
        toast.success("Payment verified and gift attached!");
        router.replace("/dashboard/website");
      } else {
        toast.error(res.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const { fonts } = useGoogleFontsList();
  useLoadSelectedFont(selectedFont);

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const generateMessage = async (): Promise<void> => {
    if (!recipientName || !occasion) {
      toast.error("Please provide recipient name and occasion first.");
      return;
    }
    setIsGeneratingMessage(true);
    const prompt = `
You are a professional greeting card writer. 
Please write a heartfelt and personalized ${occasion} greeting for someone named "${recipientName}". 
If relevant, incorporate the following message or sentiment: "${customMessage}". 
The tone should be warm, sincere, and creative. 
Keep it concise but meaningful (around 3-5 sentences). 
Do not include a signature or sender name. Use emojis.
`;
    try {
      const response = await callAI(prompt, "google/gemini-2.5-flash");
      setGeneratedMessage(response);
      setMessage(response);
    } catch (error) {
      console.error("Failed to generate message:", error);
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const suggestTheme = async (): Promise<void> => {
    if (!occasion) {
      toast.error("Please select an occasion first.");
      return;
    }
    setIsSuggestingTheme(true);
    const prompt = `
Based on the occasion "${occasion}", suggest the most appropriate theme name from this list:
${THEMES.map((t) => t.name).join(", ")}.
Return ONLY the theme name.
`;
    try {
      const suggestedName = await callAI(prompt, "openai/gpt-5-mini");
      const theme =
        THEMES.find((t) => t.name === suggestedName.trim().toLowerCase()) ||
        THEMES[0];
      setSelectedTheme(theme);
    } catch (error) {
      console.error("Failed to suggest theme:", error);
    } finally {
      setIsSuggestingTheme(false);
    }
  };

  const suggestGifts = async (): Promise<void> => {
    if (!occasion || !recipientName) {
      toast.error("Please provide recipient name and occasion first.");
      return;
    }
    setIsSuggestingGifts(true);
    const prompt = `
Suggest 3-4 gift ideas for a ${occasion} for ${recipientName}. 
The gift ideas should be short (1-3 words). 
Format as a simple comma-separated list of items without any other text.
`;
    try {
      const response = await callAI(prompt, "deepseek/deepseek-v3.2");
      const suggestions = response
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      setGiftSuggestions(suggestions);
    } catch (error) {
      console.error("Failed to suggest gifts:", error);
    } finally {
      setIsSuggestingGifts(false);
    }
  };

  const generateAIImage = async (): Promise<void> => {
    if (!occasion || !recipientName) {
      toast.error("Please provide recipient name and occasion first.");
      return;
    }
    setIsGeneratingImage(true);
    const prompt = `
Generate a professional and beautiful illustration for a ${occasion} card for ${recipientName}.
The image should be high-quality, festive, and warm.
Return ONLY a URL to the generated image.
`;
    try {
      const imageUrl = await callAI(
        prompt,
        "google/gemini-3.1-flash-image-preview",
      );
      if (imageUrl && imageUrl.startsWith("http")) {
        setImages([
          ...images,
          { url: imageUrl, publicId: "ai_generated_" + Date.now() },
        ]);
        toast.success("AI Image generated!");
      } else {
        toast.error("Failed to generate AI image");
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const suggestFont = async (): Promise<void> => {
    if (!occasion) {
      toast.error("Please select an occasion first.");
      return;
    }
    setIsSuggestingFont(true);
    const fontListNames = fonts
      .map((f) => f.family)
      .slice(0, 30)
      .join(", ");
    const prompt = `
Based on the occasion "${occasion}", suggest the most appropriate font name from this list:
${fontListNames}.
Return ONLY the font name.
`;
    try {
      const suggestedName = await callAI(prompt, "openai/gpt-5-mini");
      const font =
        fonts.find(
          (f) =>
            f.family.toLowerCase() === suggestedName.trim().toLowerCase(),
        ) || fonts[0];
      setSelectedFont(font.family);
    } catch (error) {
      console.error("Failed to suggest font:", error);
    } finally {
      setIsSuggestingFont(false);
    }
  };

  const handlePasteMessage = async (): Promise<void> => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setCustomMessage(clipboardText);
        if (messageRef.current) messageRef.current.focus();
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      toast.error(
        "Unable to access clipboard. Please check your browser permissions.",
      );
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }
    setIsUploading(true);
    try {
      const response = await uploadWebsiteImages([file]);
      if (response.success && response.data?.images) {
        setImages([...images, ...response.data.images]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const copyGreetingLink = async (): Promise<void> => {
    if (!recipientName) {
      toast.error("Please enter a recipient name.");
      return;
    }
    setIsCreating(true);
    try {
      const websiteData = {
        recipientName,
        occasion: occasion || "Other",
        relationship: "Friend",
        language: "English",
        message: customMessage || message,
        isAiGenerated: !!message,
        aiTone: "Heartfelt",
        images: images.map((img, i) => ({ ...img, order: i + 1 })),
        theme: selectedTheme.name,
        font: selectedFont,
        primaryColor: "#6366f1",
        countdownDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        isPasswordProtected,
        password: isPasswordProtected ? password : null,
        customSlug: customSlug || undefined,
        expiresAt: new Date(expiresAt).toISOString(),
        giftIds: selectedGiftId ? [selectedGiftId] : [],
      };

      const res = await createWebsite(websiteData);

      if (res.success && res.data) {
        const websiteId = res.data.website._id;
        setGreetingId(websiteId);

        if (selectedGiftId) {
          toast.success("Website created with gift linked!");
          const baseUrl = window.location.origin;
          const previewUrl = `${baseUrl}/preview/${websiteId}`;
          await navigator.clipboard.writeText(previewUrl);
          return;
        }

        const baseUrl = window.location.origin;
        const previewUrl = `${baseUrl}/preview/${websiteId}`;
        await navigator.clipboard.writeText(previewUrl);
        toast.success("Draft link copied! You can now publish it.");
      } else {
        toast.error(res.message || "Failed to create website draft");
      }
    } catch (err) {
      console.error("Failed to create website:", err);
      toast.error("Failed to create website. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handlePublish = async (): Promise<void> => {
    if (!greetingId) {
      toast.error(
        "Please save a draft first by clicking 'Save & Copy Draft Link'.",
      );
      return;
    }
    setIsPublishing(true);
    try {
      const publishData = {
        customSlug:
          customSlug ||
          `${recipientName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()
            .toString()
            .slice(-4)}`,
        expiresAt: new Date(expiresAt).toISOString(),
      };
      const res = await publishWebsite(greetingId, publishData);
      if (res.success && res.data) {
        toast.success("Website published successfully!");
        window.open(res.data.shareUrl, "_blank");
      } else {
        toast.error(res.message || "Failed to publish website");
      }
    } catch (err) {
      console.error("Failed to publish website:", err);
      toast.error("Failed to publish website. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 w-full">
      {/* Left — Form */}
      <div className="bg-white border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] rounded-sm p-6 space-y-6">
        <div className="border-b-2 border-[#191A23]/10 pb-4">
          <h2 className="text-lg font-black text-[#191A23] uppercase tracking-tight">
            Website Details
          </h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase mt-0.5">
            Changes reflect instantly in the preview →
          </p>
        </div>
        <WebsiteForm
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          occasion={occasion}
          setOccasion={setOccasion}
          customMessage={customMessage}
          setCustomMessage={setCustomMessage}
          generatedMessage={generatedMessage}
          isGeneratingMessage={isGeneratingMessage}
          generateMessage={generateMessage}
          handlePasteMessage={handlePasteMessage}
          useGeneratedMessage={() => {
            setCustomMessage(generatedMessage);
            setGeneratedMessage("");
          }}
          messageRef={messageRef}
          images={images}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          fileInputRef={fileInputRef}
          generateAIImage={generateAIImage}
          isGeneratingImage={isGeneratingImage}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          suggestTheme={suggestTheme}
          isSuggestingTheme={isSuggestingTheme}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          fontSearch={fontSearch}
          setFontSearch={setFontSearch}
          suggestFont={suggestFont}
          isSuggestingFont={isSuggestingFont}
          fonts={fonts}
          isOn={isOn}
          setIsOn={setIsOn}
          addMusic={addMusic}
          setAddMusic={setAddMusic}
          suggestGifts={suggestGifts}
          isSuggestingGifts={isSuggestingGifts}
          giftSuggestions={giftSuggestions}
          selectedGiftId={selectedGiftId}
          setSelectedGiftId={setSelectedGiftId}
          selectedMusic={selectedMusic}
          setSelectedMusic={setSelectedMusic}
          setIsPreviewMode={() => {}}
          password={password}
          setPassword={setPassword}
          customSlug={customSlug}
          setCustomSlug={setCustomSlug}
          expiresAt={expiresAt}
          setExpiresAt={setExpiresAt}
          isPasswordProtected={isPasswordProtected}
          setIsPasswordProtected={setIsPasswordProtected}
        />
      </div>

      {/* Right — Live Preview (sticky) */}
      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="bg-[#F3F3F3] border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] rounded-sm p-5">
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
          <WebsitePreview
            selectedTheme={selectedTheme}
            selectedFont={selectedFont}
            occasion={occasion}
            recipientName={recipientName}
            images={images}
            message={message}
            customMessage={customMessage}
            selectedMusic={selectedMusic}
            toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            isMenuOpen={isMenuOpen}
            copyGreetingLink={copyGreetingLink}
            handlePublish={handlePublish}
            isPublishing={isPublishing}
            isCreating={isCreating}
          />
        </div>
      </div>
    </div>
  );
};
