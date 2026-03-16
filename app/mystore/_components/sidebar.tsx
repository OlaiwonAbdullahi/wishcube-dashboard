"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  PackageIcon,
  ShoppingBag01Icon,
  Analytics01Icon,
  Settings01Icon,
  Store01Icon,
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
    href: "/mystore",
  },
  {
    title: "Products",
    icon: PackageIcon,
    iconColor: "text-blue-500",
    href: "/mystore/products",
  },
  {
    title: "Orders",
    icon: ShoppingBag01Icon,
    iconColor: "text-amber-500",
    href: "/mystore/orders",
  },
  {
    title: "Analytics",
    icon: Analytics01Icon,
    iconColor: "text-green-500",
    href: "/mystore/analytics",
  },
  {
    title: "Store Settings",
    icon: Store01Icon,
    iconColor: "text-pink-500",
    href: "/mystore/settings",
  },
  {
    title: "General Settings",
    icon: Settings01Icon,
    iconColor: "text-muted-foreground",
    href: "/dashboard/settings",
  },
];

export function StoreSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="!border-r-0" {...props}>
      <SidebarHeader className="px-4 py-5 border-b border-neutral-300">
        <div className="flex items-end gap-1  w-full">
          <img
            src="/logo.png"
            alt="WishCube Logo"
            className="w-8 h-8 rounded-md"
          />
          <span className="font-semibold text-[#191A23] truncate">
            WishCube Vendor
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
                      className={cn(
                        "h-11 px-4 rounded-sm transition-all duration-200 border-2 border-transparent",
                        isActive
                          ? "bg-[#191A23] text-white shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] border-[#191A23] -translate-x-0.5 -translate-y-0.5 hover:bg-[#191A23] hover:text-white"
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-[#191A23]"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={item.icon}
                          size={18}
                          className={cn(
                            "transition-colors duration-200",
                            isActive ? "text-white" : item.iconColor
                          )}
                        />
                        <span className="font-black uppercase text-[10px] tracking-wider">
                          {item.title}
                        </span>
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
