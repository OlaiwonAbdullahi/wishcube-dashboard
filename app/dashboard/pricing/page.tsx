/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Crown02Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  SparklesIcon,
  Globe02Icon,
  VideoIcon,
  Key01Icon,
  ShieldCheck,
  LockPasswordIcon,
  InformationCircleIcon,
  Camera02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  initializeSubscription,
  getSubscriptionStatus,
  PlanType,
  SubscriptionStatusData,
} from "@/lib/subscriptions";

interface PlanFeature {
  text: string;
  icon: any;
}

interface Plan {
  id: "free" | PlanType;
  label: string;
  price: number | null;
  tag: string | null;
  accentColor: string;
  badgeColor: string;
  description: string;
  features: PlanFeature[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON = (icon: any) =>
  icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const PLANS: Plan[] = [
  {
    id: "free",
    label: "Free",
    price: null,
    tag: null,
    accentColor: "#191A23",
    badgeColor: "#F3F3F3",
    description: "Get started and explore the basics of WishCube.",
    features: [
      { text: "Unlimited cards creation", icon: ICON(SparklesIcon) },
      { text: "1 active website at a time", icon: ICON(Globe02Icon) },
      { text: "Media uploads (Photos only)", icon: ICON(Camera02Icon) },
      {
        text: "Standard themes & basic text messages",
        icon: ICON(SparklesIcon),
      },
      { text: "No password protection", icon: ICON(Key01Icon) },
      { text: "No custom slugs", icon: ICON(LockPasswordIcon) },
    ],
  },
  {
    id: "pro",
    label: "Pro",
    price: 10000,
    tag: "Most Popular",
    accentColor: "#9151FF",
    badgeColor: "#EDE0FF",
    description: "Perfect for creators who want more power and flexibility.",
    features: [
      { text: "Unlimited cards creation", icon: ICON(SparklesIcon) },
      { text: "Unlimited active websites", icon: ICON(Globe02Icon) },
      { text: "AI-powered message generation", icon: ICON(SparklesIcon) },
      { text: "Media uploads (Photos,Video & Voice)", icon: ICON(VideoIcon) },
      { text: "Password-protected pages", icon: ICON(Key01Icon) },
    ],
  },
  {
    id: "premium",
    label: "Premium",
    price: 50000,
    tag: "Business",
    accentColor: "#F59E0B",
    badgeColor: "#FEF3C7",
    description: "Everything you need to run a professional gifting brand.",
    features: [
      { text: "Unlimited cards creation", icon: ICON(SparklesIcon) },
      { text: "Unlimited active websites", icon: ICON(Globe02Icon) },
      {
        text: "Custom subdomains (yourname.wishcube.com)",
        icon: ICON(Globe02Icon),
      },
      { text: "Longer expiration dates", icon: ICON(ShieldCheck) },
      { text: "White-label (no WishCube branding)", icon: ICON(Crown02Icon) },
      { text: "All Pro features included", icon: ICON(CheckmarkCircle02Icon) },
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();

  const [subscription, setSubscription] =
    useState<SubscriptionStatusData | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<PlanType | null>(null);

  /* Fetch current subscription status */
  useEffect(() => {
    const fetchStatus = async () => {
      setStatusLoading(true);
      const res = await getSubscriptionStatus();
      if (res.success && res.data) {
        setSubscription(res.data);
      }
      setStatusLoading(false);
    };
    fetchStatus();
  }, []);

  const currentTier = subscription?.tier ?? "free";
  const isActive = subscription?.status === "active";

  /* Handle subscribe click */
  const handleSubscribe = async (planType: PlanType) => {
    setSubscribing(planType);
    const callbackUrl = `https://app.usewishcube.com/dashboard/pricing/verify`;
    const res = await initializeSubscription(planType, callbackUrl);

    if (res.success && res.data) {
      window.location.assign(res.data.authorization_url);
    } else {
      toast.error(res.message || "Failed to initialize subscription");
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-space">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="mt-1 rounded-sm border border-[#191A23]/20 hover:bg-[#191A23]/5 shrink-0"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={18}
              color="#191A23"
              strokeWidth={1.5}
            />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#191A23]">
              Plans & Pricing
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Choose the plan that fits your creative needs.
            </p>
          </div>
        </div>

        {statusLoading ? (
          <div className="h-14 rounded-sm border-2 border-[#191A23]/10 bg-white animate-pulse" />
        ) : subscription ? (
          <div
            className="flex items-center gap-3 rounded-sm border-2 px-5 py-3"
            style={{
              borderColor:
                subscription.tier === "premium"
                  ? "#F59E0B"
                  : subscription.tier === "pro"
                    ? "#9151FF"
                    : "#191A23",
              background:
                subscription.tier === "premium"
                  ? "#FFFBEB"
                  : subscription.tier === "pro"
                    ? "#F5EEFF"
                    : "#191A23",
            }}
          >
            <HugeiconsIcon
              icon={Crown02Icon}
              size={18}
              color={
                subscription.tier === "premium"
                  ? "#F59E0B"
                  : subscription.tier === "pro"
                    ? "#9151FF"
                    : "white"
              }
              strokeWidth={1.5}
            />
            <span
              className="text-sm font-bold"
              style={{
                color:
                  subscription.tier === "premium"
                    ? "#92400E"
                    : subscription.tier === "pro"
                      ? "#5B21B6"
                      : "white",
              }}
            >
              Current plan:{" "}
              <span className="capitalize font-black">{subscription.tier}</span>
              {isActive && subscription.expiry && (
                <span className="ml-2 font-normal opacity-60 text-xs">
                  · Renews{" "}
                  {new Date(subscription.expiry).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {!isActive && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] font-bold uppercase">
                  {subscription.status}
                </span>
              )}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-sm border-2 border-[#191A23]/10 bg-[#F3F3F3] px-5 py-3">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={18}
              color="#52525B"
              strokeWidth={1.5}
            />
            <span className="text-sm font-medium text-neutral-500">
              You&apos;re on the <strong>Free</strong> plan.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrent =
              currentTier === plan.id && (plan.id === "free" || isActive);
            const isThisLoading = subscribing === plan.id;
            const canUpgrade = plan.id !== "free";
            // Accent color used for border glow + stripe when this is the current plan
            const accentHex = plan.accentColor;

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-sm border-2 border-b-4 bg-white flex flex-col transition-all duration-200 overflow-hidden",
                  isCurrent
                    ? "shadow-[0_0_0_3px]"
                    : "border-[#191A23]/20 border-b-[#191A23]/30 hover:border-[#191A23]/60 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,0.1)]",
                )}
                style={
                  isCurrent
                    ? {
                        borderColor: accentHex,
                        borderBottomColor: accentHex,
                        boxShadow: `0 0 0 3px ${accentHex}22`,
                      }
                    : {}
                }
              >
                {/* Accent top stripe for current plan */}
                {isCurrent && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: accentHex }}
                  />
                )}

                {/* Coming Soon Overlay for Premium */}
                {plan.id === "premium" && (
                  <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center select-none">
                    <div className="bg-white border-2 border-[#191A23] border-b-4 px-4 py-2 rounded-sm -rotate-3 shadow-[4px_4px_0px_0px_rgba(25,26,35,0.1)] flex flex-col items-center gap-1">
                      <HugeiconsIcon
                        icon={SparklesIcon}
                        size={20}
                        color="#F59E0B"
                        className="animate-bounce"
                      />
                      <span className="text-sm font-black uppercase tracking-widest text-[#191A23]">
                        Coming Soon
                      </span>
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-neutral-500 uppercase tracking-tight max-w-[140px]">
                      This professional plan is currently in development.
                    </p>
                  </div>
                )}

                {/* Tag badge */}
                {plan.tag && (
                  <div
                    className="absolute -top-3 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border"
                    style={{
                      backgroundColor: plan.badgeColor,
                      borderColor: plan.accentColor + "40",
                      color: plan.accentColor,
                    }}
                  >
                    {plan.tag}
                  </div>
                )}

                <div className="p-6 flex flex-col gap-5 flex-1">
                  {/* Plan name & price */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-sm flex items-center justify-center border"
                        style={{
                          backgroundColor: plan.badgeColor,
                          borderColor: plan.accentColor + "40",
                        }}
                      >
                        <HugeiconsIcon
                          icon={
                            plan.id === "free"
                              ? SparklesIcon
                              : plan.id === "pro"
                                ? Crown02Icon
                                : Globe02Icon
                          }
                          size={16}
                          color={plan.accentColor}
                          strokeWidth={1.5}
                        />
                      </div>
                      <span
                        className="text-sm font-black uppercase tracking-widest"
                        style={{ color: plan.accentColor }}
                      >
                        {plan.label}
                      </span>
                    </div>

                    {plan.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#191A23]">
                          ₦{plan.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-neutral-400 font-medium">
                          /mo
                        </span>
                      </div>
                    ) : (
                      <div className="text-3xl font-black text-[#191A23]">
                        Free
                      </div>
                    )}
                    <p className="text-xs text-neutral-500 mt-1">
                      {plan.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#191A23]/8" />

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <HugeiconsIcon
                          icon={feat.icon}
                          size={15}
                          color={plan.accentColor}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0"
                        />
                        <span className="text-xs text-[#191A23] font-medium leading-relaxed">
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="pt-2">
                    {isCurrent ? (
                      <div
                        className="flex items-center justify-center gap-2 py-2.5 rounded-sm border-2 text-xs font-black"
                        style={{
                          borderColor: accentHex,
                          color: accentHex,
                          backgroundColor: plan.badgeColor,
                        }}
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={14}
                          color={accentHex}
                          strokeWidth={2}
                        />
                        Current Plan
                      </div>
                    ) : canUpgrade ? (
                      <Button
                        id={`subscribe-${plan.id}`}
                        onClick={() => handleSubscribe(plan.id as PlanType)}
                        disabled={!!subscribing}
                        className={cn(
                          "w-full rounded-sm border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-bold py-5 text-sm",
                          "border-b-black text-white",
                        )}
                        style={{ backgroundColor: plan.accentColor }}
                      >
                        {isThisLoading ? (
                          <span className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={Loading03Icon}
                              size={16}
                              color="white"
                              strokeWidth={1.5}
                              className="animate-spin"
                            />
                            Redirecting…
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={Crown02Icon}
                              size={16}
                              color="white"
                              strokeWidth={1.5}
                            />
                            Upgrade to {plan.label}
                          </span>
                        )}
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-2.5 rounded-sm border border-[#191A23]/10 text-xs font-medium text-neutral-400">
                        Always free
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-sm border-2 border-[#191A23] border-b-4 bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,0.08)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#191A23]/10 bg-[#F9F9FB]">
            <h2 className="text-sm font-black text-[#191A23] uppercase tracking-widest">
              Feature Breakdown
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#191A23]/8">
                  <th className="text-left px-6 py-3 text-neutral-400 font-bold uppercase tracking-wide w-1/2">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className="px-4 py-3 font-black uppercase tracking-wider text-center"
                      style={{ color: p.accentColor }}
                    >
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#191A23]/6">
                {[
                  {
                    feature: "Card creation",
                    free: "Unlimited",
                    pro: "Unlimited",
                    premium: "Unlimited",
                  },
                  {
                    feature: "Active websites",
                    free: "1",
                    pro: "Unlimited",
                    premium: "Unlimited",
                  },
                  {
                    feature: "Standard themes",
                    free: "✓",
                    pro: "✓",
                    premium: "✓",
                  },
                  {
                    feature: "AI message generation",
                    free: "✗",
                    pro: "✓",
                    premium: "✓",
                  },
                  {
                    feature: "Media uploads",
                    free: "✗",
                    pro: "✓",
                    premium: "✓",
                  },
                  {
                    feature: "Password protection",
                    free: "✗",
                    pro: "✓",
                    premium: "✓",
                  },
                  {
                    feature: "Custom slugs",
                    free: "✗",
                    pro: "✓",
                    premium: "✓",
                  },
                  {
                    feature: "Custom subdomains",
                    free: "✗",
                    pro: "✗",
                    premium: "✓",
                  },
                  {
                    feature: "Longer expiry dates",
                    free: "✗",
                    pro: "✗",
                    premium: "✓",
                  },
                  {
                    feature: "White-label branding",
                    free: "✗",
                    pro: "✗",
                    premium: "✓",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#F9F9FB] transition-colors">
                    <td className="px-6 py-3 font-medium text-[#191A23]">
                      {row.feature}
                    </td>
                    {(["free", "pro", "premium"] as const).map((tier) => {
                      const val = row[tier];
                      const plan = PLANS.find((p) => p.id === tier)!;
                      const isCheck = val === "✓";
                      const isCross = val === "✗";
                      return (
                        <td key={tier} className="px-4 py-3 text-center">
                          {isCheck ? (
                            <span
                              className="font-black"
                              style={{ color: plan.accentColor }}
                            >
                              ✓
                            </span>
                          ) : isCross ? (
                            <span className="text-neutral-300 font-bold">
                              ✗
                            </span>
                          ) : (
                            <span className="font-bold text-[#191A23]">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <HugeiconsIcon
            icon={ShieldCheck}
            size={14}
            color="currentColor"
            strokeWidth={1.5}
          />
          <span>
            Payments are processed securely via Paystack. Your card details are
            never stored on our servers.
          </span>
        </div>
      </div>
    </div>
  );
}
