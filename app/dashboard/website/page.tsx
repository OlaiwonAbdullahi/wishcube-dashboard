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
  updateWebsite,
} from "@/lib/websites";
import { verifyGiftPayment } from "@/lib/gifts";
import { getSubscriptionStatus } from "@/lib/subscriptions";
import { useRouter, useSearchParams } from "next/navigation";
import { callAI } from "@/lib/ai";
import { generateAiMessage } from "@/lib/cards";
import WebsiteForm, { THEMES, Theme } from "./_components/website-form";
import WebsitePreview from "./_components/website-preview";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-500 border-neutral-300",
  live: "bg-[#B4F8C8] text-[#191A23] border-[#191A23]",
  archived: "bg-amber-100 text-amber-700 border-amber-300",
  expired: "bg-red-100 text-red-700 border-red-300",
};

export default function WebsitePage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingWebsite, setEditingWebsite] = useState<any>(null);
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
                        onClick={() => window.open(`/w/${ws.slug}`, "_blank")}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#B4F8C8] border border-[#191A23] text-[10px] font-black uppercase hover:bg-[#191A23] hover:text-white transition-all rounded-sm"
                      >
                        <HugeiconsIcon icon={EyeIcon} size={12} />
                        View
                      </button>
                    )}
                    <button
                      title="Edit"
                      onClick={() => {
                        setEditingWebsite(ws);
                        setView("edit");
                      }}
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          disabled={deletingId === ws._id}
                          title="Delete"
                          className="p-2 border border-red-200 rounded-sm hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <HugeiconsIcon icon={Delete01Icon} size={14} />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Website</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this website? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <button className="px-4 py-2 border border-[#191A23] rounded-sm text-xs font-bold hover:bg-neutral-50 transition-colors">
                              Cancel
                            </button>
                          </DialogClose>
                          <DialogClose asChild>
                            <button
                              onClick={() => handleDelete(ws._id)}
                              className="px-4 py-2 bg-red-500 text-white border border-[#191A23] rounded-sm text-xs font-bold hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
          onClick={() => {
            setView("list");
            setEditingWebsite(null);
          }}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#191A23]">
            {view === "edit" ? "Edit Website" : "Create Website"}
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            Fill in the left panel — see the preview update live on the right.
          </p>
        </div>
      </div>
      <Suspense fallback={<div>Loading generator...</div>}>
        <Generator initialData={editingWebsite} />
      </Suspense>
    </div>
  );
}

const Generator: React.FC<{ initialData?: any }> = ({ initialData }) => {
  // Form state
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    initialData?.theme ? THEMES.find((t) => t.name === initialData.theme) || THEMES[0] : THEMES[0]
  );
  const [recipientName, setRecipientName] = useState<string>(initialData?.recipientName || "");
  const [occasion, setOccasion] = useState<string>(initialData?.occasion || "");
  const [message, setMessage] = useState<string>(initialData?.message || "");
  const [customMessage, setCustomMessage] = useState<string>(initialData?.message || "");
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; publicId: string }[]>(initialData?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>(initialData?.password || "");
  const [customSlug, setCustomSlug] = useState<string>(initialData?.slug || "");
  const [expiresAt, setExpiresAt] = useState<string>(
    initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [isPasswordProtected, setIsPasswordProtected] = useState(initialData?.isPasswordProtected || false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(initialData?.giftIds?.[0] || null);
  const [selectedMusic, setSelectedMusic] = useState<any | null>(null);
  const [voiceMessageUrl, setVoiceMessageUrl] = useState<string | null>(initialData?.voiceMessageUrl || null);
  const [voiceMessagePublicId, setVoiceMessagePublicId] = useState<string | null>(initialData?.voiceMessagePublicId || null);
  const [greetingId, setGreetingId] = useState<string>(initialData?._id || "");
  const [isOn, setIsOn] = useState(!!initialData?.giftIds?.length);
  const [addMusic, setAddMusic] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isSuggestingFont, setIsSuggestingFont] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>(initialData?.font || "Space Grotesk");
  const [fontSearch, setFontSearch] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFreeUser, setIsFreeUser] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    getSubscriptionStatus().then((res) => {
      if (res.success && res.data) {
        setIsFreeUser(res.data.tier === "free");
      }
    });
  }, []);

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
    try {
      const data = await generateAiMessage({
        recipientName,
        occasion,
        tone: "Heartfelt",
      });
      if (data.success && data.data?.suggestions) {
        setGeneratedMessages(data.data.suggestions);
      } else {
        toast.error(data.message || "Failed to generate suggestions");
      }
    } catch (error) {
      console.error("Failed to generate message:", error);
      toast.error("An error occurred while generating suggestions.");
    } finally {
      setIsGeneratingMessage(false);
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
          (f) => f.family.toLowerCase() === suggestedName.trim().toLowerCase(),
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

    // Guard: max 5 images
    if (images.length >= 5) {
      toast.error("You can only upload up to 5 images.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Guard: type check
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Guard: size check (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadWebsiteImages([file]);
      console.log(response);
      if (response.success && response.data?.images?.length) {
        setImages((prev) => [...prev, ...response.data!.images]);
        toast.success("Image uploaded!");
      } else {
        console.error("Upload response:", response);
        toast.error(response.message || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred during upload.");
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
        primaryColor: selectedTheme.hex,
        countdownDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        isPasswordProtected,
        password: isPasswordProtected ? password : null,
        customSlug: customSlug || undefined,
        expiresAt: new Date(expiresAt).toISOString(),
        giftIds: selectedGiftId ? [selectedGiftId] : [],
        voiceMessageUrl: voiceMessageUrl ?? null,
        voiceMessagePublicId: voiceMessagePublicId ?? null,
      };

      let res;
      if (initialData?._id) {
        res = await updateWebsite(initialData._id, websiteData);
      } else {
        res = await createWebsite(websiteData);
      }

      if (res.success && res.data) {
        const websiteId = res.data.website._id;
        setGreetingId(websiteId);

        if (selectedGiftId) {
          toast.success(`Website ${initialData?._id ? "updated" : "created"} with gift linked!`);
          const baseUrl = window.location.origin;
          const previewUrl = `${baseUrl}/preview/${websiteId}`;
          await navigator.clipboard.writeText(previewUrl);
          return;
        }

        const baseUrl = window.location.origin;
        const previewUrl = `${baseUrl}/preview/${websiteId}`;
        await navigator.clipboard.writeText(previewUrl);
        toast.success(`Draft link copied! You can now publish it.`);
      } else {
        toast.error(res.message || "Failed to save website draft");
      }
    } catch (err) {
      console.error("Failed to save website:", err);
      toast.error("Failed to save website. Please try again.");
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
          isFreeUser={isFreeUser}
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          occasion={occasion}
          setOccasion={setOccasion}
          customMessage={customMessage}
          setCustomMessage={setCustomMessage}
          generatedMessages={generatedMessages}
          isGeneratingMessage={isGeneratingMessage}
          generateMessage={generateMessage}
          handlePasteMessage={handlePasteMessage}
          handleUseGeneratedMessage={(msg) => {
            setCustomMessage(msg);
            setGeneratedMessages([]);
          }}
          messageRef={messageRef}
          images={images}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          fileInputRef={fileInputRef}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
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
          voiceMessageUrl={voiceMessageUrl}
          voiceMessagePublicId={voiceMessagePublicId}
          setVoiceMessageUrl={setVoiceMessageUrl}
          setVoiceMessagePublicId={setVoiceMessagePublicId}
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
