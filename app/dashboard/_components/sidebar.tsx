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
    title: "Create Websites",
    icon: WebDesign02Icon,
    iconColor: "text-amber-500",
    href: "/dashboard/websites",
  },
  {
    title: "Send Gifts",
    icon: GiftCardIcon,
    iconColor: "text-green-500",
    href: "/dashboard/gifts",
  },
  {
    title: "Party Rooms",
    icon: Video02Icon,
    iconColor: "text-cyan-500",
    href: "/dashboard/party-rooms",
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
    <Sidebar collapsible="offcanvas" className="!border-r-0" {...props}>
      <SidebarHeader className="px-3 py-5 border-b border-neutral-300">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-[#191A23] truncate">
            WishCube
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-10">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-9"
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
