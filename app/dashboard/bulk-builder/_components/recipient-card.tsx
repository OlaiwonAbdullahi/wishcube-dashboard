"use client";
import { useState, useEffect } from "react";

import { Check, Link as LinkIcon, Camera, Mic, Edit2, RotateCw, Save, X, Sparkles, Loader2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GiftIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { BulkRecipient } from "@/lib/bulk";

interface RecipientCardProps {
  recipient: BulkRecipient;
  onAttachGift: (rowId: string) => void;
  onAttachAssets: (rowId: string) => void;
  onUpdateMessage: (rowId: string, message: string) => Promise<void>;
  onRegenerateMessage: (rowId: string) => Promise<void>;
}

export function RecipientCard({
  recipient,
  onAttachGift,
  onAttachAssets,
  onUpdateMessage,
  onRegenerateMessage,
}: RecipientCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(recipient.ai_message || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    setEditedMessage(recipient.ai_message || "");
  }, [recipient.ai_message]);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateMessage(recipient.row_id, editedMessage);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await onRegenerateMessage(recipient.row_id);
    setIsRegenerating(false);
  };

  const hasImages = (recipient.images?.length ?? 0) > 0;
  const hasVoice = !!recipient.voiceMessageUrl;

  return (
    <div className="group flex flex-col lg:flex-row hover:bg-[#F3F3F3]/40 transition-colors">
      {/* ── Left — info + message ── */}
      <div className="flex-1 p-5 space-y-3">
        {/* Name + status badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-[#191A23]">
              {recipient.first_name} {recipient.last_name}
            </h4>
            <p className="text-[10px] font-medium text-neutral-500 mt-0.5">
              {recipient.email}
              {recipient.department && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-black text-[#9151FF]">
                    {recipient.department}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-[8px] font-black uppercase shrink-0",
                recipient.status === "gift_attached"
                  ? "bg-[#B4F8C8] border-[#191A23] text-[#191A23]"
                  : recipient.status === "published"
                    ? "bg-[#191A23] border-[#191A23] text-white"
                    : "bg-amber-50 border-amber-300 text-amber-700",
              )}
            >
              {recipient.status === "gift_attached" && (
                <Check size={8} strokeWidth={3} />
              )}
              {recipient.status === "gift_attached"
                ? "Gift Attached"
                : recipient.status === "published"
                  ? "Published"
                  : "Pending Gift"}
            </span>

            {/* Asset indicators */}
            {(hasImages || hasVoice) && (
              <div className="flex gap-1">
                {hasImages && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-[#191A23]/10 bg-white text-[7px] font-black uppercase text-neutral-500">
                    <Camera size={7} /> {recipient.images?.length}
                  </span>
                )}
                {hasVoice && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-[#191A23]/10 bg-white text-[7px] font-black uppercase text-neutral-500">
                    <Mic size={7} /> Voice
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Original message (quoted) */}
        {recipient.original_message && (
          <p className="text-[10px] italic text-neutral-400 border-l-2 border-neutral-200 pl-3 leading-relaxed">
            Original: &ldquo;{recipient.original_message}&rdquo;
          </p>
        )}

        {/* AI message bubble */}
        <div className="relative mt-1 p-4 border-2 border-[#9151FF]/30 rounded-sm bg-[#F3F3F3] shadow-[2px_2px_0px_0px_rgba(145,81,255,0.2)]">
          <div className="absolute -top-2.5 left-3 flex items-center gap-2">
            <span className="bg-[#F3F3F3] px-1.5 text-[8px] font-black uppercase tracking-wider text-[#9151FF] border border-[#9151FF]/30 rounded-sm">
              AI Message
            </span>
            {!isEditing && (
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="size-5 flex items-center justify-center rounded-sm bg-white border border-[#9151FF]/30 text-[#9151FF] hover:bg-[#9151FF] hover:text-white transition-all shadow-[1px_1px_0px_0px_rgba(145,81,255,0.2)]"
                  title="Edit Message"
                >
                  <Edit2 size={8} />
                </button>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="size-5 flex items-center justify-center rounded-sm bg-white border border-[#9151FF]/30 text-[#9151FF] hover:bg-[#9151FF] hover:text-white transition-all shadow-[1px_1px_0px_0px_rgba(145,81,255,0.2)]"
                  title="Regenerate with AI"
                >
                  {isRegenerating ? (
                    <Loader2 size={8} className="animate-spin" />
                  ) : (
                    <Sparkles size={8} />
                  )}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full min-h-[80px] text-xs font-medium text-[#191A23] bg-white border border-[#9151FF]/30 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-[#9151FF]/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedMessage(recipient.ai_message || "");
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-[8px] font-black uppercase text-neutral-500 hover:text-neutral-700"
                >
                  <X size={10} /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 px-2 py-1 bg-[#191A23] text-white text-[8px] font-black uppercase rounded-sm hover:bg-[#191A23]/80 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Save size={10} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs font-medium text-[#191A23] leading-relaxed whitespace-pre-line">
              {recipient.ai_message ||
                recipient.original_message ||
                "No message available."}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Wishcube link pill */}
          {recipient.wishcube_link && (
            <a
              href={recipient.wishcube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded-sm border border-[#191A23] bg-[#B4F8C8] text-[#191A23] hover:bg-[#a8f0bb] transition-colors"
            >
              <LinkIcon size={9} />
              View Wishcube
            </a>
          )}

          {/* Manage Assets button */}
          <button
            type="button"
            onClick={() => onAttachAssets(recipient.row_id)}
            className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded-sm border border-[#191A23] bg-white text-[#191A23] hover:bg-[#F3F3F3] transition-colors"
          >
            <Camera size={9} />
            {hasImages || hasVoice ? "Edit Assets" : "Add Assets"}
          </button>
        </div>
      </div>

      {/* ── Right — gift panel ── */}
      <div className="lg:w-52 shrink-0 flex flex-col items-center justify-center gap-3 p-5 bg-[#F3F3F3] lg:border-l-2 border-t-2 lg:border-t-0 border-[#191A23]/10">
        {recipient.gift ? (
          <div className="text-center space-y-2">
            {/* Gift icon box */}
            <div className="mx-auto size-12 bg-[#B4F8C8] border-2 border-[#191A23] rounded-sm flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]">
              <HugeiconsIcon icon={GiftIcon} size={20} color="#191A23" />
            </div>

            {/* Amount */}
            <p className="text-base font-black text-[#191A23]">
              {recipient.gift.amount?.toLocaleString()}{" "}
              <span className="text-xs font-bold text-neutral-500">
                {recipient.gift.currency}
              </span>
            </p>

            {/* Type */}
            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
              {recipient.gift.type}
            </p>

            {/* Change button */}
            <button
              type="button"
              onClick={() => onAttachGift(recipient.row_id)}
              className="text-[9px] font-black uppercase text-[#9151FF] hover:text-[#9151FF]/70 transition-colors underline-offset-2 hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAttachGift(recipient.row_id)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#191A23]/30 rounded-sm text-[10px] font-black uppercase text-neutral-500 hover:border-[#191A23] hover:text-[#191A23] hover:bg-white transition-all"
          >
            <HugeiconsIcon icon={GiftIcon} size={13} />
            Attach Gift
          </button>
        )}
      </div>
    </div>
  );
}
