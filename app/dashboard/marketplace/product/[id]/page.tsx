/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, getProductById } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  ShoppingBasketAdd03Icon,
  Store01Icon,
  PackageIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getProductById(id as string);
        if (res.success && res.data) {
          setProduct(res.data.product);
        } else {
          toast.error(res.message || "Failed to load product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("An error occurred while loading the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="font-black uppercase text-xs gap-2 px-0 hover:bg-transparent"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
          Back to Marketplace
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-neutral-50 border-2 border-[#191A23] rounded-sm animate-pulse shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]" />
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-neutral-50 border-2 border-[#191A23] rounded-sm animate-pulse" />
            <div className="h-6 w-1/4 bg-neutral-50 border-2 border-[#191A23] rounded-sm animate-pulse" />
            <div className="h-32 w-full bg-neutral-50 border-2 border-[#191A23] rounded-sm animate-pulse" />
            <div className="h-12 w-full bg-neutral-50 border-2 border-[#191A23] rounded-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto text-center py-20">
        <h2 className="text-2xl font-black uppercase mb-4">
          Product Not Found
        </h2>
        <Button
          asChild
          className="border-2 border-[#191A23] font-black uppercase shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]"
        >
          <Link href="/dashboard/marketplace">Return to Marketplace</Link>
        </Button>
      </div>
    );
  }

  const vendor = product.vendorId as any;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="font-black uppercase text-xs gap-2 px-0 hover:bg-transparent hover:text-[#191A23]"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
          Back to Marketplace
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-[#191A23] font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
          }}
        >
          <HugeiconsIcon icon={Share01Icon} size={14} className="mr-2" />
          Share
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-neutral-50 border-2 border-[#191A23] rounded-sm shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] overflow-hidden relative">
            {product.images?.[activeImage]?.url ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HugeiconsIcon
                  icon={PackageIcon}
                  size={80}
                  className="text-neutral-200"
                />
              </div>
            )}
            <Badge className="absolute top-4 right-4 border-2 border-[#191A23] bg-[#B4F8C8] text-[#191A23] font-black uppercase px-3 py-1">
              {product.category}
            </Badge>
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-20 h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all",
                    activeImage === idx
                      ? "border-[#191A23] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] translate-y-[-2px]"
                      : "border-neutral-200 grayscale hover:grayscale-0"
                  )}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#191A23] uppercase tracking-tighter leading-none">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-black text-[#191A23]">
                ₦{product.price.toLocaleString()}
              </p>
              <Badge
                className={cn(
                  "border-2 border-[#191A23] font-black uppercase px-2 py-0.5",
                  product.category === "Vouchers" || product.stock > 0
                    ? "bg-[#B4F8C8] text-[#191A23]"
                    : "bg-red-100 text-red-600"
                )}
              >
                {product.category === "Vouchers" || product.stock > 0
                  ? product.category === "Vouchers"
                    ? "AVAILABLE"
                    : `${product.stock} IN STOCK`
                  : "OUT OF STOCK"}
              </Badge>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-black uppercase text-sm tracking-widest text-neutral-400">
              Description
            </h3>
            <p className="text-neutral-600 font-medium leading-relaxed">
              {product.description ||
                "No description provided for this product."}
            </p>
          </div>

          <Card className="border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black uppercase text-sm tracking-widest text-neutral-400">
                  Vendor
                </h3>
                <Link
                  href={`/vendors/store/${vendor?.slug}`}
                  className="text-xs font-black uppercase flex items-center gap-1 text-[#191A23] hover:underline"
                >
                  Visit Store
                  <HugeiconsIcon
                    icon={ArrowLeft02Icon}
                    size={12}
                    className="rotate-180"
                  />
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-50 border-2 border-[#191A23] rounded-sm flex items-center justify-center overflow-hidden">
                  {vendor?.logo ? (
                    <img
                      src={vendor.logo}
                      alt={vendor.storeName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <HugeiconsIcon icon={Store01Icon} size={24} />
                  )}
                </div>
                <div>
                  <h4 className="font-black uppercase text-lg leading-tight">
                    {vendor?.storeName || "WishCube Vendor"}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={cn(
                            "w-3 h-3 fill-current",
                            i < (vendor?.rating || 0)
                              ? "opacity-100"
                              : "opacity-30"
                          )}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-neutral-500">
                      {vendor?.rating || 0} Rating
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 h-14 border-2 border-[#191A23] bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#191A23] font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all gap-3">
              <HugeiconsIcon icon={ShoppingBasketAdd03Icon} size={24} />
              Add to GiftBox
            </Button>
            <Button
              variant="outline"
              className="h-14 px-8 border-2 border-[#191A23] font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:bg-neutral-50 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              Contact Vendor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
