/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getLiveWebsite, submitReaction, submitReply } from "@/lib/websites";
import { redeemGift } from "@/lib/gifts";
import { getBanks } from "@/lib/vendor";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mic01Icon,
  MusicNote01Icon,
  GiftIcon,
  Time01Icon,
  Cancel01Icon,
  Tick01Icon,
  SentIcon,
  FavouriteIcon,
  CameraIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Loading03Icon,
  RocketIcon,
  SparklesIcon,
  StopIcon,
  LockPasswordIcon,
  PlayCircleIcon,
} from "@hugeicons/core-free-icons";

interface ProductSnapshot {
  name: string;
  price: number;
  imageUrl?: string;
  storeName?: string;
}

interface GiftInfo {
  _id: string;
  type: string;
  amountPaid: number;
  currency: string;
  giftMessage?: string | null;
  status: string;
  escrowStatus?: string;
  expiresAt?: string;
  redeemToken?: string;
  productSnapshot?: ProductSnapshot | null;
  productId?: any;
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
  musicTrack?: string | null;
  musicUrl?: string | null;
  theme?: string;
  font?: string;
  primaryColor?: string;
  countdownDate?: string | null;
  isPasswordProtected?: boolean;
  password?: string | null; // only present in API response when protected
  giftIds?: GiftInfo[];
  status: string;
  slug?: string;
  publicUrl?: string;
  views?: number;
  reaction?: { emoji?: string | null };
  recipientReply?: { message?: string | null; repliedAt?: string | null };
  expiresAt?: string;
}

function PasswordGate({
  accent,
  font,
  recipientName,
  hasError,
  onUnlock,
}: {
  accent: string;
  font: string;
  recipientName: string;
  hasError: boolean;
  onUnlock: (input: string) => void;
}) {
  const [input, setInput] = useState("");

  const attempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onUnlock(input.trim());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${accent}18 0%, white 60%)`,
        fontFamily: `'${font}', 'Inter', sans-serif`,
      }}
    >
      <div className="w-full max-w-sm space-y-6">
        {/* Lock icon */}
        <div className="text-center space-y-3">
          <div
            className="size-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: accent }}
          >
            <HugeiconsIcon icon={LockPasswordIcon} size={28} color="white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-slate-800"
              style={{ fontFamily: font }}
            >
              Private Page
            </h1>
            <p
              className="text-sm text-slate-500 mt-1"
              style={{ fontFamily: font }}
            >
              {recipientName}&apos;s WishCube is password-protected.
              <br />
              Enter the password to continue.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={attempt}
          className={cn(
            "bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 transition-all",
            hasError && "animate-bounce",
          )}
        >
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-slate-600"
              style={{ fontFamily: font }}
            >
              Password
            </label>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter password…"
              autoFocus
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
                hasError
                  ? "border-red-300 bg-red-50 focus:ring-red-200"
                  : "border-slate-200 focus:ring-opacity-30",
              )}
              style={
                {
                  fontFamily: font,
                  "--tw-ring-color": accent + "50",
                } as React.CSSProperties
              }
            />
            {hasError && (
              <p
                className="text-xs text-red-500 font-medium"
                style={{ fontFamily: font }}
              >
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: accent, fontFamily: font }}
          >
            <HugeiconsIcon icon={LockPasswordIcon} size={14} color="white" />
            Unlock
          </button>
        </form>

        <p
          className="text-center text-xs text-slate-400"
          style={{ fontFamily: font }}
        >
          Made with ♥ via{" "}
          <Link href="/" className="font-semibold" style={{ color: accent }}>
            WishCube
          </Link>
        </p>
      </div>
    </div>
  );
}

function useDynamicFont(font: string | undefined) {
  useEffect(() => {
    if (!font || font === "Inter") return;
    const id = `gfont-${font.replace(/\s/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [font]);
}

function useCountdown(target?: string | null) {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    if (!target) return;
    const tick = () => setDiff(new Date(target).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff === null) return null;
  if (diff <= 0) return { past: true, d: 0, h: 0, m: 0, s: 0 };
  const s = Math.floor(diff / 1000);
  return {
    past: false,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function renderMessage(text: string) {
  return text.split("\n").map((line, li, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return (
      <React.Fragment key={li}>
        {parts.map((part, pi) => {
          if (part.startsWith("**") && part.endsWith("**"))
            return <strong key={pi}>{part.slice(2, -2)}</strong>;
          if (part.startsWith("*") && part.endsWith("*"))
            return <em key={pi}>{part.slice(1, -1)}</em>;
          return <span key={pi}>{part}</span>;
        })}
        {li < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 gap-5">
      <div className="relative size-16">
        <div className="absolute inset-0 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
          <HugeiconsIcon icon={RocketIcon} size={18} color="#6366f1" />
        </div>
      </div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">
        Opening your Wishcube…
      </p>
    </div>
  );
}

function ErrorScreen({ expired = false }: { expired?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="text-center space-y-5 p-10 bg-white rounded-3xl shadow-xl max-w-sm w-full">
        <div className="size-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
          <HugeiconsIcon
            icon={expired ? Time01Icon : SparklesIcon}
            size={28}
            color="#94a3b8"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {expired ? "This page has expired" : "Page not found"}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {expired
              ? "The link is no longer active."
              : "This link is incorrect or has been removed."}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
        >
          Create your own
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" />
        </Link>
      </div>
    </div>
  );
}

function CountdownCard({
  target,
  accent,
  font,
}: {
  target: string;
  accent: string;
  font: string;
}) {
  const cd = useCountdown(target);
  if (!cd) return null;

  if (cd.past) {
    return (
      <div
        className="rounded-2xl p-5 text-center space-y-4"
        style={{ background: accent + "10", border: `1px solid ${accent}30` }}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <HugeiconsIcon
            icon={SparklesIcon}
            size={40}
            color={accent}
            className="animate-bounce"
          />
          <h3
            className="text-2xl font-black uppercase tracking-widest mt-2"
            style={{ color: accent, fontFamily: font }}
          >
            It&apos;s Today!
          </h3>
          <p
            className="text-sm font-medium text-slate-500"
            style={{ fontFamily: font }}
          >
            The special day has finally arrived 🎊
          </p>
        </div>
      </div>
    );
  }

  const units = [
    { label: "Days", val: cd.d },
    { label: "Hrs", val: cd.h },
    { label: "Min", val: cd.m },
    { label: "Sec", val: cd.s },
  ];
  return (
    <div
      className="rounded-2xl p-5 text-center space-y-4"
      style={{ background: accent + "10", border: `1px solid ${accent}30` }}
    >
      <div className="flex items-center justify-center gap-2">
        <HugeiconsIcon icon={Time01Icon} size={14} color={accent} />
        <p
          className="text-xs font-semibold text-slate-500 uppercase tracking-widest"
          style={{ fontFamily: font }}
        >
          Counting down to your special day
        </p>
      </div>
      <div className="flex justify-center gap-3">
        {units.map(({ label, val }) => (
          <div
            key={label}
            className="flex flex-col items-center bg-white rounded-xl px-3 py-2.5 min-w-[60px] shadow-sm"
          >
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: accent, fontFamily: font }}
            >
              {String(val).padStart(2, "0")}
            </span>
            <span
              className="text-[9px] font-semibold uppercase text-slate-400 tracking-wider mt-0.5"
              style={{ fontFamily: font }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageCarousel({
  images,
  accent,
}: {
  images: { url: string; publicId: string; order: number }[];
  accent: string;
}) {
  const [idx, setIdx] = useState(0);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
        <img
          src={sorted[idx]?.url}
          alt={`Memory ${idx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {sorted.length > 1 && (
        <>
          <div className="flex justify-center gap-1.5">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? "24px" : "6px",
                  background: i === idx ? accent : "#CBD5E1",
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setIdx((i) => (i - 1 + sorted.length) % sorted.length)
              }
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={13}
                color="currentColor"
              />
              Prev
            </button>
            <span className="text-xs text-slate-400">
              {idx + 1} / {sorted.length}
            </span>
            <button
              onClick={() => setIdx((i) => (i + 1) % sorted.length)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
            >
              Next
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={13}
                color="currentColor"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function VoiceMessagePlayer({
  url,
  accent,
  font,
}: {
  url: string;
  accent: string;
  font: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => {
      setElapsed(el.currentTime);
      setProgress(el.duration ? el.currentTime / el.duration : 0);
    };
    const onEnded = () => setPlaying(false);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * duration;
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: accent + "10" }}
      >
        <div
          className="size-7 rounded-lg flex items-center justify-center"
          style={{ background: accent + "20" }}
        >
          <HugeiconsIcon icon={Mic01Icon} size={14} color={accent} />
        </div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: accent, fontFamily: font }}
        >
          Voice Message
        </p>
        <p
          className="ml-auto text-[10px] text-slate-400"
          style={{ fontFamily: font }}
        >
          from the sender
        </p>
      </div>

      {/* Player body */}
      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center gap-4">
          {/* Play / pause */}
          <button
            onClick={toggle}
            className="size-12 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{ background: accent }}
          >
            <HugeiconsIcon
              icon={playing ? StopIcon : PlayCircleIcon}
              size={20}
              color="white"
            />
          </button>

          {/* Waveform bars (animated while playing) */}
          <div className="flex items-center gap-[3px] flex-1 h-8">
            {Array.from({ length: 28 }).map((_, i) => {
              const h = [
                60, 40, 80, 50, 90, 35, 70, 55, 85, 45, 75, 50, 65, 80, 40, 95,
                55, 70, 45, 85, 50, 60, 75, 40, 90, 55, 65, 45,
              ][i];
              const filled = progress * 28 > i;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-full transition-all",
                    playing && filled ? "animate-pulse" : "",
                  )}
                  style={{
                    width: "3px",
                    height: `${h}%`,
                    background: filled ? accent : "#E2E8F0",
                    animationDelay: `${i * 40}ms`,
                  }}
                />
              );
            })}
          </div>

          {/* Time */}
          <span
            className="text-xs text-slate-400 tabular-nums shrink-0"
            style={{ fontFamily: font }}
          >
            {fmt(elapsed)}
            {duration > 0 && (
              <span className="text-slate-300"> / {fmt(duration)}</span>
            )}
          </span>
        </div>

        {/* Seekable progress track */}
        <div
          className="w-full h-1.5 bg-slate-100 rounded-full cursor-pointer overflow-hidden"
          onClick={seek}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%`, background: accent }}
          />
        </div>

        <p
          className="text-xs text-slate-400 text-center"
          style={{ fontFamily: font }}
        >
          Tap play to hear a personal voice message 🎙️
        </p>
      </div>
    </div>
  );
}

function GiftCard({
  gift,
  accent,
  font,
  onRedeem,
}: {
  gift: GiftInfo;
  accent: string;
  font: string;
  onRedeem: () => void;
}) {
  const img = gift.productSnapshot?.imageUrl;
  const name =
    gift.productSnapshot?.name ||
    (gift.type === "digital" ? "Digital Gift" : "Physical Gift");
  const storeName = gift.productSnapshot?.storeName || "WishCube Marketplace";
  const isRedeemed = gift.status === "redeemed";

  if (isRedeemed) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
        style={{ borderColor: accent + "25", background: accent + "06" }}
      >
        {img ? (
          <img
            src={img}
            alt={name}
            className="size-10 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div
            className="size-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: accent + "15" }}
          >
            <HugeiconsIcon icon={GiftIcon} size={18} color={accent} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold text-slate-700 truncate"
            style={{ fontFamily: font }}
          >
            {name}
          </p>
          <p
            className="text-xs text-slate-400 truncate"
            style={{ fontFamily: font }}
          >
            from {storeName}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 bg-emerald-50 text-emerald-600">
          <HugeiconsIcon icon={Tick01Icon} size={10} color="#16a34a" />
          Redeemed
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{ border: `1px solid ${accent}30` }}
    >
      {img ? (
        <div className="h-44 overflow-hidden">
          <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className="h-28 flex items-center justify-center"
          style={{ background: accent + "15" }}
        >
          <HugeiconsIcon
            icon={GiftIcon}
            size={40}
            color={accent}
            strokeWidth={1.5}
          />
        </div>
      )}

      <div
        className="p-5"
        style={{
          background: `linear-gradient(135deg, ${accent}06, ${accent}14)`,
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
          style={{ background: accent + "20", color: accent, fontFamily: font }}
        >
          <HugeiconsIcon icon={GiftIcon} size={10} color={accent} />A gift for
          you
        </span>

        <p
          className="text-lg font-bold text-slate-800 leading-tight"
          style={{ fontFamily: font }}
        >
          {name}
        </p>
        <p
          className="text-sm text-slate-500 mt-0.5"
          style={{ fontFamily: font }}
        >
          from {storeName}
        </p>
        <p
          className="text-2xl font-bold mt-3"
          style={{ color: accent, fontFamily: font }}
        >
          ₦{gift.amountPaid?.toLocaleString()}
        </p>

        {gift.giftMessage && (
          <p
            className="text-sm text-slate-500 mt-2 italic leading-relaxed"
            style={{ fontFamily: font }}
          >
            &ldquo;{gift.giftMessage}&rdquo;
          </p>
        )}

        <button
          onClick={onRedeem}
          className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
          style={{ background: accent, fontFamily: font }}
        >
          Redeem My Gift
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="white" />
        </button>

        {gift.expiresAt && (
          <p
            className="text-center text-[11px] text-slate-400 mt-2"
            style={{ fontFamily: font }}
          >
            Expires{" "}
            {new Date(gift.expiresAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

type BankDetails = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
};
type DeliveryAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};
type RedeemPayload =
  | { bankDetails: BankDetails }
  | { deliveryAddress: DeliveryAddress };

function RedeemModal({
  accent,
  font,
  giftType,
  onClose,
  onSubmit,
  isLoading,
}: {
  accent: string;
  font: string;
  giftType: string;
  onClose: () => void;
  onSubmit: (payload: RedeemPayload) => void;
  isLoading: boolean;
}) {
  const isPhysical = giftType === "physical";

  const [bank, setBank] = useState<BankDetails>({
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
  });

  const [banksList, setBanksList] = useState<{ name: string; code: string }[]>(
    [],
  );
  const [loadingBanks, setLoadingBanks] = useState(!isPhysical);

  useEffect(() => {
    if (!isPhysical) {
      getBanks()
        .then((res) => {
          if (res.success && res.data?.banks) {
            const fetchedBanks = res.data.banks;
            setBanksList(fetchedBanks);
            if (fetchedBanks.length > 0) {
              setBank((prev) => ({
                ...prev,
                bankName: prev.bankName || fetchedBanks[0].name,
                bankCode: prev.bankCode || fetchedBanks[0].code,
              }));
            }
          }
        })
        .finally(() => setLoadingBanks(false));
    }
  }, [isPhysical]);

  const [delivery, setDelivery] = useState<DeliveryAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhysical) {
      onSubmit({ deliveryAddress: delivery });
    } else {
      onSubmit({ bankDetails: bank });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: font }}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="size-9 rounded-xl flex items-center justify-center"
              style={{ background: accent + "15" }}
            >
              <HugeiconsIcon icon={GiftIcon} size={18} color={accent} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Redeem Your Gift
              </h3>
              <p className="text-xs text-slate-400">
                {isPhysical
                  ? "Enter your delivery address"
                  : "Enter your bank details to receive funds"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isPhysical ? (
            <>
              {(
                [
                  {
                    id: "fullName",
                    label: "Full Name",
                    placeholder: "Recipient's full name",
                  },
                  {
                    id: "phone",
                    label: "Phone Number",
                    placeholder: "08012345678",
                  },
                  {
                    id: "address",
                    label: "Street Address",
                    placeholder: "House number, street name",
                  },
                  { id: "city", label: "City", placeholder: "City" },
                  { id: "state", label: "State", placeholder: "State" },
                ] as {
                  id: keyof DeliveryAddress;
                  label: string;
                  placeholder: string;
                }[]
              ).map(({ id, label, placeholder }) => (
                <div key={id} className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-slate-600"
                    style={{ fontFamily: font }}
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    required
                    value={delivery[id]}
                    onChange={(e) =>
                      setDelivery({ ...delivery, [id]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm transition-all"
                    style={{ fontFamily: font }}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {(
                [
                  {
                    id: "accountName",
                    label: "Account Name",
                    type: "text",
                    placeholder: "Full name as on account",
                  },
                  {
                    id: "accountNumber",
                    label: "Account Number",
                    type: "text",
                    placeholder: "10-digit number",
                    maxLength: 10,
                  },
                ] as {
                  id: keyof BankDetails;
                  label: string;
                  type: string;
                  placeholder: string;
                  maxLength?: number;
                }[]
              ).map(({ id, label, type, placeholder, maxLength }) => (
                <div key={id} className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-slate-600"
                    style={{ fontFamily: font }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    maxLength={maxLength}
                    value={bank[id]}
                    onChange={(e) => setBank({ ...bank, [id]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm transition-all"
                    style={{ fontFamily: font }}
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-slate-600"
                  style={{ fontFamily: font }}
                >
                  Bank
                </label>
                <select
                  value={bank.bankName}
                  onChange={(e) => {
                    const b = banksList.find((x) => x.name === e.target.value);
                    setBank({
                      ...bank,
                      bankName: e.target.value,
                      bankCode: b?.code ?? "",
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none text-sm bg-white appearance-none cursor-pointer"
                  style={{ fontFamily: font }}
                >
                  {loadingBanks ? (
                    <option>Loading banks...</option>
                  ) : (
                    banksList.map((b) => (
                      <option key={b.code} value={b.name}>
                        {b.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: accent, fontFamily: font }}
          >
            {isLoading ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={16}
                  color="white"
                  className="animate-spin"
                />
                Processing…
              </>
            ) : (
              <>
                {isPhysical ? "Confirm Delivery Address" : "Confirm Redemption"}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  color="white"
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  accent,
  font,
}: {
  icon: any;
  label: string;
  accent: string;
  font: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div
        className="size-6 rounded-lg flex items-center justify-center"
        style={{ background: accent + "15" }}
      >
        <HugeiconsIcon icon={icon} size={12} color={accent} />
      </div>
      <p
        className="text-xs font-semibold uppercase tracking-wider text-slate-400"
        style={{ fontFamily: font }}
      >
        {label}
      </p>
    </div>
  );
}

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
  const [unlocked, setUnlocked] = useState(false);
  const [pwError, setPwError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const font = website?.font || "Inter";
  useDynamicFont(website?.font);

  const fetchWebsite = async () => {
    setLoading(true);
    try {
      const res = await getLiveWebsite(slug as string);
      console.log(res);
      if (res.success && res.data) {
        setWebsite(res.data.website);
        if (res.data.website.reaction?.emoji) {
          setReaction(res.data.website.reaction.emoji);
        }
      } else if ((res as any).status === 410) {
        setExpired(true);
      } else {
        toast.error(res.message || "Website not found");
      }
    } catch {
      toast.error("Failed to load website");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchWebsite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleReaction = async (emoji: string) => {
    if (reaction === emoji) return;
    setReaction(emoji);
    try {
      await submitReaction(slug as string, emoji);
    } catch {
      /* noop */
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setIsSubmittingReply(true);
    try {
      const res = await submitReply(slug as string, reply);
      if (res.success) {
        toast.success("Reply sent!");
        setReply("");
        setReplySent(true);
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleRedeem = async (payload: RedeemPayload) => {
    const token = activeGift?.redeemToken;
    if (!token) {
      toast.error("Missing redeem token — cannot process this gift.");
      return;
    }
    setIsRedeeming(true);
    try {
      const res = await redeemGift(token, payload);
      if (res.success) {
        toast.success("Gift redeemed! 🎉");
        setShowRedeemModal(false);
        fetchWebsite();
      } else {
        toast.error(res.message || "Redemption failed");
      }
    } catch {
      toast.error("An error occurred");
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
  if (expired) return <ErrorScreen expired />;
  if (!website) return <ErrorScreen />;

  const accent = website.primaryColor || "#6366f1";

  // Password gate: only block if protected AND a password value exists
  const needsPassword = website.isPasswordProtected && !!website.password;
  if (needsPassword && !unlocked) {
    return (
      <PasswordGate
        accent={accent}
        font={font}
        recipientName={website.recipientName}
        hasError={pwError}
        onUnlock={(input) => {
          if (input === website.password) {
            setUnlocked(true);
            setPwError(false);
          } else {
            setPwError(true);
            setTimeout(() => setPwError(false), 700);
          }
        }}
      />
    );
  }

  const activeGift =
    website.giftIds?.find((g) => g.status !== "redeemed") ??
    website.giftIds?.[0];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
      style={{ fontFamily: `'${font}', 'Inter', sans-serif` }}
    >
      {website.musicUrl && <audio ref={audioRef} src={website.musicUrl} loop />}

      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}ee 0%, ${accent}bb 100%)`,
          minHeight: "280px",
        }}
      >
        {/* Decorative backdrop circles */}
        <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/10" />

        <div className="relative max-w-xl mx-auto px-6 pt-10 pb-16">
          {/* Top row */}
          <div className="flex items-center justify-between mb-8">
            <span
              className="inline-flex items-center capitalize gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ fontFamily: font }}
            >
              <HugeiconsIcon icon={SparklesIcon} size={11} color="white" />
              {website.occasion}
            </span>

            {website.musicUrl && (
              <button
                onClick={toggleMusic}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                style={{ fontFamily: font }}
              >
                <HugeiconsIcon
                  icon={isPlaying ? StopIcon : MusicNote01Icon}
                  size={12}
                  color="white"
                />
                {isPlaying ? "Pause music" : "Play music"}
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <p
              className="text-white/70 text-sm font-medium mb-1"
              style={{ fontFamily: font }}
            >
              A special message for
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: font }}
            >
              {website.recipientName}
            </h1>
            <div
              className="flex items-center gap-1.5 mt-3 text-white/60"
              style={{ fontFamily: font }}
            >
              <HugeiconsIcon icon={FavouriteIcon} size={12} color="white" />
              <p className="text-sm">
                Someone who cares deeply made this just for you
              </p>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full"
          >
            <path
              d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-16 -mt-2 space-y-5">
        {/* Images */}
        {website.images && website.images.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
            <SectionLabel
              icon={CameraIcon}
              label="Memories"
              accent={accent}
              font={font}
            />
            <ImageCarousel images={website.images} accent={accent} />
          </div>
        )}

        {/* Voice message */}
        {website.voiceMessageUrl && (
          <VoiceMessagePlayer
            url={website.voiceMessageUrl}
            accent={accent}
            font={font}
          />
        )}

        {/* Countdown */}
        {website.countdownDate && (
          <CountdownCard
            target={website.countdownDate}
            accent={accent}
            font={font}
          />
        )}

        {/* Message */}
        {website.message && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative overflow-hidden">
            <div
              className="absolute -top-2 -left-1 text-[100px] font-serif leading-none opacity-[0.04] select-none pointer-events-none"
              style={{ color: accent }}
            >
              &ldquo;
            </div>
            <SectionLabel
              icon={SparklesIcon}
              label="A message for you"
              accent={accent}
              font={font}
            />
            <div
              className="text-[15px] leading-relaxed text-slate-700 relative z-10"
              style={{ fontFamily: font }}
            >
              {renderMessage(website.message)}
            </div>
          </div>
        )}

        {/* Music track */}
        {website.musicTrack && (
          <div
            className="flex items-center gap-4 p-4 rounded-2xl border"
            style={{ background: accent + "08", borderColor: accent + "25" }}
          >
            <div
              className="size-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: accent }}
            >
              <HugeiconsIcon icon={MusicNote01Icon} size={20} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest text-slate-400"
                style={{ fontFamily: font }}
              >
                Background Track
              </p>
              <p
                className="text-sm font-semibold text-slate-800 truncate"
                style={{ fontFamily: font }}
              >
                {website.musicTrack}
              </p>
            </div>
            {website.musicUrl && (
              <button
                onClick={toggleMusic}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: accent, fontFamily: font }}
              >
                <HugeiconsIcon
                  icon={isPlaying ? StopIcon : MusicNote01Icon}
                  size={12}
                  color="white"
                />
                {isPlaying ? "Pause" : "Play"}
              </button>
            )}
          </div>
        )}

        {/* Gift */}
        {activeGift && (
          <GiftCard
            gift={activeGift}
            accent={accent}
            font={font}
            onRedeem={() => setShowRedeemModal(true)}
          />
        )}

        {/* Reactions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 text-center space-y-4">
          <div>
            <p
              className="text-base font-semibold text-slate-800"
              style={{ fontFamily: font }}
            >
              How does this make you feel?
            </p>
            <p
              className="text-xs text-slate-400 mt-0.5"
              style={{ fontFamily: font }}
            >
              Tap an emoji to react
            </p>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {["❤️", "🎉", "🔥", "🥹", "🙌", "😍", "🫶"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={cn(
                  "size-12 text-xl flex items-center justify-center rounded-2xl transition-all duration-200",
                  reaction === emoji
                    ? "scale-110 -translate-y-1 shadow-lg"
                    : "bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5 hover:scale-105",
                )}
                style={
                  reaction === emoji
                    ? {
                        background: accent + "20",
                        outline: `2px solid ${accent}60`,
                      }
                    : {}
                }
              >
                {emoji}
              </button>
            ))}
          </div>
          {reaction && (
            <p
              className="text-sm text-slate-500 animate-in fade-in"
              style={{ fontFamily: font }}
            >
              You reacted with {reaction}
            </p>
          )}
        </div>

        {/* Reply */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-4">
          {/* Already replied (loaded from API) */}
          {website.recipientReply?.message ? (
            <>
              <SectionLabel
                icon={SentIcon}
                label="Your Reply"
                accent={accent}
                font={font}
              />
              <div
                className="rounded-xl p-4 space-y-2"
                style={{
                  background: accent + "0D",
                  border: `1px solid ${accent}25`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: accent }}
                  >
                    <HugeiconsIcon icon={SentIcon} size={14} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm leading-relaxed text-slate-700 whitespace-pre-line"
                      style={{ fontFamily: font }}
                    >
                      {website.recipientReply.message}
                    </p>
                    {website.recipientReply.repliedAt && (
                      <p
                        className="text-[10px] text-slate-400 mt-1"
                        style={{ fontFamily: font }}
                      >
                        Sent{" "}
                        {new Date(
                          website.recipientReply.repliedAt,
                        ).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : replySent ? (
            /* Just sent in this session */
            <>
              <SectionLabel
                icon={SentIcon}
                label="Your Reply"
                accent={accent}
                font={font}
              />
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: accent + "12",
                  border: `1px solid ${accent}30`,
                }}
              >
                <HugeiconsIcon icon={Tick01Icon} size={18} color={accent} />
                <p
                  className="text-sm font-medium text-slate-700"
                  style={{ fontFamily: font }}
                >
                  Your reply was sent successfully!
                </p>
              </div>
            </>
          ) : (
            /* No reply yet — show the form */
            <>
              <SectionLabel
                icon={SentIcon}
                label="Send a Reply"
                accent={accent}
                font={font}
              />
              <form onSubmit={handleReply} className="space-y-3">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a heartfelt thank you…"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 min-h-[100px] text-sm text-slate-700 resize-none transition-all"
                  style={{ fontFamily: font }}
                />
                <button
                  type="submit"
                  disabled={isSubmittingReply || !reply.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 ml-auto"
                  style={{ background: accent, fontFamily: font }}
                >
                  {isSubmittingReply ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        size={14}
                        color="white"
                        className="animate-spin"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={SentIcon} size={14} color="white" />
                      Send Reply
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-6 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-slate-300">
            <HugeiconsIcon icon={RocketIcon} size={12} color="currentColor" />
            <p className="text-xs" style={{ fontFamily: font }}>
              Made with{" "}
              <HugeiconsIcon
                icon={FavouriteIcon}
                size={10}
                color={accent}
                className="inline-block relative -top-px"
              />{" "}
              via{" "}
              <Link
                href="/"
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: accent }}
              >
                WishCube
              </Link>
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            style={{ fontFamily: font }}
          >
            Create your own celebration page
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={11}
              color="currentColor"
            />
          </Link>
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && activeGift && (
        <RedeemModal
          accent={accent}
          font={font}
          giftType={activeGift.type}
          onClose={() => setShowRedeemModal(false)}
          onSubmit={handleRedeem}
          isLoading={isRedeeming}
        />
      )}
    </div>
  );
}
