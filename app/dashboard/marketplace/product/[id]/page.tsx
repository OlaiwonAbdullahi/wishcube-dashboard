/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, getProductById } from "@/lib/products";
import { purchaseGift } from "@/lib/gifts";
import { getWalletBalance } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  PackageIcon,
  Store01Icon,
  Share01Icon,
  ShoppingBasketAdd03Icon,
  Wallet01Icon,
  Loading03Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PaymentMethod = "paystack" | "wallet";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Purchase state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
  const [giftMessage, setGiftMessage] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [digital, setDigital] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getProductById(id as string);
        if (res.success && res.data) {
          setProduct(res.data.product);
          console.log(res.data.product);
          if (res.data.product.category === "Vouchers") {
            setDigital(true);
          } else {
            setDigital(false);
          }
        } else {
          toast.error(res.message || "Failed to load product");
        }
      } catch {
        toast.error("An error occurred while loading the product");
      } finally {
        setLoading(false);
      }
    };

    const fetchBalance = async () => {
      const res = await getWalletBalance();
      if (res.success && res.data) setWalletBalance(res.data.walletBalance);
    };

    fetchProduct();
    fetchBalance();
  }, [id]);

  const handleBuyAsGift = async () => {
    if (!product) return;
    setPurchasing(true);

    const callbackUrl = `https://app.usewishcube.com/dashboard/marketplace/giftbox/verify`;

    const res = await purchaseGift(
      digital
        ? {
            type: "digital",
            paymentMethod,
            amount: product.price,
            giftMessage: giftMessage || undefined,
            callbackUrl,
          }
        : {
            type: "physical",
            paymentMethod,
            productId: product._id,
            giftMessage: giftMessage || undefined,
            callbackUrl,
          },
    );

    if (res.success && res.data) {
      if (paymentMethod === "paystack" && res.data.paymentUrl) {
        window.location.href = `${res.data.paymentUrl}`;
      } else {
        toast.success("Gift purchased from wallet! View it in your Gift Box.");
        router.push("/dashboard/marketplace/giftbox");
      }
    } else {
      toast.error(res.message || "Failed to purchase gift");
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-space">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-sm" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-square bg-neutral-200 animate-pulse rounded-sm border-2 border-[#191A23]/10" />
            <div className="space-y-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-neutral-200 animate-pulse rounded-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-space flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">📦</div>
          <h2 className="text-2xl font-black uppercase text-[#191A23]">
            Product Not Found
          </h2>
          <Button
            asChild
            className="rounded-sm border-2 border-[#191A23] border-b-4 bg-[#191A23] text-white font-black uppercase"
          >
            <Link href="/dashboard/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const vendor = product.vendorId as any;
  const inStock = (product as any).category === "Vouchers" || product.stock > 0;
  const canAffordWallet =
    walletBalance !== null && walletBalance >= product.price;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-space">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-sm border border-[#191A23]/20 hover:bg-[#191A23]/5 font-black uppercase text-xs gap-2"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={16}
              color="#191A23"
              strokeWidth={1.5}
            />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm border-2 border-[#191A23] font-black uppercase text-[10px] gap-1.5 hover:bg-[#191A23] hover:text-white transition-all"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
          >
            <HugeiconsIcon icon={Share01Icon} size={13} strokeWidth={1.5} />
            Share
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-3 md:sticky top-6">
            <div className="aspect-square bg-[#F5F5F5] border-2 border-[#191A23] border-b-4 rounded-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,0.18)] overflow-hidden relative">
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
                    className="text-neutral-300"
                  />
                </div>
              )}
              <Badge className="absolute top-3 left-3 border border-[#191A23] bg-[#B4F8C8] text-[#191A23] font-black uppercase text-[9px] px-2 py-0.5 rounded-sm">
                {product.category}
              </Badge>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "w-16 h-16 shrink-0 rounded-sm border-2 overflow-hidden transition-all",
                      activeImage === idx
                        ? "border-[#191A23] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
                        : "border-[#191A23]/20 grayscale hover:grayscale-0 hover:border-[#191A23]/60",
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

          <div className="space-y-6">
            {/* Name & price */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                {product.category}
              </p>
              <h1 className="text-3xl font-black text-[#191A23] uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#191A23]">
                  ₦{product.price.toLocaleString()}
                </span>
                <Badge
                  className={cn(
                    "border border-[#191A23] font-black uppercase text-[9px] px-2 py-0.5 rounded-sm",
                    inStock
                      ? "bg-[#B4F8C8] text-[#191A23]"
                      : "bg-red-100 text-red-600",
                  )}
                >
                  {inStock
                    ? (product as any).category === "Vouchers"
                      ? "Available"
                      : `${product.stock} in stock`
                    : "Out of stock"}
                </Badge>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  About this gift
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>
            )}

            {/* Occasion tags */}
            {product.occasionTags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.occasionTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] font-black uppercase border border-[#191A23]/20 rounded-sm bg-white text-neutral-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Vendor */}
            <div className="rounded-sm border-2 border-[#191A23]/10 bg-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm border border-[#191A23]/20 overflow-hidden bg-[#F5F5F5] shrink-0 flex items-center justify-center">
                {vendor?.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.storeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={Store01Icon}
                    size={18}
                    className="text-neutral-400"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Sold by
                </p>
                <p className="text-sm font-black text-[#191A23] truncate">
                  {vendor?.storeName || "WishCube"}
                </p>
              </div>
              {vendor?.slug && (
                <Link
                  href={`/vendors/store/${vendor.slug}`}
                  className="text-[10px] font-black uppercase text-[#9151FF] hover:underline shrink-0"
                >
                  Visit →
                </Link>
              )}
            </div>

            <div className="rounded-sm border-2 border-[#191A23] border-b-4 bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,0.12)] p-5 space-y-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <HugeiconsIcon
                  icon={ShoppingBasketAdd03Icon}
                  size={13}
                  color="#191A23"
                  strokeWidth={2}
                />
                Send as a Gift
              </p>

              {/* Payment method toggle */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wide text-neutral-400">
                  Payment method
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(["paystack", "wallet"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm border-2 text-xs font-black uppercase transition-all",
                        paymentMethod === method
                          ? "bg-[#191A23] text-white border-[#191A23]"
                          : "bg-white text-[#191A23] border-[#191A23]/20 hover:border-[#191A23]/60",
                      )}
                    >
                      {method === "wallet" ? (
                        <HugeiconsIcon
                          icon={Wallet01Icon}
                          size={14}
                          color={
                            paymentMethod === "wallet" ? "white" : "#191A23"
                          }
                          strokeWidth={1.5}
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={14}
                          color={
                            paymentMethod === "paystack" ? "white" : "#191A23"
                          }
                          strokeWidth={1.5}
                        />
                      )}
                      {method === "wallet" ? "Wallet" : "Paystack"}
                    </button>
                  ))}
                </div>

                {paymentMethod === "wallet" && walletBalance !== null && (
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-sm text-[10px] font-bold border",
                      canAffordWallet
                        ? "bg-[#B4F8C8]/30 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-600",
                    )}
                  >
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      size={12}
                      strokeWidth={2}
                    />
                    Wallet balance: ₦{walletBalance.toLocaleString()}
                    {!canAffordWallet && " — insufficient funds"}
                  </div>
                )}
              </div>

              {/* Gift message */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-wide text-neutral-400">
                  Gift message (optional)
                </p>
                <Textarea
                  placeholder="Write a message for the recipient…"
                  value={giftMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setGiftMessage(e.target.value)
                  }
                  maxLength={280}
                  rows={3}
                  className="rounded-sm border-2 border-[#191A23]/20 focus-visible:border-[#191A23] focus-visible:ring-0 font-medium text-sm resize-none"
                />
                <p className="text-[9px] text-neutral-400 text-right font-medium">
                  {giftMessage.length}/280
                </p>
              </div>

              <Button
                id="buy-as-gift-btn"
                onClick={handleBuyAsGift}
                disabled={
                  purchasing ||
                  !inStock ||
                  (paymentMethod === "wallet" && !canAffordWallet)
                }
                className="w-full rounded-sm bg-[#FFD700] hover:bg-[#e6c200] text-[#191A23] border-2 border-[#191A23] border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-black uppercase py-5 text-sm gap-2"
              >
                {purchasing ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={16}
                      color="#191A23"
                      strokeWidth={1.5}
                      className="animate-spin"
                    />
                    Processing…
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={ShoppingBasketAdd03Icon}
                      size={18}
                      color="#191A23"
                      strokeWidth={1.5}
                    />
                    Buy as Gift · ₦{product.price.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-[10px] text-neutral-400 text-center font-medium">
                Gifts are held in escrow until the recipient redeems them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
