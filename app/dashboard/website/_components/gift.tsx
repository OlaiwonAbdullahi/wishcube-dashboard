import { cn } from "@/lib/utils";
import { GiftItem } from "./website-form";

interface GiftProps {
  gifts: GiftItem[];
  onSelectGift: (id: string) => void;
  selectedGift?: string | null;
}

export default function Gift({ gifts, onSelectGift, selectedGift }: GiftProps) {
  return (
    <div className="space-y-3 font-space animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-2 gap-3">
        {gifts.map((gift) => (
          <button
            key={gift.id}
            type="button"
            onClick={() => onSelectGift(gift.id)}
            className={cn(
              "flex flex-col items-center justify-center p-4 border border-[#191A23] rounded-sm transition-all text-center gap-2",
              selectedGift === gift.id
                ? "bg-[#191A23] text-white shadow-[0_4px_0_0_rgba(0,0,0,1)] -translate-y-[2px]"
                : "bg-white text-[#191A23] hover:bg-[#191A23]/5 shadow-[0_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-[1px]",
            )}
          >
            <div
              className={cn(
                "size-12 rounded-full flex items-center justify-center border border-[#191A23]",
                gift.bgColor,
                selectedGift === gift.id ? "bg-white text-[#191A23]" : "",
              )}
            >
              {gift.icon}
            </div>
            <div className="space-y-1">
              <p
                className={cn(
                  "text-xs font-bold uppercase",
                  selectedGift === gift.id ? "text-white" : "text-[#191A23]",
                )}
              >
                {gift.name}
              </p>
              <p
                className={cn(
                  "text-[10px] font-bold opacity-70",
                  selectedGift === gift.id ? "text-white" : "text-[#191A23]",
                )}
              >
                ₦{gift.price}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
