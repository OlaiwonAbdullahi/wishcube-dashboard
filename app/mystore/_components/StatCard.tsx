import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="border-2 border-[#191A23] rounded-none shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={cn("p-3 border-2 border-[#191A23] rounded-none", color)}
          >
            <HugeiconsIcon icon={Icon} size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider leading-none mb-1">
              {title}
            </p>
            <p className="text-xl font-black text-[#191A23] tracking-tight leading-none">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
