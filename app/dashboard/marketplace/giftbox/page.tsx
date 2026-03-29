/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  GiftIcon,
  PackageIcon,
  Globe02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getSentGifts, getUnattachedGifts, Gift } from "@/lib/gifts";

/* ── Status badge ────────────────────────────────────────────────── */
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 border-amber-200 text-amber-700",
  active: "bg-[#B4F8C8]/40 border-green-200 text-green-700",
  redeemed: "bg-[#E0D5FF] border-[#9151FF]/30 text-[#9151FF]",
  expired: "bg-red-50 border-red-200 text-red-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
        STATUS_STYLES[status] || "bg-neutral-100 border-neutral-200 text-neutral-500",
      )}
    >
      {status}
    </span>
  );
}

/* ── Gift card ──────────────────────────────────────────────────── */
function GiftCard({ gift }: { gift: Gift }) {
  const imageUrl =
    gift.productSnapshot?.imageUrl ||
    (gift.productId as any)?.images?.[0]?.url;

  const name =
    gift.productSnapshot?.name ||
    (gift.productId as any)?.name ||
    (gift.type === "digital" ? "Digital Gift" : "Physical Gift");

  const storeName = gift.productSnapshot?.storeName || "WishCube";
  const website = gift.websiteId as any;

  return (
    <div className="rounded-sm border-2 border-[#191A23] border-b-4 bg-white shadow-[3px_3px_0px_0px_rgba(25,26,35,0.12)] hover:shadow-[5px_5px_0px_0px_rgba(25,26,35,0.2)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-40 bg-[#F5F5F5] border-b-2 border-[#191A23] overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HugeiconsIcon icon={gift.type === "physical" ? PackageIcon : GiftIcon} size={36} className="text-neutral-300" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={gift.status} />
        </div>
        <div className="absolute bottom-2 right-2 bg-[#191A23] text-white text-[10px] font-black px-2 py-0.5 rounded-sm">
          ₦{gift.amountPaid?.toLocaleString()}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex-1">
          <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
            {gift.type} · {gift.paymentMethod}
          </p>
          <p className="text-sm font-black text-[#191A23] leading-snug">{name}</p>
          <p className="text-[10px] text-neutral-500 font-medium">{storeName}</p>
        </div>

        {/* Linked website */}
        {website ? (
          <a
            href={website.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-bold text-[#9151FF] hover:underline"
          >
            <HugeiconsIcon icon={Globe02Icon} size={11} color="#9151FF" strokeWidth={2} />
            {website.recipientName} · {website.occasion}
          </a>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600">
            <HugeiconsIcon icon={LinkSquare02Icon} size={11} color="#d97706" strokeWidth={2} />
            Not linked to a website yet
          </div>
        )}

        {gift.expiresAt && (
          <p className="text-[9px] text-neutral-400 font-medium">
            Expires {new Date(gift.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────── */
function GiftSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-64 border-2 border-[#191A23]/10 rounded-sm animate-pulse bg-neutral-100" />
      ))}
    </div>
  );
}

/* ── Empty ──────────────────────────────────────────────────────── */
function EmptyGifts({ label }: { label: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className="w-16 h-16 rounded-sm border-2 border-[#191A23]/10 bg-[#F3F3F3] flex items-center justify-center">
        <HugeiconsIcon icon={GiftIcon} size={32} className="text-neutral-300" />
      </div>
      <p className="font-black text-lg text-[#191A23]">{label}</p>
      <p className="text-sm text-neutral-400 max-w-xs">
        Browse the marketplace and purchase a gift to get started.
      </p>
      <Button
        onClick={() => router.push("/dashboard/marketplace")}
        className="rounded-sm bg-[#191A23] text-white border-b-4 border-b-black hover:bg-[#191A23]/90 font-bold px-5 py-5"
      >
        Browse Marketplace
      </Button>
    </div>
  );
}

/* ── Tab button ─────────────────────────────────────────────────── */
function TabBtn({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 font-black uppercase text-[11px] tracking-widest border-r-2 last:border-r-0 border-[#191A23] transition-colors",
        active ? "bg-[#191A23] text-white" : "text-neutral-400 hover:text-[#191A23] bg-white",
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "ml-2 px-1.5 py-0.5 rounded-full text-[8px] border font-black",
          active ? "bg-white/20 border-white/20 text-white" : "bg-neutral-100 border-neutral-200 text-neutral-500",
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function GiftBoxPage() {
  const router = useRouter();

  const [sentGifts, setSentGifts] = useState<Gift[]>([]);
  const [unattachedGifts, setUnattachedGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sent" | "unattached">("sent");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sentRes, unattachedRes] = await Promise.all([
          getSentGifts(),
          getUnattachedGifts(),
        ]);

        if (sentRes.success && sentRes.data) setSentGifts(sentRes.data.gifts);
        else toast.error(sentRes.message || "Failed to load sent gifts");

        if (unattachedRes.success && unattachedRes.data) setUnattachedGifts(unattachedRes.data.gifts);
        else toast.error(unattachedRes.message || "Failed to load unattached gifts");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const displayed = activeTab === "sent" ? sentGifts : unattachedGifts;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/marketplace")}
            className="mt-1 rounded-sm border border-[#191A23]/20 hover:bg-[#191A23]/5 shrink-0"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} color="#191A23" strokeWidth={1.5} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm border-2 border-[#191A23] border-b-4 bg-[#FFD700] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(25,26,35,0.2)]">
                <HugeiconsIcon icon={GiftIcon} size={16} color="white" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
                Gift Box
              </h1>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1 pl-[52px]">
              All your purchased & sent gifts
            </p>
          </div>
        </div>

        {/* Stats strip */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Gifts", value: sentGifts.length },
              { label: "Unattached", value: unattachedGifts.length, accent: unattachedGifts.length > 0 },
              { label: "Redeemed", value: sentGifts.filter(g => g.status === "redeemed").length },
              { label: "In Escrow", value: sentGifts.filter(g => g.escrowStatus === "holding").length },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-sm border-2 border-b-4 bg-white px-4 py-3 shadow-[2px_2px_0px_0px_rgba(25,26,35,0.08)]",
                  stat.accent ? "border-amber-400 bg-amber-50" : "border-[#191A23]/10",
                )}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</p>
                <p className="text-2xl font-black text-[#191A23]">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="rounded-sm border-2 border-[#191A23] border-b-4 overflow-hidden inline-flex shadow-[3px_3px_0px_0px_rgba(25,26,35,0.12)]">
          <TabBtn active={activeTab === "sent"} onClick={() => setActiveTab("sent")} label="All Sent" count={sentGifts.length} />
          <TabBtn active={activeTab === "unattached"} onClick={() => setActiveTab("unattached")} label="Unattached" count={unattachedGifts.length} />
        </div>

        {/* Grid */}
        {loading ? (
          <GiftSkeleton count={4} />
        ) : displayed.length === 0 ? (
          <EmptyGifts
            label={activeTab === "sent" ? "No gifts sent yet" : "No unattached gifts"}
          />
        ) : (
          <>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              {displayed.length} gift{displayed.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayed.map((gift) => (
                <GiftCard key={gift._id} gift={gift} />
              ))}
            </div>
          </>
        )}

        {/* Unattached CTA */}
        {!loading && unattachedGifts.length > 0 && (
          <div className="rounded-sm border-2 border-amber-300 border-b-4 bg-amber-50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-black text-sm text-amber-800 uppercase tracking-wide">
                🎁 You have {unattachedGifts.length} unattached gift{unattachedGifts.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                Link them to a celebration website so the recipient can redeem them.
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/website")}
              className="rounded-sm border-2 border-amber-600 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs border-b-4 border-b-amber-800 active:border-b-2 active:translate-y-0.5 transition-all shrink-0"
            >
              <HugeiconsIcon icon={LinkSquare02Icon} size={14} color="white" strokeWidth={1.5} className="mr-1.5" />
              Link to Website
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
