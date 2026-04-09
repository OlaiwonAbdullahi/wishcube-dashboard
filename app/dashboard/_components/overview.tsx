"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Video02Icon,
  WalletAdd02Icon,
  Cards02Icon,
  WebDesign02Icon,
  GiftCardIcon,
  AiMagicIcon,
  WalletAdd01Icon,
  Layout01Icon,
  GridIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Overview = ({
  initialStats,
  isPro = false,
  tier = "free",
}: {
  initialStats?: {
    cardsCount: number;
    websitesCount: number;
    giftsCount: number;
    walletBalance: number;
  };
  isPro?: boolean;
  tier?: "free" | "pro" | "premium";
}) => {
  const stats = {
    cards: initialStats?.cardsCount || 0,
    websites: initialStats?.websitesCount || 0,
    wallet: initialStats?.walletBalance || 0,
    gifts: initialStats?.giftsCount || 0,
  };

  const proAccent =
    tier === "premium" ? "#F59E0B" : tier === "pro" ? "#9151FF" : null;

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#191A23]">
              Dashboard Overview
            </h1>
            {isPro && proAccent && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest text-white"
                style={{ backgroundColor: proAccent }}
              >
                <HugeiconsIcon icon={AiMagicIcon} size={9} color="white" />
                {tier}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-600">
            Start something new or pick up from your recent activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            className="rounded-sm bg-[#191A23] text-white border border-[#191A23] border-b-4 hover:bg-[#191A23]/90 hover:scale-[1.02] transition-transform flex items-center"
          >
            <Link href="/dashboard/wallet" className="gap-2 flex items-center">
              <HugeiconsIcon
                icon={WalletAdd02Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
              Fund Wallet
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Cards created"
          value={stats.cards.toString()}
          hint="Drafts + sent"
          isLoading={!initialStats}
        />
        <KpiCard
          title="Website created"
          value={stats.websites.toString()}
          hint="Drafts + sent"
          isLoading={!initialStats}
        />
        <KpiCard
          title="Wallet"
          value={`₦${stats.wallet.toLocaleString()}`}
          hint="Total Funds"
          isLoading={!initialStats}
          accent={isPro ? proAccent ?? undefined : undefined}
        />
        <KpiCard
          title="Gifts"
          value={stats.gifts.toString()}
          hint="Gifts Bought"
          isLoading={!initialStats}
        />
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#191A23]">Quick start</h2>
          <p className="text-xs text-neutral-600">
            What would you like to create today?
          </p>
        </div>
        <div className="flex items-start gap-8 overflow-x-auto py-4 scrollbar-hide no-scrollbar">
          <QuickAction
            title="Magic AI"
            icon={AiMagicIcon}
            color="bg-[#E6D1FF]"
            isNew
            href="#"
          />

          <QuickAction
            title="Create Cards"
            icon={Cards02Icon}
            color="bg-[#FFD1D1]"
            href="/dashboard/cards"
          />
          <QuickAction
            title="Party Room"
            icon={Video02Icon}
            color="bg-[#F8D1FF]"
            href="/dashboard/party-room"
          />
          <QuickAction
            title="Send Gift"
            icon={GiftCardIcon}
            color="bg-[#D1F7FF]"
            href="/dashboard/marketplace"
          />
          <QuickAction
            title="Create Website"
            icon={WebDesign02Icon}
            color="bg-[#D1E9FF]"
            href="/dashboard/websites"
          />
          <QuickAction
            title="Fund Wallet"
            icon={WalletAdd01Icon}
            color="bg-[#E0D1FF]"
            href="/dashboard/wallet"
          />
          <QuickAction
            title="Explore Templates"
            icon={GridIcon}
            color="bg-[#D1FFEB]"
            href="/dashboard/websites"
          />
          <QuickAction
            title="Custom Designs"
            icon={Layout01Icon}
            color="bg-white"
            href="/dashboard/cards"
          />

          <QuickAction
            title="More"
            icon={MoreHorizontalIcon}
            color="bg-white"
            href="/dashboard/settings"
          />
        </div>
      </div>
    </div>
  );
};

function KpiCard({
  title,
  value,
  hint,
  isLoading,
  accent,
}: {
  title: string;
  value: string;
  hint: string;
  isLoading?: boolean;
  accent?: string;
}) {
  return (
    <Card
      className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3] overflow-hidden relative"
      style={accent ? { borderColor: accent, borderBottomColor: accent } : {}}
    >
      {/* subtle colored top stripe for pro wallet */}
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: accent }}
        />
      )}
      <CardHeader className="pb-0">
        <CardDescription className="text-neutral-500 text-xs uppercase font-semibold">
          {title}
        </CardDescription>
        <CardTitle
          className="text-3xl font-bold"
          style={{ color: accent ?? "#191A23" }}
        >
          {isLoading ? (
            <div className="h-10 w-36 bg-[#191A23]/10 rounded animate-pulse" />
          ) : (
            value
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-neutral-500">{hint}</p>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  title,
  icon,
  href,
  color,
  isNew,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  href: string;
  color: string;
  isNew?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 flex-shrink-0"
    >
      <div className="relative">
        {isNew && (
          <Badge className="absolute -top-2 -right-2 z-10 bg-[#191A23] text-white text-[8px] px-1.5 py-0.5 rounded-full border border-white">
            New
          </Badge>
        )}
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-full border border-[#191A23] border-b-4 transition-all group-hover:scale-110 group-hover:-translate-y-1 shadow-sm",
            color,
          )}
        >
          <HugeiconsIcon
            icon={icon}
            size={24}
            color="#191A23"
            strokeWidth={1.5}
          />
        </div>
      </div>
      <p className="text-[10px] whitespace-nowrap font-bold text-[#191A23] text-center max-w-[70px] leading-tight">
        {title}
      </p>
    </Link>
  );
}

export default Overview;
