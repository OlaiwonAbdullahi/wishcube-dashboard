import { HugeiconsIcon } from "@hugeicons/react";
import {
  Video02Icon,
  WalletAdd02Icon,
  Cards02Icon,
  WebDesign02Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const Overview = () => {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#191A23]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-neutral-600">
            Start something new or pick up from your recent activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            className="rounded-sm bg-[#191A23] text-white border border-[#191A23] border-b-4 hover:bg-[#191A23]/90 hover:scale-[1.02] transition-transform flex items-center"
          >
            <Link href="#" className="gap-2 flex items-center">
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
        <KpiCard title="Cards created" value="0" hint="Drafts + sent" />
        <KpiCard title="Website created" value="0" hint="Drafts + sent" />
        <KpiCard title="Wallet" value="0" hint="Total Funds" />
        <KpiCard title="Gifts attached" value="0" hint="Cards with value" />
      </div>

      <Card className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3]">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-bold text-[#191A23]">
            Quick start
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Jump straight into the parts of WishCube you&apos;ll use most.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            title="Generate a greeting Card"
            description="AI-assisted message + shareable Card"
            icon={
              <HugeiconsIcon
                icon={Cards02Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
              />
            }
            href="#"
            accent="text-indigo-600"
          />
          <QuickAction
            title="Generate an greeting Website"
            description="AI-assisted message + shareable Website"
            icon={
              <HugeiconsIcon
                icon={WebDesign02Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
              />
            }
            href="#"
            accent="text-indigo-600"
          />
          <QuickAction
            title="Join a Virtual Party Room"
            description="Live video calls, interactive games, group chat, shared music, and contextual decorations"
            icon={
              <HugeiconsIcon
                icon={Video02Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
              />
            }
            href="#"
            accent="text-indigo-600"
          />
        </CardContent>
      </Card>
    </div>
  );
};

function KpiCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3]">
      <CardHeader className="pb-0">
        <CardDescription className="text-neutral-500 text-xs uppercase font-semibold">
          {title}
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-[#191A23]">
          {value}
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
  description,
  icon,
  href,
  accent,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-start gap-4 rounded-sm border border-[#191A23] bg-white p-5 transition-all hover:scale-[1.02] hover:-translate-y-1 border-b-4"
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-sm bg-[#F3F3F3] border border-[#191A23]",
          accent,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold leading-none truncate text-[#191A23]">
            {title}
          </p>
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.5}
            className="text-[#191A23] opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
        <p className="mt-2 text-xs text-neutral-600 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default Overview;
