/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  ShoppingBasketAdd03Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const inStock =
    (product as any).category === "Vouchers" || (product as any).stock > 0;

  return (
    <div className="group relative border-2 border-[#191A23] border-b-4 rounded-sm bg-white overflow-hidden flex flex-col shadow-[3px_3px_0px_0px_rgba(25,26,35,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(25,26,35,0.25)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#F5F5F5] border-b-2 border-[#191A23] overflow-hidden">
        {(product as any).images?.[0]?.url ? (
          <img
            src={(product as any).images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HugeiconsIcon
              icon={PackageIcon}
              size={40}
              className="text-neutral-300"
            />
          </div>
        )}

        {/* Stock badge */}
        <div className="absolute top-2.5 left-2.5">
          <Badge
            className={cn(
              "border border-[#191A23] font-black uppercase text-[8px] px-2 py-0.5 rounded-sm",
              inStock
                ? "bg-[#B4F8C8] text-[#191A23]"
                : "bg-red-100 text-red-600",
            )}
          >
            {inStock ? "Available" : "Sold Out"}
          </Badge>
        </div>

        {/* Price chip */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#191A23] text-white text-[10px] font-black px-2 py-1 rounded-sm border border-white/20">
          ₦{(product as any).price?.toLocaleString()}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase text-neutral-400 tracking-wider truncate">
            {(product as any).category}
          </p>
          <h3
            className="text-xs font-black uppercase truncate leading-snug text-[#191A23]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Vendor row */}
          <div className="flex items-center gap-1 mt-1">
            {(product as any).vendorId?.logo && (
              <img
                src={(product as any).vendorId.logo}
                alt={(product as any).vendorId.storeName}
                className="w-3 h-3 rounded-full border border-[#191A23]"
              />
            )}
            <p className="text-[9px] font-bold text-neutral-500 truncate uppercase">
              {(product as any).vendorId?.storeName || "WISHCUBE"}
            </p>
            {(product as any).vendorId?.rating > 0 && (
              <div className="flex items-center gap-0.5 ml-auto">
                <svg className="w-2 h-2 fill-amber-500" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[8px] font-black">
                  {(product as any).vendorId.rating}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 h-8 rounded-sm border-2 border-[#191A23] font-black uppercase text-[10px] hover:bg-[#191A23] hover:text-white transition-all active:translate-x-px active:translate-y-px"
          >
            <Link href={`/dashboard/marketplace/product/${product._id}`}>
              View Details
            </Link>
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-sm border-2 border-[#191A23] bg-[#FFD700] hover:bg-[#e6c200] text-[#191A23] transition-all active:translate-x-px active:translate-y-px"
          >
            <HugeiconsIcon icon={ShoppingBasketAdd03Icon} size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
