/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GiftIcon,
  PackageIcon,
  Tick02Icon,
  Add01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { getUnattachedGifts, Gift } from "@/lib/gifts";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GiftSelectorProps {
  selectedGiftId: string | null;
  onSelectGift: (id: string | null) => void;
}

function GiftSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-20 rounded-sm border-2 border-[#191A23]/10 bg-neutral-100 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyGifts() {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="size-12 rounded-sm border-2 border-[#191A23]/10 bg-[#F3F3F3] flex items-center justify-center">
        <HugeiconsIcon icon={GiftIcon} size={22} className="text-neutral-300" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
        No unattached gifts
      </p>
      <p className="text-xs text-neutral-400 max-w-[200px]">
        Purchase a gift from the marketplace first, then come back to link it.
      </p>
      <Link
        href="/dashboard/marketplace"
        target="_blank"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFF3B0] border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-0.5 transition-all"
      >
        <HugeiconsIcon icon={Add01Icon} size={11} />
        Buy a Gift
        <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
      </Link>
    </div>
  );
}

function GiftCard({
  gift,
  selected,
  onSelect,
}: {
  gift: Gift;
  selected: boolean;
  onSelect: () => void;
}) {
  const imageUrl =
    gift.productSnapshot?.imageUrl || (gift.productId as any)?.images?.[0]?.url;

  const name =
    gift.productSnapshot?.name ||
    (gift.productId as any)?.name ||
    (gift.type === "digital" ? "Digital Gift" : "Physical Gift");

  const isDigital = gift.type === "digital";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full flex items-center gap-3 p-3 rounded-sm border-2 transition-all text-left",
        selected
          ? "bg-[#191A23] border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,0.6)] -translate-y-0.5"
          : "bg-white border-[#191A23] shadow-[3px_3px_0px_0px_rgba(25,26,35,0.12)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,0.25)] hover:-translate-y-0.5",
      )}
    >
      <div
        className={cn(
          "size-12 rounded-sm border flex items-center justify-center shrink-0 overflow-hidden",
          selected ? "border-white/20" : "border-[#191A23]/10",
        )}
        style={{ background: selected ? "rgba(255,255,255,0.12)" : "#F3F3F3" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <HugeiconsIcon
            icon={isDigital ? GiftIcon : PackageIcon}
            size={20}
            color={selected ? "white" : "#191A23"}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-[9px] font-black uppercase tracking-wider",
            selected ? "text-white/60" : "text-neutral-400",
          )}
        >
          {gift.type}
        </p>
        <p
          className={cn(
            "text-xs font-black truncate",
            selected ? "text-white" : "text-[#191A23]",
          )}
        >
          {name}
        </p>
        <p
          className={cn(
            "text-[10px] font-bold mt-0.5",
            selected ? "text-[#B4F8C8]" : "text-[#191A23]",
          )}
        >
          ₦{gift.amountPaid?.toLocaleString()}
        </p>
      </div>

      {/* Check indicator */}
      {selected && (
        <div className="size-6 rounded-full bg-[#B4F8C8] flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={Tick02Icon} size={12} color="#191A23" />
        </div>
      )}
    </button>
  );
}

export default function GiftSelector({
  selectedGiftId,
  onSelectGift,
}: GiftSelectorProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await getUnattachedGifts();
        if (res.success && res.data) {
          setGifts(res.data.gifts);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  const handleSelect = (id: string) => {
    // Toggle: clicking the already-selected gift deselects it
    onSelectGift(selectedGiftId === id ? null : id);
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
          Your Gift Box ({loading ? "…" : gifts.length})
        </p>
        {selectedGiftId && (
          <button
            type="button"
            onClick={() => onSelectGift(null)}
            className="text-[9px] font-black uppercase text-red-400 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <GiftSkeleton />
      ) : error ? (
        <p className="text-[10px] font-bold text-red-400 text-center py-4">
          Failed to load gifts. Please refresh.
        </p>
      ) : gifts.length === 0 ? (
        <EmptyGifts />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
          {gifts.map((gift) => (
            <GiftCard
              key={gift._id}
              gift={gift}
              selected={selectedGiftId === gift._id}
              onSelect={() => handleSelect(gift._id)}
            />
          ))}
        </div>
      )}

      {/* Selected summary */}
      {selectedGiftId && (
        <div className="flex items-center gap-2 p-2.5 bg-[#B4F8C8] border border-[#191A23] rounded-sm">
          <HugeiconsIcon icon={Tick02Icon} size={12} color="#191A23" />
          <p className="text-[10px] font-black uppercase text-[#191A23]">
            Gift will be linked to this website
          </p>
        </div>
      )}
    </div>
  );
}
