/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getLiveWebsite, submitReaction, submitReply } from "@/lib/websites";
import { redeemGift, trackOrder, confirmDelivery } from "@/lib/gifts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MusicNote01Icon,
  SentIcon,
  FavouriteIcon,
  CameraIcon,
  ArrowRight01Icon,
  SparklesIcon,
  StopIcon,
  RocketIcon,
  Tick01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

import { WebsiteData, GiftInfo, RedeemPayload } from "./_components/types";
import { useDynamicFont, renderMessage } from "./_components/utils";
import { PasswordGate } from "./_components/PasswordGate";
import { LoadingScreen } from "./_components/LoadingScreen";
import { ErrorScreen } from "./_components/ErrorScreen";
import { CountdownCard } from "./_components/CountdownCard";
import { ImageCarousel } from "./_components/ImageCarousel";
import { VoiceMessagePlayer } from "./_components/VoiceMessagePlayer";
import { GiftCard } from "./_components/GiftCard";
import { RedeemModal } from "./_components/RedeemModal";
import { SectionLabel } from "./_components/SectionLabel";
import { TrackingModal } from "./_components/TrackingModal";

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
  const [activeGift, setActiveGift] = useState<GiftInfo | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingGift, setTrackingGift] = useState<GiftInfo | null>(null);
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);
  const [deliveryCode, setDeliveryCode] = useState("");
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

  const handleTrack = async (orderId: string, token: string) => {
    try {
      const res = await trackOrder(orderId, token);
      if (res.success) {
        setTrackingData(res.data);
        setShowTrackingModal(true);
      } else {
        toast.error(res.message || "Failed to load tracking info");
      }
    } catch {
      toast.error("An error occurred fetching tracking info");
    }
  };

  const handleConfirmDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGift?.orderId || !activeGift?.redeemToken || !deliveryCode) return;
    setIsConfirmingDelivery(true);
    try {
      const res = await confirmDelivery(
        activeGift.orderId,
        activeGift.redeemToken,
        deliveryCode,
      );
      if (res.success) {
        toast.success("Delivery confirmed! Thank you. 🎉");
        setShowTrackingModal(false);
        setDeliveryCode("");
        fetchWebsite();
      } else {
        toast.error(res.message || "Invalid delivery code");
      }
    } catch {
      toast.error("Confirmation failed");
    } finally {
      setIsConfirmingDelivery(false);
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

  // Selected via state

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
      style={{ fontFamily: `'${font}', 'Inter', sans-serif` }}
    >
      {website.musicUrl && <audio ref={audioRef} src={website.musicUrl} loop />}

      <div
        className="relative overflow-hidden"
        style={{
          ...(website.layout === "modern" &&
          website.images &&
          website.images.length > 0
            ? {
                backgroundImage: `url('${[...website.images].sort((a, b) => a.order - b.order)[0].url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: `linear-gradient(135deg, ${accent}ee 0%, ${accent}bb 100%)`,
              }),
          minHeight: "280px",
        }}
      >
        {/* Modern overlay */}
        {website.layout === "modern" &&
          website.images &&
          website.images.length > 0 && (
            <div
              className="absolute inset-0"
              style={{ background: `${accent}cc` }}
            />
          )}

        {/* Classic decorative backdrop circles */}
        {website.layout !== "modern" && (
          <>
            <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/10" />
          </>
        )}

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

        {/* Gifts */}
        {website.giftIds && website.giftIds.length > 0 && (
          <div className="space-y-4">
            {website.giftIds.map((gift) => (
              <GiftCard
                key={gift._id}
                gift={gift}
                accent={accent}
                font={font}
                onRedeem={() => {
                  setActiveGift(gift);
                  setShowRedeemModal(true);
                }}
                onTrack={() => {
                  setActiveGift(gift);
                  handleTrack(gift.orderId!, gift.redeemToken!);
                }}
              />
            ))}
          </div>
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

      {showRedeemModal && (
        <RedeemModal
          accent={accent}
          font={font}
          giftType={activeGift?.type || "digital"}
          isLoading={isRedeeming}
          onClose={() => setShowRedeemModal(false)}
          onSubmit={handleRedeem}
        />
      )}

      {showTrackingModal && trackingData && (
        <TrackingModal
          accent={accent}
          font={font}
          tracking={trackingData}
          onClose={() => setShowTrackingModal(false)}
          onConfirm={handleConfirmDelivery}
          isConfirming={isConfirmingDelivery}
          code={deliveryCode}
          setCode={setDeliveryCode}
        />
      )}
    </div>
  );
}
