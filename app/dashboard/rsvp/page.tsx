import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const Page = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAFAFA] to-[#F5F5F5] font-space px-4 sm:px-6 py-8 ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">RSVP</h1>
        <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#191A23] text-white text-xs font-black uppercase rounded-sm border-b-4 border-black hover:-translate-y-1 active:border-b-0 active:translate-y-0 transition-all shadow-sm">
          <HugeiconsIcon icon={Add01Icon} size={14} />
          New RSVP
        </button>
      </div>
    </div>
  );
};

export default Page;
