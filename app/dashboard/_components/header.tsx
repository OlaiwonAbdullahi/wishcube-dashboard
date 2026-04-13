"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Banknote,
  Folder01Icon,
  Logout01Icon,
  ShoppingBasket03Icon,
  Wallet01Icon,
  Crown02Icon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getAuth, clearAuth, User } from "@/lib/auth";
import { getWalletBalance } from "@/lib/wallet";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getSubscriptionStatus,
  SubscriptionStatusData,
} from "@/lib/subscriptions";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Tier accent palette
const TIER_STYLES: Record<
  string,
  { label: string; ring: string; badge: string; text: string }
> = {
  pro: {
    label: "Pro",
    ring: "ring-2 ring-[#9151FF]/50",
    badge: "bg-[#9151FF] text-white",
    text: "text-[#9151FF]",
  },
  premium: {
    label: "Premium",
    ring: "ring-2 ring-[#F59E0B]/60",
    badge: "bg-[#F59E0B] text-white",
    text: "text-[#F59E0B]",
  },
};

export function DashboardHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [subscription, setSubscription] =
    useState<SubscriptionStatusData | null>(null);
  const router = useRouter();

  const fetchBalance = async () => {
    const res = await getWalletBalance();
    if (res.success && res.data) {
      setBalance(res.data.walletBalance);
    }
  };

  const fetchSubscription = async () => {
    const res = await getSubscriptionStatus();
    if (res.success && res.data) {
      setSubscription(res.data);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      queueMicrotask(() => setUser(auth.user));
      // eslint-disable-next-line react-hooks/immutability
      fetchBalance();
      fetchSubscription();
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const isPro =
    subscription?.status === "active" &&
    (subscription?.tier === "pro" || subscription?.tier === "premium");
  const tier = subscription?.tier ?? "free";
  const tierStyle = TIER_STYLES[tier];

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b bg-card sticky top-0 z-10 w-full shrink-0">
      <div className="flex items-center gap-3">
        <div className=" flex gap-0">
          <div className="md:hidden flex">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon
              icon={Folder01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.5}
            />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </div>

        {/* PRO / Premium tier badge in breadcrumb area */}
        {isPro && tierStyle && (
          <div
            className={cn(
              "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest",
              tierStyle.badge,
            )}
          >
            <HugeiconsIcon icon={Crown02Icon} size={9} color="white" />
            {tierStyle.label}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {balance !== null && (
          <div className="hidden sm:flex items-center gap-1 px-3 py-2 bg-[#F3F3F3] border-2 border-[#191A23] rounded-sm shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]">
            <span className="text-[10px] font-black uppercase text-[#191A23]">
              Wallet:
            </span>
            <span className="text-xs font-bold text-[#191A23]">
              ₦{balance.toLocaleString()}
            </span>
          </div>
        )}
        <Link href="/dashboard/marketplace/giftbox">
          <div className="self-start rounded-sm border-2 border-[#191A23] border-b-4 bg-[#FFD700] hover:bg-[#e6c200] px-3 py-2 text-[#191A23] font-black uppercase text-xs  active:border-b-2 active:translate-y-0.5 transition-all shrink-0">
            <HugeiconsIcon
              icon={ShoppingBasket03Icon}
              size={20}
              color="currentColor"
              strokeWidth={1.5}
            />
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative font-space h-8 w-8 rounded-full p-0"
            >
              {/* Avatar with tier ring */}
              <Avatar
                className={cn(
                  "h-8 w-8 transition-all",
                  isPro && tierStyle ? tierStyle.ring : "",
                )}
              >
                <AvatarImage
                  src={
                    user?.avatar ||
                    "https://api.dicebear.com/9.x/glass/svg?seed=a"
                  }
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              {/* Crown pip on avatar */}
              {isPro && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1 size-3.5 rounded-full flex items-center justify-center border border-white",
                    tierStyle?.badge,
                  )}
                >
                  <HugeiconsIcon icon={Crown02Icon} size={7} color="white" />
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  {isPro && tierStyle && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-wider",
                        tierStyle.badge,
                      )}
                    >
                      {tierStyle.label}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/wallet")}
              className="cursor-pointer"
            >
              <HugeiconsIcon icon={Wallet01Icon} size={16} className="mr-2" />
              Wallet
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/pricing")}
              className="cursor-pointer"
            >
              <HugeiconsIcon icon={Banknote} size={16} className="mr-2" />
              {isPro ? "Manage Plan" : "Upgrade to Pro"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer"
            >
              <HugeiconsIcon icon={Logout01Icon} size={16} className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
