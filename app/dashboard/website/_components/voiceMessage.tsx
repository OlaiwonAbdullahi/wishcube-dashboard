import { HugeiconsIcon } from "@hugeicons/react";
import { Mic01Icon } from "@hugeicons/core-free-icons";

export default function VoiceMessage() {
  return (
    <div className="space-y-4 font-space animate-in fade-in slide-in-from-bottom-2 duration-300 border border-[#191A23] rounded-sm p-4 bg-[#F3F3F3]">
      <div className="flex items-center gap-2 mb-2">
        <HugeiconsIcon icon={Mic01Icon} size={16} className="text-[#191A23]" />
        <h3 className="text-[10px] font-bold uppercase text-[#191A23]">
          Voice Message
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-[#191A23]/20 bg-white rounded-sm">
        <button className="size-16 rounded-full border border-[#191A23] bg-[#FFE5E5] flex items-center justify-center text-[#191A23] hover:-translate-y-[2px] shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-all group">
          <HugeiconsIcon
            icon={Mic01Icon}
            size={24}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
        <p className="mt-4 text-[10px] font-bold uppercase text-[#191A23]">
          Click to Start Recording
        </p>
        <p className="text-[10px] text-neutral-500 uppercase mt-1 tracking-wider">
          Up to 2 minutes
        </p>
      </div>
    </div>
  );
}
