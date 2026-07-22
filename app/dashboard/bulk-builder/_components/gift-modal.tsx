"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GiftIcon,
  PackageIcon,
  Tick02Icon,
  Add01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getUnattachedGifts, Gift } from "@/lib/gifts";

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export interface AttachGiftData {
  /** Must match the backend's field name exactly: `gift_type`. */
  gift_type: string;
  amount: number;
  currency: string;
  /** Only required when gift_type is "physical". */
  gift_id?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// GiftCardItem — internal selection card, mirrors gift.tsx GiftCard exactly
// ─────────────────────────────────────────────────────────────────────────────

function GiftCardItem({
  gift,
  selected,
  onSelect,
}: {
  gift: Gift;
  selected: boolean;
  onSelect: () => void;
}) {
  const imageUrl =
    gift.productSnapshot?.imageUrl ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (gift.productId as any)?.images?.[0]?.url;

  const name =
    gift.productSnapshot?.name ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      {/* Thumbnail */}
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

      {/* Selected check */}
      {selected && (
        <div className="size-6 rounded-full bg-[#B4F8C8] flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={Tick02Icon} size={12} color="#191A23" />
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BulkGiftModal
// ─────────────────────────────────────────────────────────────────────────────

export function BulkGiftModal({
  isOpen,
  recipientName,
  onClose,
  onAttach,
  isAttaching,
}: {
  isOpen: boolean;
  recipientName: string;
  onClose: () => void;
  onAttach: (data: AttachGiftData) => void;
  isAttaching: boolean;
}) {
  // Initial state is always fresh because the parent remounts this component
  // via `key={selectedRowId}` whenever the selected recipient changes.
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [mode, setMode] = useState<"box" | "custom">("box");
  const [customType, setCustomType] = useState<"voucher" | "wallet_credit">(
    "voucher",
  );
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    getUnattachedGifts()
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) setGifts(res.data.gifts);
        else setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const selectedGift = gifts.find((g) => g._id === selectedId) ?? null;
  const customAmountValue = Number(customAmount);
  const isCustomValid = customAmountValue > 0;

  const handleConfirm = () => {
    if (mode === "custom") {
      if (!isCustomValid) return;
      onAttach({
        gift_type: customType,
        amount: customAmountValue,
        currency: "NGN",
      });
      return;
    }
    if (!selectedGift) return;
    onAttach({
      gift_type: selectedGift.type,
      amount: selectedGift.amountPaid,
      currency: selectedGift.currency ?? "NGN",
      gift_id: selectedGift._id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 border-2 border-[#191A23] rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] overflow-hidden font-space gap-0">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#191A23] bg-[#F3F3F3]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
              Attach Gift to
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
        <div className="px-5 py-4 space-y-4">
          {/* Mode tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3F3F3] border-2 border-[#191A23] rounded-sm">
            <button
              type="button"
              onClick={() => setMode("box")}
              className={cn(
                "py-2 text-[9px] font-black uppercase rounded-sm transition-all",
                mode === "box"
                  ? "bg-[#191A23] text-white"
                  : "text-neutral-500 hover:text-[#191A23]",
              )}
            >
              From Gift Box
            </button>
            <button
              type="button"
              onClick={() => setMode("custom")}
              className={cn(
                "py-2 text-[9px] font-black uppercase rounded-sm transition-all",
                mode === "custom"
                  ? "bg-[#191A23] text-white"
                  : "text-neutral-500 hover:text-[#191A23]",
              )}
            >
              Custom Amount
            </button>
          </div>

          {mode === "custom" ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-neutral-500">
                  Gift Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomType("voucher")}
                    className={cn(
                      "py-2 text-[10px] font-black uppercase border-2 border-[#191A23] rounded-sm transition-all",
                      customType === "voucher"
                        ? "bg-[#B4F8C8] text-[#191A23]"
                        : "bg-white text-neutral-500",
                    )}
                  >
                    Voucher
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType("wallet_credit")}
                    className={cn(
                      "py-2 text-[10px] font-black uppercase border-2 border-[#191A23] rounded-sm transition-all",
                      customType === "wallet_credit"
                        ? "bg-[#B4F8C8] text-[#191A23]"
                        : "bg-white text-neutral-500",
                    )}
                  >
                    Wallet Credit
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-neutral-500">
                  Amount (NGN)
                </label>
                <input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2.5 border-2 border-[#191A23] rounded-sm text-sm font-bold focus:outline-none"
                />
              </div>
              <p className="text-[9px] text-neutral-400 leading-relaxed">
                This creates a fresh {customType === "voucher" ? "voucher" : "wallet credit"} gift for this recipient when the batch publishes — no need to pre-purchase it from the marketplace.
              </p>
            </div>
          ) : (
            <>
          {/* Count header */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Your Gift Box ({loading ? "…" : gifts.length})
            </p>
            {selectedId && (
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-[9px] font-black uppercase text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-sm border-2 border-[#191A23]/10 bg-neutral-100 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            /* Error state */
            <p className="text-[10px] font-bold text-red-400 text-center py-4">
              Failed to load gifts. Please refresh.
            </p>
          ) : gifts.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="size-12 rounded-sm border-2 border-[#191A23]/10 bg-[#F3F3F3] flex items-center justify-center">
                <HugeiconsIcon
                  icon={GiftIcon}
                  size={22}
                  className="text-neutral-300"
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                No unattached gifts
              </p>
              <p className="text-xs text-neutral-400 max-w-[200px]">
                Purchase a gift from the marketplace first, then come back to
                link it.
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
          ) : (
            /* Gift grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-65 overflow-y-auto pr-1">
              {gifts.map((gift) => (
                <GiftCardItem
                  key={gift._id}
                  gift={gift}
                  selected={selectedId === gift._id}
                  onSelect={() =>
                    setSelectedId(selectedId === gift._id ? null : gift._id)
                  }
                />
              ))}
            </div>
          )}

          {/* Selected confirmation banner */}
          {selectedGift && (
            <div className="flex items-center gap-2 p-2.5 bg-[#B4F8C8] border border-[#191A23] rounded-sm animate-in slide-in-from-bottom-2 duration-200">
              <HugeiconsIcon icon={Tick02Icon} size={12} color="#191A23" />
              <p className="text-[10px] font-black uppercase text-[#191A23]">
                {selectedGift.productSnapshot?.name || "Gift"} will be linked to
                this recipient
              </p>
            </div>
          )}
            </>
          )}
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
            disabled={
              isAttaching || (mode === "custom" ? !isCustomValid : !selectedGift)
            }
            className="flex-1 py-2.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-[#191A23] text-white hover:bg-[#191A23]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] flex items-center justify-center gap-2"
          >
            {isAttaching ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <HugeiconsIcon icon={Tick02Icon} size={12} color="white" />
            )}
            {isAttaching ? "Attaching…" : "Attach Gift"}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
