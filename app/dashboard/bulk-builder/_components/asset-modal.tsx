"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, X, Trash2, Image as ImageIcon, Mic } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CloudUploadIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { uploadWebsiteImages } from "@/lib/websites";
import VoiceMessage from "@/app/dashboard/website/_components/voiceMessage";
import { toast } from "sonner";

export interface AssetData {
  images: { url: string; publicId: string }[];
  voiceMessageUrl: string | null;
  voiceMessagePublicId: string | null;
}

export function BulkAssetModal({
  isOpen,
  recipientName,
  onClose,
  onAttach,
  isAttaching,
  initialData,
}: {
  isOpen: boolean;
  recipientName: string;
  onClose: () => void;
  onAttach: (data: AssetData) => void;
  isAttaching: boolean;
  initialData: AssetData | null;
}) {
  const [images, setImages] = useState<{ url: string; publicId: string }[]>(
    initialData?.images || [],
  );
  const [voiceMessageUrl, setVoiceMessageUrl] = useState<string | null>(
    initialData?.voiceMessageUrl || null,
  );
  const [voiceMessagePublicId, setVoiceMessagePublicId] = useState<string | null>(
    initialData?.voiceMessagePublicId || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update state if initialData changes (remounting usually handles this, but safety first)
  useEffect(() => {
    if (initialData) {
      setImages(initialData.images || []);
      setVoiceMessageUrl(initialData.voiceMessageUrl || null);
      setVoiceMessagePublicId(initialData.voiceMessagePublicId || null);
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 5) {
      toast.error("Max 5 images allowed");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadWebsiteImages([file]);
      if (res.success && res.data?.images?.length) {
        setImages((prev) => [...prev, ...res.data!.images]);
        toast.success("Image uploaded!");
      } else {
        toast.error(res.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    onAttach({
      images,
      voiceMessageUrl,
      voiceMessagePublicId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden font-space gap-0">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#191A23] bg-[#F3F3F3]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
              Personalize Assets for
            </p>
            <h2 className="text-sm font-black text-[#191A23] mt-0.5">
              {recipientName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="size-7 flex items-center justify-center border-2 border-[#191A23] rounded-sm bg-white hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
          {/* 1. Images Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className="text-[#191A23]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#191A23]">
                Images (Max 5)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div
                  key={img.publicId}
                  className="relative group aspect-square border-2 border-[#191A23] rounded-sm overflow-hidden shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
                >
                  <img
                    src={img.url}
                    alt={`Asset ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 size-5 bg-red-500 text-white rounded-full flex items-center justify-center border border-[#191A23] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label
                  className={cn(
                    "aspect-square border-2 border-dashed border-[#191A23]/20 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3F3F3] transition-all bg-white",
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
                    size={16}
                    className={isUploading ? "animate-bounce" : ""}
                  />
                  <span className="text-[8px] font-black uppercase mt-1">
                    {isUploading ? "Uploading..." : "Add Image"}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* 2. Voice Message Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mic size={14} className="text-[#191A23]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#191A23]">
                Voice Message
              </p>
            </div>
            <div className="p-3 border-2 border-[#191A23]/10 rounded-sm bg-[#F3F3F3]">
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
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-3 px-5 py-4 border-t-2 border-[#191A23] bg-[#F3F3F3]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-white hover:bg-neutral-100 transition-all shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isAttaching}
            className="flex-1 py-2.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-[#191A23] text-white hover:bg-[#191A23]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] flex items-center justify-center gap-2"
          >
            {isAttaching ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <HugeiconsIcon icon={Tick02Icon} size={12} color="white" />
            )}
            {isAttaching ? "Saving…" : "Save Assets"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
