/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getLiveWebsite, submitReaction, submitReply } from "@/lib/websites";
import { redeemGift } from "@/lib/gifts";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  RocketIcon,
  SentIcon,
  GiftIcon,
  Cancel01Icon,
  MusicNote01Icon,
  SparklesIcon,
  FavouriteIcon,
  LockPasswordIcon,
  Tick01Icon,
  Time01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GiftInfo {
  _id: string;
  type: string;
  amountPaid: number;
  currency: string;
  giftMessage?: string;
  status: string;
  escrowStatus?: string;
  expiresAt?: string;
}

interface WebsiteData {
  _id: string;
  recipientName: string;
  occasion: string;
  language?: string;
  message?: string;
  images?: { url: string; publicId: string; order: number }[];
  videoUrl?: string | null;
  voiceMessageUrl?: string | null;
  musicTrack?: string;
  musicUrl?: string;
  theme?: string;
  font?: string;
  primaryColor?: string;
  countdownDate?: string | null;
  isPasswordProtected?: boolean;
  giftIds?: GiftInfo[];
  status: string;
  slug?: string;
  publicUrl?: string;
  views?: number;
  reaction?: { emoji?: string | null; reactedAt?: string | null };
  recipientReply?: { message?: string | null; repliedAt?: string | null };
  expiresAt?: string;
}

// ─── Countdown helper ─────────────────────────────────────────────────────────
function useCountdown(target?: string | null) {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    if (!target) return;
    const tick = () => setDiff(new Date(target).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff === null || diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, s: sec };
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F3F3] gap-6">
      <div className="relative size-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#191A23]/10 animate-ping" />
        <div className="absolute inset-2 size-16 rounded-full bg-[#FFF3B0] border-2 border-[#191A23] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
          <HugeiconsIcon icon={RocketIcon} size={28} className="text-[#191A23]" />
        </div>
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
        Loading your WishCube…
      </p>
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────
function NotFoundScreen({ expired = false }: { expired?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3] p-4">
      <div className="text-center space-y-4 p-8 bg-white border-2 border-[#191A23] shadow-[12px_12px_0px_0px_rgba(25,26,35,1)] rounded-sm max-w-sm w-full">
        <div className="text-5xl">{expired ? "⏳" : "🔍"}</div>
        <h1 className="text-xl font-black uppercase text-[#191A23]">
          {expired ? "This page has expired" : "Page Not Found"}
        </h1>
        <p className="text-xs text-neutral-500 font-medium">
          {expired
            ? "The creator's link is no longer active."
            : "This link might be incorrect or has been removed."}
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#191A23] text-white text-xs font-black uppercase rounded-sm border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all shadow-sm"
        >
          Create your own →
        </Link>
      </div>
    </div>
  );
}

// ─── Countdown Card ───────────────────────────────────────────────────────────
function CountdownCard({ target }: { target: string }) {
  const cd = useCountdown(target);
  if (!cd) return null;
  const units = [
    { label: "Days", val: cd.d },
    { label: "Hrs", val: cd.h },
    { label: "Min", val: cd.m },
    { label: "Sec", val: cd.s },
  ];
  return (
    <div className="flex justify-center gap-3">
      {units.map(({ label, val }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] rounded-sm px-3 py-2 min-w-[56px]"
        >
          <span className="text-2xl font-black tabular-nums text-[#191A23]">
            {String(val).padStart(2, "0")}
          </span>
          <span className="text-[8px] font-black uppercase text-neutral-400 tracking-widest">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Image Carousel ───────────────────────────────────────────────────────────
function ImageCarousel({
  images,
}: {
  images: { url: string; publicId: string; order: number }[];
}) {
  const [idx, setIdx] = useState(0);
  const sorted = [...images].sort((a, b) => a.order - b.order);
  return (
    <div className="relative w-full">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#191A23]/10 shadow-lg bg-neutral-100">
        <img
          src={sorted[idx]?.url}
          alt={`Image ${idx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {sorted.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "size-2 rounded-full transition-all",
                i === idx
                  ? "bg-[#191A23] w-4"
                  : "bg-[#191A23]/20 hover:bg-[#191A23]/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Gift Card ────────────────────────────────────────────────────────────────
function GiftCard({
  gift,
  onRedeem,
}: {
  gift: GiftInfo;
  onRedeem: () => void;
}) {
  return (
    <div className="p-5 bg-[#FFF3B0] border-2 border-[#191A23] shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] rounded-sm">
      <div className="flex items-start gap-4">
        <div className="size-12 bg-[#191A23] rounded-sm flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={GiftIcon} size={22} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">
            Special Gift
          </p>
          <p className="text-2xl font-black text-[#191A23] mt-0.5">
            ₦{gift.amountPaid?.toLocaleString()}
          </p>
          {gift.giftMessage && (
            <p className="text-xs text-neutral-500 mt-1 italic">
              &ldquo;{gift.giftMessage}&rdquo;
            </p>
          )}
        </div>
        <button
          onClick={onRedeem}
          disabled={gift.status === "redeemed"}
          className={cn(
            "px-4 py-2 text-[10px] font-black uppercase rounded-sm border-2 border-[#191A23] transition-all shrink-0",
            gift.status === "redeemed"
              ? "bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed"
              : "bg-[#191A23] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
          )}
        >
          {gift.status === "redeemed" ? "Redeemed ✓" : "Redeem"}
        </button>
      </div>
    </div>
  );
}

// ─── Redeem Modal ─────────────────────────────────────────────────────────────
function RedeemModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (details: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
  }) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    bankCode: "058",
    bankName: "GTBank",
  });

  const BANKS = [
    { name: "GTBank", code: "058" },
    { name: "First Bank", code: "011" },
    { name: "Zenith Bank", code: "057" },
    { name: "Access Bank", code: "044" },
    { name: "UBA", code: "033" },
    { name: "Fidelity Bank", code: "070" },
    { name: "Sterling Bank", code: "232" },
    { name: "Polaris Bank", code: "076" },
    { name: "Wema Bank", code: "035" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#191A23]/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border-2 border-[#191A23] shadow-[12px_12px_0px_0px_rgba(25,26,35,1)] rounded-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b-2 border-[#191A23]/10">
          <div>
            <h3 className="text-sm font-black uppercase text-[#191A23]">
              Redeem Your Gift
            </h3>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
              Enter your bank details to receive funds
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-sm border border-[#191A23]/10 hover:bg-neutral-50 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="p-5 space-y-4"
        >
          {[
            {
              id: "accountName",
              label: "Account Name",
              type: "text",
              placeholder: "Full name on account",
            },
            {
              id: "accountNumber",
              label: "Account Number",
              type: "text",
              placeholder: "10-digit account number",
              maxLength: 10,
            },
          ].map(({ id, label, type, placeholder, maxLength }) => (
            <div key={id} className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">
                {label}
              </label>
              <input
                type={type}
                required
                maxLength={maxLength}
                value={(form as any)[id]}
                onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                placeholder={placeholder}
                className="w-full p-3 border-2 border-[#191A23] rounded-sm focus:outline-none text-sm font-medium shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">
              Bank
            </label>
            <select
              value={form.bankName}
              onChange={(e) => {
                const bank = BANKS.find((b) => b.name === e.target.value);
                setForm({
                  ...form,
                  bankName: e.target.value,
                  bankCode: bank?.code ?? "058",
                });
              }}
              className="w-full p-3 border-2 border-[#191A23] rounded-sm focus:outline-none text-sm font-medium bg-white appearance-none shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
            >
              {BANKS.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#191A23] text-white text-xs font-black uppercase tracking-widest rounded-sm border-b-4 border-black hover:-translate-y-1 active:border-b-0 active:translate-y-0 transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? "Processing…" : "Confirm Redemption"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PublicWebsitePage() {
  const { slug } = useParams();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (slug) fetchWebsite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchWebsite = async () => {
    setLoading(true);
    try {
      const res = await getLiveWebsite(slug as string);
      if (res.success && res.data) {
        setWebsite(res.data.website);
        // Preload reaction from existing data
        if (res.data.website.reaction?.emoji) {
          setReaction(res.data.website.reaction.emoji);
        }
      } else if ((res as any).status === 410) {
        setExpired(true);
      } else {
        toast.error(res.message || "Website not found");
      }
    } catch (error) {
      console.error("Fetch website error:", error);
      toast.error("Failed to load website");
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (emoji: string) => {
    if (reaction === emoji) return;
    setReaction(emoji);
    try {
      await submitReaction(slug as string, emoji);
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setIsSubmittingReply(true);
    try {
      const res = await submitReply(slug as string, reply);
      if (res.success) {
        toast.success("Reply sent! 💌");
        setReply("");
        setReplySent(true);
      }
    } catch (error) {
      console.error("Reply error:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleRedeem = async (details: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
  }) => {
    const giftId = website?.giftIds?.[0]?._id;
    if (!giftId) return;
    setIsRedeeming(true);
    try {
      const res = await redeemGift(giftId, { bankDetails: details });
      if (res.success) {
        toast.success("Gift redeemed successfully! 🎉");
        setShowRedeemModal(false);
        fetchWebsite();
      } else {
        toast.error(res.message || "Redemption failed");
      }
    } catch (error) {
      console.error("Redemption error:", error);
      toast.error("An error occurred during redemption");
    } finally {
      setIsRedeeming(false);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (loading) return <LoadingScreen />;
  if (expired) return <NotFoundScreen expired />;
  if (!website) return <NotFoundScreen />;

  // Theme
  const primaryColor = website.primaryColor ?? "#191A23";
  const font = website.font ?? "Inter";

  // Accent bg (light version of primary, just use opacity)
  const accentBg = primaryColor + "18";

  const activeGift = website.giftIds?.find(
    (g) => g.status !== "redeemed",
  ) ?? website.giftIds?.[0];

  return (
    <div
      className="min-h-screen bg-[#F3F3F3] py-8 px-4 font-space"
      style={{ fontFamily: font }}
    >
      {/* Background music */}
      {website.musicUrl && (
        <audio ref={audioRef} src={website.musicUrl} loop />
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        {/* ── Hero card ── */}
        <div
          className="rounded-sm border-2 border-[#191A23] shadow-[12px_12px_0px_0px_rgba(25,26,35,1)] overflow-hidden"
          style={{ background: primaryColor }}
        >
          {/* Occasion badge */}
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <HugeiconsIcon icon={SparklesIcon} size={12} color="white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {website.occasion}
              </span>
            </div>

            {/* Music toggle */}
            {website.musicUrl && (
              <button
                onClick={toggleMusic}
                className="size-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <HugeiconsIcon
                  icon={MusicNote01Icon}
                  size={16}
                  color="white"
                  className={isPlaying ? "animate-bounce" : ""}
                />
              </button>
            )}
          </div>

          {/* Recipient name */}
          <div className="px-6 pb-8 pt-3">
            <h1
              className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter"
              style={{ fontFamily: font }}
            >
              Hey, {website.recipientName}! 🎉
            </h1>
            <div className="mt-2 flex items-center gap-2 text-white/60">
              <HugeiconsIcon icon={FavouriteIcon} size={12} color="white" />
              <span className="text-[10px] font-medium">
                Someone special made this for you
              </span>
            </div>
          </div>

          {/* Curved white bottom */}
          <div className="h-6 bg-white rounded-t-[3rem]" />
        </div>

        {/* ── Images carousel ── */}
        {website.images && website.images.length > 0 && (
          <div className="bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] rounded-sm p-5">
            <ImageCarousel images={website.images} />
          </div>
        )}

        {/* ── Countdown ── */}
        {website.countdownDate && (
          <div className="bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] rounded-sm p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-neutral-400">
              <HugeiconsIcon icon={Time01Icon} size={14} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Countdown
              </p>
            </div>
            <CountdownCard target={website.countdownDate} />
          </div>
        )}

        {/* ── Message ── */}
        {website.message && (
          <div className="bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] rounded-sm p-6 md:p-8 relative overflow-hidden">
            {/* Decorative quote mark */}
            <div
              className="absolute -top-4 -left-2 text-[120px] font-black leading-none select-none pointer-events-none opacity-5"
              style={{ color: primaryColor }}
            >
              &ldquo;
            </div>
            <p
              className="text-lg md:text-xl font-medium leading-relaxed text-[#191A23] relative z-10"
              style={{ fontFamily: font }}
            >
              {website.message}
            </p>
          </div>
        )}

        {/* ── Music track info ── */}
        {website.musicTrack && (
          <div
            className="border-2 border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] rounded-sm p-4 flex items-center gap-4"
            style={{ background: accentBg }}
          >
            <div
              className="size-12 rounded-sm flex items-center justify-center shrink-0 border-2 border-[#191A23]"
              style={{ background: primaryColor }}
            >
              <HugeiconsIcon icon={MusicNote01Icon} size={20} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">
                Background Track
              </p>
              <p
                className="text-sm font-black text-[#191A23] truncate"
                style={{ fontFamily: font }}
              >
                {website.musicTrack}
              </p>
            </div>
            {website.musicUrl && (
              <button
                onClick={toggleMusic}
                className="px-3 py-1.5 border-2 border-[#191A23] rounded-sm text-[9px] font-black uppercase bg-white hover:bg-neutral-50 transition-colors shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            )}
          </div>
        )}

        {/* ── Gift ── */}
        {activeGift && (
          <GiftCard gift={activeGift} onRedeem={() => setShowRedeemModal(true)} />
        )}

        {/* ── Reactions ── */}
        <div className="bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] rounded-sm p-6 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            How does this make you feel?
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {["❤️", "🎉", "🔥", "🥹", "🙌", "😍", "🫶"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={cn(
                  "size-14 text-2xl flex items-center justify-center rounded-sm border-2 transition-all",
                  reaction === emoji
                    ? "border-[#191A23] bg-[#191A23] scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] -translate-y-1"
                    : "border-[#191A23]/20 bg-white hover:border-[#191A23] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1",
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
          {reaction && (
            <p className="text-[10px] font-black uppercase text-neutral-400 animate-in fade-in">
              You reacted with {reaction}
            </p>
          )}
        </div>

        {/* ── Reply ── */}
        <div className="bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] rounded-sm p-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Leave a Reply
          </p>
          {replySent ? (
            <div className="flex items-center gap-3 p-4 bg-[#B4F8C8] border-2 border-[#191A23] rounded-sm shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]">
              <HugeiconsIcon icon={Tick01Icon} size={20} />
              <p className="text-sm font-black text-[#191A23]">
                Your reply was sent! 💌
              </p>
            </div>
          ) : (
            <form onSubmit={handleReply} className="relative">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a heartfelt thank you…"
                className="w-full p-4 pb-14 border-2 border-[#191A23] rounded-sm focus:outline-none shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] min-h-[120px] text-sm font-medium resize-none"
                style={{ fontFamily: font }}
              />
              <button
                type="submit"
                disabled={isSubmittingReply || !reply.trim()}
                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-[#191A23] text-white rounded-sm text-[10px] font-black uppercase border-2 border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40"
              >
                <HugeiconsIcon icon={SentIcon} size={14} />
                Send
              </button>
            </form>
          )}
        </div>

        {/* ── Password protected notice ── */}
        {website.isPasswordProtected && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-sm">
            <HugeiconsIcon icon={LockPasswordIcon} size={16} className="text-amber-600" />
            <p className="text-xs font-bold text-amber-700">
              This website is password-protected.
            </p>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="text-center py-4 space-y-1">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <HugeiconsIcon icon={RocketIcon} size={12} className="text-[#191A23]" />
            <p className="text-[9px] font-black uppercase tracking-widest text-[#191A23]">
              Made with love via WishCube
            </p>
          </div>
          <Link
            href="/"
            className="text-[9px] text-neutral-400 font-medium underline hover:text-[#191A23] transition-colors"
          >
            Create your own →
          </Link>
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <RedeemModal
          onClose={() => setShowRedeemModal(false)}
          onSubmit={handleRedeem}
          isLoading={isRedeeming}
        />
      )}
    </div>
  );
}
