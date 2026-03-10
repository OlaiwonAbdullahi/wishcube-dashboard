import { HugeiconsIcon } from "@hugeicons/react";
import {
  Video02Icon,
  WalletAdd02Icon,
  Cards02Icon,
  WebDesign02Icon,
  GiftCardIcon,
  WalletAdd01Icon,
  AiMagicIcon,
  Layout01Icon,
  GridIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
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
            href="#"
          />
          <QuickAction
            title="Party Room"
            icon={Video02Icon}
            color="bg-[#F8D1FF]"
            href="#"
          />
          <QuickAction
            title="Gift"
            icon={GiftCardIcon}
            color="bg-[#D1F7FF]"
            href="#"
          />
          <QuickAction
            title="Create Website"
            icon={WebDesign02Icon}
            color="bg-[#D1E9FF]"
            href="#"
          />
          <QuickAction
            title="Fund Wallet"
            icon={WalletAdd01Icon}
            color="bg-[#E0D1FF]"
            href="#"
          />
          <QuickAction
            title="Explore Templates"
            icon={GridIcon}
            color="bg-[#D1FFEB]"
            href="#"
          />
          <QuickAction
            title="Custom Designs"
            icon={Layout01Icon}
            color="bg-white"
            href="#"
          />

          <QuickAction
            title="More"
            icon={MoreHorizontalIcon}
            color="bg-white"
            href="#"
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
