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

const recentWorks = [
  {
    id: 1,
    title: "Birthday Surprise",
    type: "Website",
    status: "Live",
    date: "March 10, 2026",
    accent: "bg-[#B9FF66]",
    icon: WebDesign02Icon,
  },
  {
    id: 2,
    title: "Wedding Anniversary",
    type: "Card",
    status: "Sent",
    date: "March 8, 2026",
    accent: "bg-[#FFDAAD]",
    icon: Cards02Icon,
  },
  {
    id: 3,
    title: "New Job Celebration",
    type: "Card",
    status: "Draft",
    date: "March 5, 2026",
    accent: "bg-[#D1E9FF]",
    icon: Cards02Icon,
  },
  {
    id: 4,
    title: "Graduation Party",
    type: "Website",
    status: "Draft",
    date: "March 2, 2026",
    accent: "bg-[#E6D1FF]",
    icon: WebDesign02Icon,
  },
];

const RecentWorks = () => {
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function WorkCard({ work }: { work: (typeof recentWorks)[0] }) {
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
