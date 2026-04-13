"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Cards02Icon,
  WebDesign02Icon,
  GiftCardIcon,
  Video02Icon,
  Settings01Icon,
  WalletAdd02Icon,
  Calendar02FreeIcons,
} from "@hugeicons/core-free-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { IconSvgElement } from "@hugeicons/react";

type NavItem = {
  title: string;
  icon: IconSvgElement;
  iconColor: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    title: "Overview",
    icon: DashboardSquare01Icon,
    iconColor: "text-violet-500",
    href: "/dashboard",
  },
  {
    title: "Create Cards",
    icon: Cards02Icon,
    iconColor: "text-blue-500",
    href: "/dashboard/cards",
  },
  {
    title: "Create Pages",
    icon: WebDesign02Icon,
    iconColor: "text-amber-500",
    href: "/dashboard/website",
  },
  // {
  //   title: "RSVP",
  //   icon: Calendar02FreeIcons,
  //   iconColor: "text-pink-500",
  //   href: "/dashboard/rsvp",
  // },
  {
    title: "Marketplace",
    icon: GiftCardIcon,
    iconColor: "text-green-500",
    href: "/dashboard/marketplace",
  },
  {
    title: "Wallet",
    icon: WalletAdd02Icon,
    iconColor: "text-emerald-500",
    href: "/dashboard/wallet",
  },
  {
    title: "Party Rooms",
    icon: Video02Icon,
    iconColor: "text-cyan-500",
    href: "/dashboard/party-room",
  },
  {
    title: "Settings",
    icon: Settings01Icon,
    iconColor: "text-muted-foreground",
    href: "/dashboard/settings",
  },
];

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0!" {...props}>
      <SidebarHeader className="px-4 py-5 border-b border-neutral-300 bg-[#F3F3F3]">
        <div className="flex items-end gap-1  w-full">
          <img
            src="/logo.png"
            alt="WishCube Logo"
            className="w-8 h-8 rounded-md"
          />
          <span className="font-semibold text-[#191A23] truncate">
            WishCube
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-10 bg-[#F3F3F3]">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`h-9 ${
                        isActive ? "bg-neutral-300 text-black" : ""
                      }`}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon
                          icon={item.icon}
                          className={cn("size-4 shrink-0", item.iconColor)}
                          strokeWidth={1.5}
                        />
                        <h2 className="text-md">{item.title}</h2>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
