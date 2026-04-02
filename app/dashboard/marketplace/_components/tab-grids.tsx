"use client";

import { PackageSearch, Store } from "lucide-react";
import { Product } from "@/lib/products";
import { Vendor } from "@/lib/vendor";
import { ProductCard } from "./product-card";
import { VendorCard } from "./vendor-card";
import EmptyState from "./empty-state";

function SkeletonGrid({ count, tall }: { count: number; tall?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`border-2 border-[#191A23]/10 rounded-sm animate-pulse bg-neutral-100 ${tall ? "h-72" : "h-40"}`}
        />
      ))}
    </div>
  );
}

interface ProductsGridProps {
  loading: boolean;
  products: Product[];
  search: string;
}

export function ProductsGrid({ loading, products, search }: ProductsGridProps) {
  if (loading) return <SkeletonGrid count={8} tall />;
  if (products.length === 0)
    return (
      <EmptyState
        icon={PackageSearch}
        title="No Products Found"
        description={
          search
            ? `No results for "${search}" in this category.`
            : "Our vendors are busy adding products. Please check back soon!"
        }
      />
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

interface DigitalGiftsGridProps {
  loading: boolean;
  digitalGifts: Product[];
}

export function DigitalGiftsGrid({ loading, digitalGifts }: DigitalGiftsGridProps) {
  if (loading) return <SkeletonGrid count={4} tall />;
  if (digitalGifts.length === 0)
    return (
      <EmptyState
        icon={PackageSearch}
        title="No Vouchers Available"
        description="Check back later to see our collection of digital gift vouchers."
      />
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {digitalGifts.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

interface VendorsGridProps {
  loading: boolean;
  vendors: Vendor[];
  search: string;
}

export function VendorsGrid({ loading, vendors, search }: VendorsGridProps) {
  if (loading) return <SkeletonGrid count={8} />;
  if (vendors.length === 0)
    return (
      <EmptyState
        icon={Store}
        title="No Shops Found"
        description={
          search
            ? `No vendors matching "${search}" found.`
            : "We are currently onboarding new vendors. Stay tuned!"
        }
      />
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {vendors.map((v) => (
        <VendorCard key={v._id} vendor={v} />
      ))}
    </div>
  );
}
