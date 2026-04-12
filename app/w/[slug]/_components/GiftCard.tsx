"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GiftIcon, Tick01Icon, TruckIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { GiftInfo } from "./types";

export function GiftCard({
  gift,
  accent,
  font,
  onRedeem,
  onTrack,
}: {
  gift: GiftInfo;
  accent: string;
  font: string;
  onRedeem: () => void;
  onTrack?: () => void;
}) {
  const img = gift.productSnapshot?.imageUrl;
  const name =
    gift.productSnapshot?.name ||
    (gift.type === "digital" ? "Digital Gift" : "Physical Gift");
  const storeName = gift.productSnapshot?.storeName || "WishCube Marketplace";
  const isRedeemed = gift.status === "redeemed";

  if (isRedeemed) {
    const canTrack = gift.type === "physical" && gift.orderId;

    return (
      <div
        className="flex flex-col gap-3 p-4 rounded-2xl border"
        style={{ borderColor: accent + "25", background: accent + "06" }}
      >
        <div className="flex items-center gap-3">
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
            {gift.orderStatus === "delivered" ? "Delivered" : "Redeemed"}
          </span>
        </div>

        {canTrack && (
          <button
            onClick={onTrack}
            className="w-full py-2.5 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:bg-white"
            style={{
              borderColor: accent + "60",
              color: accent,
              fontFamily: font,
            }}
          >
            <HugeiconsIcon icon={TruckIcon} size={14} color={accent} />
            {gift.orderStatus === "delivered"
              ? "View Delivery Details"
              : "Track Delivery"}
          </button>
        )}
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
