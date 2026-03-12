import { HugeiconsIcon } from "@hugeicons/react";
import {
  MusicNote01Icon,
  PlayIcon,
  CloudUploadIcon,
} from "@hugeicons/core-free-icons";

export default function Music() {
  return (
    <div className="space-y-4 font-space animate-in fade-in slide-in-from-bottom-2 duration-300 border border-[#191A23] rounded-sm p-4 bg-[#F3F3F3]">
      <div className="flex items-center gap-2 mb-2">
        <HugeiconsIcon
          icon={MusicNote01Icon}
          size={16}
          className="text-[#191A23]"
        />
        <h3 className="text-[10px] font-bold uppercase text-[#191A23]">
          Background Music
        </h3>
      </div>

      <div className="flex items-center justify-between border border-[#191A23] bg-white rounded-sm p-3 shadow-[0_2px_0_0_rgba(0,0,0,1)]">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#191A23]">Happy Birthday.mp3</p>
          <p className="text-[10px] font-bold text-neutral-500 uppercase">
            0:00 / 3:45
          </p>
        </div>
        <button className="h-8 w-8 flex items-center justify-center border border-[#191A23] rounded-sm bg-[#191A23] text-white hover:-translate-y-[1px] shadow-[0_2px_0_0_rgba(0,0,0,1)] transition-all">
          <HugeiconsIcon icon={PlayIcon} size={12} className="fill-white" />
        </button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 border border-[#191A23] rounded-sm font-bold uppercase text-[10px] bg-white text-[#191A23] hover:translate-y-[-2px] border-b-4 hover:border-b-4 active:border-b-2 active:translate-y-0 shadow-sm transition-all">
        <HugeiconsIcon icon={CloudUploadIcon} size={16} />
        Upload Custom Audio (Max 5MB)
      </button>
    </div>
  );
}
