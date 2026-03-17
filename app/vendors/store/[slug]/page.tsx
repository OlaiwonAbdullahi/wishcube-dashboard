"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Vendor, getVendorBySlug } from "@/lib/vendor";
import { Product, getProductsByVendorId } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Store01Icon,
  PackageIcon,
  ShoppingBasketAdd03Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const VendorStorePage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const vendorRes = await getVendorBySlug(slug as string);
        if (vendorRes.success && vendorRes.data) {
          setVendor(vendorRes.data.vendor);

          const productsRes = await getProductsByVendorId(
            vendorRes.data.vendor._id
          );
          console.log(productsRes);
          if (productsRes.success && productsRes.data) {
            setProducts(productsRes.data.products);
          }
        } else {
          toast.error(vendorRes.message || "Failed to load vendor store");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast.error("An error occurred while loading the store");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="h-40 bg-neutral-50 border-2 border-[#191A23] rounded-sm animate-pulse shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 border-2 border-[#191A23] rounded-sm animate-pulse bg-neutral-50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto text-center py-20">
        <h2 className="text-2xl font-black uppercase mb-4">Store Not Found</h2>
        <Button
          asChild
          className="border-2 border-[#191A23] font-black uppercase shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]"
        >
          <Link href="/dashboard/marketplace">Return to Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      {/* Store Header */}
      <div className="relative border-4 border-[#191A23] rounded-sm p-8 bg-white shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <div className="w-32 h-32 bg-neutral-50 border-4 border-[#191A23] rounded-sm flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
          {vendor.logo ? (
            <img
              src={vendor.logo}
              alt={vendor.storeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <HugeiconsIcon icon={Store01Icon} size={48} />
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#191A23]">
              {vendor.storeName}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Badge className="border border-[#191A23] bg-[#B4F8C8] text-[#191A23] font-black uppercase">
                {vendor.category}
              </Badge>
              {vendor.rating > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          "w-4 h-4 fill-current",
                          i < Math.floor(vendor.rating)
                            ? "opacity-100"
                            : "opacity-30"
                        )}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-black text-[#191A23]">
                    {vendor.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="max-w-2xl text-neutral-500 font-bold leading-relaxed">
            {vendor.description ||
              "Welcome to our store! We offer the best quality gifts and products."}
          </p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
            {vendor.deliveryZones.map((zone) => (
              <Badge
                key={zone}
                variant="outline"
                className="border-2 border-[#191A23] font-black uppercase text-[10px]"
              >
                {zone}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="absolute top-4 right-4 font-black uppercase text-xs gap-2 hover:bg-transparent"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
          Go Back
        </Button>
      </div>

      {/* Store Products */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b-4 border-[#191A23] pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Products
          </h2>
          <p className="font-black text-neutral-400 uppercase text-xs tracking-widest">
            {products.length} Items Found
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-50 border-2 border-dashed border-[#191A23] rounded-sm">
            <h3 className="text-xl font-black uppercase">No Products Found</h3>
            <p className="text-neutral-500 font-bold mt-2">
              This vendor hasn&apos;t uploaded any products yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductCard = ({ product }: { product: any }) => (
  <Card className="group border-2 border-[#191A23] rounded-sm shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden bg-white flex flex-col h-full">
    <div className="relative aspect-square bg-neutral-50 border-b-2 border-[#191A23] overflow-hidden">
      {product.images?.[0]?.url ? (
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <HugeiconsIcon
            icon={PackageIcon}
            size={40}
            className="text-neutral-200"
          />
        </div>
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Badge
          className={cn(
            "border-2 border-[#191A23] font-black uppercase text-[8px] px-1.5 py-0.5",
            product.category === "Vouchers" || product.stock > 0
              ? "bg-[#B4F8C8] text-[#191A23]"
              : "bg-red-100 text-red-600"
          )}
        >
          {product.category === "Vouchers" || product.stock > 0
            ? "Available"
            : "Sold Out"}
        </Badge>
      </div>
    </div>
    <CardHeader className="p-3 space-y-1 flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase text-neutral-400 tracking-wider truncate">
            {product.category}
          </p>
          <CardTitle
            className="text-xs font-black uppercase truncate leading-tight"
            title={product.name}
          >
            {product.name}
          </CardTitle>
          <p className="text-xs font-black text-[#191A23] mt-1">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-3 pt-0 mt-auto">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 h-8 rounded-sm border-2 border-[#191A23] font-black uppercase text-[10px] shadow-[1px_1px_0px_0px_rgba(25,26,35,1)] hover:bg-[#191A23] hover:text-white transition-all"
        >
          <Link href={`/dashboard/marketplace/product/${product._id}`}>
            View Details
          </Link>
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-8 w-8 rounded-sm border-2 border-[#191A23] bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#191A23] shadow-[1px_1px_0px_0px_rgba(25,26,35,1)]"
        >
          <HugeiconsIcon icon={ShoppingBasketAdd03Icon} size={16} />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default VendorStorePage;
