/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Vendor } from "@/lib/vendor";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="group border-2 border-[#191A23] border-b-4 rounded-sm bg-white p-5 flex flex-col items-center text-center gap-3 shadow-[3px_3px_0px_0px_rgba(25,26,35,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(25,26,35,0.25)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
      {/* Logo */}
      <div className="w-16 h-16 flex items-center justify-center rounded-sm border-2 border-[#191A23] overflow-hidden bg-[#F5F5F5] group-hover:bg-[#B4F8C8] transition-colors relative shrink-0">
        {(vendor as any).logo ? (
          <img
            src={(vendor as any).logo}
            alt={(vendor as any).storeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <HugeiconsIcon
            icon={Store01Icon}
            size={28}
            className="text-[#191A23]"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 w-full min-w-0 space-y-0.5">
        <h3
          className="font-black text-sm uppercase truncate leading-tight text-[#191A23]"
          title={(vendor as any).storeName}
        >
          {(vendor as any).storeName}
        </h3>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">
          {(vendor as any).category}
        </p>

        {/* Stars */}
        {(vendor as any).rating > 0 && (
          <div className="flex items-center justify-center gap-1 pt-1">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "w-2.5 h-2.5 fill-current",
                    i < Math.floor((vendor as any).rating)
                      ? "opacity-100"
                      : "opacity-25",
                  )}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] font-black text-[#191A23]">
              {(vendor as any).rating}
            </span>
          </div>
        )}
      </div>

      <Button
        asChild
        variant="outline"
        size="sm"
        className="w-full h-8 text-[10px] font-black uppercase border-2 border-[#191A23] rounded-sm hover:bg-[#191A23] hover:text-white transition-all active:translate-x-px active:translate-y-px"
      >
        <Link href={`/vendors/store/${(vendor as any).slug}`}>
          Visit Store
        </Link>
      </Button>
    </div>
  );
}
