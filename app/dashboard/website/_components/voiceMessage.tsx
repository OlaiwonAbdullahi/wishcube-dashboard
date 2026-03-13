import { HugeiconsIcon } from "@hugeicons/react";
import { Mic01Icon, MagicWand01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { callAI } from "@/lib/ai";

export default function VoiceMessage() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [transcription, setTranscription] = useState("");

  const enhanceVoice = async () => {
    setIsEnhancing(true);
    try {
      // Simulate sending audio to Gemini 3 Flash (mapping to 2.0-flash-exp)
      const response = await callAI(
        "Listen to this voice message (simulated) and transcribe it into a beautiful, polished written greeting message.",
        "google/gemini-3-flash-preview"
      );
      setTranscription(response);
    } catch (error) {
      console.error("Enhancement failed:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4 font-space animate-in fade-in slide-in-from-bottom-2 duration-300 border border-[#191A23] rounded-sm p-4 bg-[#F3F3F3]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Mic01Icon}
            size={16}
            className="text-[#191A23]"
          />
          <h3 className="text-[10px] font-bold uppercase text-[#191A23]">
            Voice Message
          </h3>
        </div>
        <button
          type="button"
          onClick={enhanceVoice}
          disabled={isEnhancing}
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 border border-blue-300 rounded-sm text-[8px] font-black text-blue-700 hover:bg-blue-200 transition-all disabled:opacity-50"
        >
          <HugeiconsIcon
            icon={MagicWand01Icon}
            size={10}
            className={isEnhancing ? "animate-spin" : ""}
          />
          {isEnhancing ? "ENHANCING..." : "MAGIC ENHANCE"}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-[#191A23]/20 bg-white rounded-sm">
        <button
          type="button"
          className="size-16 rounded-full border border-[#191A23] bg-[#FFE5E5] flex items-center justify-center text-[#191A23] hover:-translate-y-[2px] shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-all group"
        >
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

      {transcription && (
        <div className="mt-4 p-3 bg-white border border-[#191A23] rounded-sm shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
          <p className="text-[10px] font-bold uppercase text-blue-600 mb-1">
            AI Polished Transcription:
          </p>
          <p className="text-xs text-[#191A23] italic">
            &apos;{transcription} &apos;
          </p>
        </div>
      )}
    </div>
  );
}
