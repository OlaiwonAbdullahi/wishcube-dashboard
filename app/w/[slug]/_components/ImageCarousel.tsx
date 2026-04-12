"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function ImageCarousel({
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
