"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Banknote,
  Folder01Icon,
  Logout01Icon,
  ShoppingBasket03Icon,
  Wallet01Icon,
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

export function DashboardHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      queueMicrotask(() => setUser(auth.user));
      // eslint-disable-next-line react-hooks/immutability
      fetchBalance();
    }
  }, []);

  const fetchBalance = async () => {
    const res = await getWalletBalance();
    if (res.success && res.data) {
      setBalance(res.data.walletBalance);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b bg-card sticky top-0 z-10 w-full shrink-0">
      <div className="flex items-center gap-3">
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
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    user?.avatar ||
                    "https://api.dicebear.com/9.x/glass/svg?seed=a"
                  }
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
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
              Pricing
            </DropdownMenuItem>

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
