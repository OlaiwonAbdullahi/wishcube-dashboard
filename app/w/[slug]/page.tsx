/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLiveWebsite, submitReaction, submitReply } from "@/lib/websites";
import { redeemGift } from "@/lib/gifts";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Agreement01Icon,
  RocketIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PublicWebsitePage() {
  const { slug } = useParams();
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankCode: "058", // GTBank default
    bankName: "GTBank",
  });

  useEffect(() => {
    if (slug) {
      fetchWebsite();
    }
  }, [slug]);

  const fetchWebsite = async () => {
    setLoading(true);
    try {
      const res = await getLiveWebsite(slug as string);
      if (res.success && res.data) {
        setWebsite(res.data.website);
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
    try {
      const res = await submitReaction(slug as string, emoji);
      if (res.success) {
        setReaction(emoji);
        toast.success("Reaction sent!");
      }
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
        toast.success("Reply sent!");
        setReply("");
        // Optionally update website state with the new reply
      }
    } catch (error) {
      console.error("Reply error:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.giftId?._id) return;

    setIsRedeeming(true);
    try {
      // In a real flow, we'd have a token. The docs say POST /api/gifts/redeem/:token
      // Let's assume the website.giftId._id is used as a token for now or we fetch it.
      const res = await redeemGift(website.giftId._id, { bankDetails });
      if (res.success) {
        toast.success("Gift redeemed successfully!");
        setShowRedeemModal(false);
        fetchWebsite(); // Refresh to show redeemed status
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="size-16 bg-[#191A23]/10 rounded-full border-2 border-[#191A23]/20" />
          <p className="text-sm font-bold uppercase text-neutral-400">
            Loading your WishCube...
          </p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3]">
        <div className="text-center space-y-4 p-6 bg-white border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] rounded-sm">
          <h1 className="text-2xl font-black uppercase">Website Not Found</h1>
          <p className="text-sm text-neutral-500 font-medium">
            This link might be expired or incorrect.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-[#191A23] text-white text-xs font-bold uppercase rounded-sm border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const theme = website.theme || "classic";
  // Mapping theme names to colors (simplified for now)
  const bgClass = theme.includes("blue")
    ? "bg-blue-50"
    : theme.includes("emerald")
      ? "bg-emerald-50"
      : theme.includes("purple")
        ? "bg-purple-50"
        : "bg-white";

  const primaryTextClass = theme.includes("blue")
    ? "text-blue-600"
    : theme.includes("emerald")
      ? "text-emerald-600"
      : theme.includes("purple")
        ? "text-purple-600"
        : "text-[#191A23]";

  return (
    <div
      className={cn("min-h-screen py-12 px-4 font-space", bgClass)}
      style={{ fontFamily: website.font || "Inter" }}
    >
      <div className="max-w-3xl mx-auto bg-white border-2 border-[#191A23] shadow-[12px_12px_0px_0px_rgba(25,26,35,1)] rounded-sm overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="p-8 border-b-2 border-[#191A23]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B4F8C8] border-2 border-[#191A23] rounded-full shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={16}
                  className="text-[#191A23]"
                />
                <span className="text-xs font-black uppercase tracking-widest">
                  {website.occasion}
                </span>
              </div>
              <h1
                className={cn(
                  "text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase",
                  primaryTextClass,
                )}
              >
                Hey, {website.recipientName}!
              </h1>
            </div>

            {website.images?.[0] && (
              <div className="relative size-48 md:size-56 rounded-full border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] overflow-hidden bg-neutral-100">
                <img
                  src={website.images[0].url}
                  alt="Greeting"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Message Section */}
        <div className="p-8 md:p-12 bg-neutral-50 border-b-2 border-[#191A23]/10 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <HugeiconsIcon
              icon={Agreement01Icon}
              size={32}
              className="mx-auto text-neutral-300"
            />
            <p className="text-xl md:text-2xl font-bold leading-relaxed text-[#191A23]">
              {website.message}
            </p>
          </div>
        </div>

        {/* Gift Section (if any) */}
        {website.giftId && (
          <div className="p-8 bg-[#FFF3B0] border-b-2 border-[#191A23]/10 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#191A23]">
                A Special Gift for You
              </h3>
              <div className="p-6 bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] rounded-sm flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-neutral-400">
                    Value
                  </p>
                  <p className="text-2xl font-black text-[#191A23]">
                    ₦{website.giftId.amount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowRedeemModal(true)}
                  disabled={website.giftId.status === "redeemed"}
                  className={cn(
                    "px-6 py-2 text-xs font-black uppercase rounded-sm border-2 border-[#191A23] transition-all",
                    website.giftId.status === "redeemed"
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed border-neutral-300"
                      : "bg-[#191A23] text-white hover:bg-[#191A23]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none",
                  )}
                >
                  {website.giftId.status === "redeemed"
                    ? "Redeemed"
                    : "Redeem Now"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Redemption Modal */}
        {showRedeemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191A23]/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white border-2 border-[#191A23] shadow-[12px_12px_0px_0px_rgba(25,26,35,1)] rounded-sm overflow-hidden flex flex-col p-6 space-y-6">
              <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#191A23]">
                  Redeem Your Gift
                </h3>
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="text-[#191A23] hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRedeem} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-neutral-400">
                    Account Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bankDetails.accountName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountName: e.target.value,
                      })
                    }
                    placeholder="Enter account name"
                    className="w-full p-3 border-2 border-[#191A23] rounded-sm focus:outline-none focus:ring-0 text-sm font-bold uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-neutral-400">
                    Account Number
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Enter 10-digit account number"
                    className="w-full p-3 border-2 border-[#191A23] rounded-sm focus:outline-none focus:ring-0 text-sm font-bold tracking-widest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-neutral-400">
                    Bank Name
                  </label>
                  <select
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankName: e.target.value,
                        bankCode: e.target.value === "GTBank" ? "058" : "011",
                      })
                    }
                    className="w-full p-3 border-2 border-[#191A23] rounded-sm focus:outline-none focus:ring-0 text-sm font-bold uppercase tracking-wider bg-white appearance-none"
                  >
                    <option value="GTBank">GTBank (058)</option>
                    <option value="FirstBank">FirstBank (011)</option>
                    <option value="Zenith">Zenith Bank (057)</option>
                    <option value="Access">Access Bank (044)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isRedeeming}
                  className="w-full py-4 bg-[#191A23] text-white text-xs font-black uppercase tracking-widest rounded-sm border-b-4 border-black hover:-translate-y-1 active:border-b-0 active:translate-y-0 transition-all disabled:opacity-50"
                >
                  {isRedeeming ? "Processing..." : "Confirm Redemption"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reactions & Reply Section */}
        <div className="p-8 md:p-12 space-y-12">
          {/* Reactions */}
          <div className="text-center space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
              Send a Quick Reaction
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["❤️", "🎉", "🔥", "🥹", "🙌"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={cn(
                    "size-14 text-2xl flex items-center justify-center rounded-sm border-2 border-[#191A23] transition-all",
                    reaction === emoji
                      ? "bg-[#191A23] scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white hover:bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1",
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <div className="max-w-md mx-auto space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 text-center">
              Leave a Reply
            </h3>
            <form onSubmit={handleReply} className="relative">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a thank you message..."
                className="w-full p-4 border-2 border-[#191A23] rounded-sm focus:outline-none focus:ring-0 shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] min-h-[120px] text-sm font-medium"
              />
              <button
                type="submit"
                disabled={isSubmittingReply || !reply.trim()}
                className="absolute bottom-4 right-4 size-10 flex items-center justify-center bg-[#191A23] text-white rounded-sm border-2 border-black hover:scale-110 transition-transform disabled:opacity-50"
              >
                <HugeiconsIcon icon={SentIcon} size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-neutral-100 border-t-2 border-[#191A23]/10 text-center">
          <div className="flex items-center justify-center gap-2">
            <HugeiconsIcon
              icon={RocketIcon}
              size={16}
              className="text-purple-600"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Made with love via{" "}
              <span className="text-[#191A23]">WishCube</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
