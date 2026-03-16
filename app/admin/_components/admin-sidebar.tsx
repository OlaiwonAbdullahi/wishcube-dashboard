"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Cards02Icon,
  Analytics01Icon,
  Settings01Icon,
  WebDesign02Icon,
  Store01Icon,
  Mail02Icon,
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
    href: "/admin",
  },
  {
    title: "User Management",
    icon: UserGroupIcon,
    iconColor: "text-blue-500",
    href: "/admin/users",
  },
  {
    title: "Vendor Management",
    icon: Store01Icon,
    iconColor: "text-pink-500",
    href: "/admin/vendors",
  },
  {
    title: "Waitlist Management",
    icon: Mail02Icon,
    iconColor: "text-indigo-500",
    href: "/admin/waitlist",
  },
  {
    title: "Card Management",
    icon: Cards02Icon,
    iconColor: "text-amber-500",
    href: "/admin/cards",
  },
  {
    title: "Website Management",
    icon: WebDesign02Icon,
    iconColor: "text-green-500",
    href: "/admin/websites",
  },
  {
    title: "Analytics",
    icon: Analytics01Icon,
    iconColor: "text-cyan-500",
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings01Icon,
    iconColor: "text-muted-foreground",
    href: "/admin/settings",
  },
];

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="!border-r-0" {...props}>
      <SidebarHeader className="px-4 py-5 border-b border-neutral-300">
        <div className="flex items-end gap-1 w-full">
          <img
            src="/logo.png"
            alt="WishCube Logo"
            className="w-8 h-8 rounded-md"
          />
          <span className="font-semibold text-[#191A23] truncate">
            WishCube Admin
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
                        "h-10 px-3 transition-all duration-200",
                        isActive
                          ? "bg-[#191A23] text-white hover:bg-[#191A23] hover:text-white"
                          : "text-[#191A23]/60 hover:bg-[#191A23]/5 hover:text-[#191A23]"
                      )}
                    >
                      <Link href={item.href}>
                        <div
                          className={cn(
                            "flex items-center justify-center w-5 h-5 mr-3 transition-transform duration-200",
                            isActive ? "scale-110" : "group-hover:scale-110"
                          )}
                        >
                          <HugeiconsIcon
                            icon={item.icon}
                            size={20}
                            color="currentColor"
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                        </div>
                        <span className="text-sm font-medium">
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
