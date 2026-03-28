/* eslint-disable @typescript-eslint/no-explicit-any */
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cards02Icon,
  WebDesign02Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

interface RecentWorkWebsite {
  _id: string;
  recipientName: string;
  occasion: string;
  status: string;
  createdAt: string;
  theme: string;
}

interface RecentWorkCard {
  _id: string;
  recipientName: string;
  occasion: string;
  status: string;
  createdAt: string;
  backgroundColor: string;
}

interface RecentWorksProps {
  websites: RecentWorkWebsite[];
  cards: RecentWorkCard[];
}

interface WorkItem {
  id: string;
  title: string;
  occasion: string;
  type: "Website" | "Card";
  status: string;
  date: string;
  accent: string;
  icon: any;
  rawDate: string;
}

const RecentWorks = ({ websites, cards }: RecentWorksProps) => {
  const recentItems = [
    ...websites.map((w) => ({
      id: w._id,
      title: w.recipientName,
      occasion: w.occasion,
      type: "Website" as const,
      status: w.status,
      date: new Date(w.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      accent: "bg-[#E6D1FF]",
      icon: WebDesign02Icon,
      rawDate: w.createdAt,
    })),
    ...cards.map((c) => ({
      id: c._id,
      title: c.recipientName,
      occasion: c.occasion,
      type: "Card" as const,
      status: c.status,
      date: new Date(c.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      accent: "bg-[#FFDAAD]",
      icon: Cards02Icon,
      rawDate: c.createdAt,
    })),
  ]
    .sort(
      (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
    )
    .slice(0, 4);
  return (
    <div className="px-4 sm:px-6 pb-12">
      <Card className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-[#191A23]">
              Recent Works
            </CardTitle>
            <CardDescription className="text-neutral-600">
              Manage and view your recently created items.
            </CardDescription>
          </div>
          <Link
            href="#"
            className="text-xs font-bold underline underline-offset-4 hover:text-indigo-600 transition-colors"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          {recentItems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentItems.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest">
                No recent activity yet
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Start by creating your first card or website.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function WorkCard({ work }: { work: WorkItem }) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-sm border border-[#191A23] bg-white p-4 transition-all hover:scale-[1.02] hover:-translate-y-1 border-b-4">
      <div
        className={cn(
          "aspect-video w-full rounded-sm border border-[#191A23] flex items-center justify-center p-6 transition-all group-hover:opacity-90",
          work.accent,
        )}
      >
        <HugeiconsIcon
          icon={work.icon}
          size={48}
          color="#191A23"
          strokeWidth={1.5}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-[#191A23] bg-white text-[#191A23] font-bold"
          >
            {work.type}
          </Badge>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "size-2 rounded-full",
                work.status === "Live"
                  ? "bg-green-500"
                  : work.status === "Sent"
                    ? "bg-blue-500"
                    : "bg-yellow-500",
              )}
            />
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              {work.status}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="font-bold text-[#191A23] truncate leading-tight">
            {work.title}
            <span className="text-neutral-500 font-normal ml-1">
              ({work.occasion})
            </span>
          </p>
          <div className="mt-1 flex items-center gap-1 text-neutral-500">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={12}
              color="currentColor"
            />
            <span className="text-[10px]">{work.date}</span>
          </div>
        </div>
      </div>

      <Link
        href="#"
        className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-sm border border-[#191A23] bg-[#191A23] text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-[#B9FF66] hover:text-[#191A23]"
      >
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      </Link>
    </div>
  );
}

export default RecentWorks;
