import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardState } from "../page";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAuth } from "@/lib/auth";

interface CardGeneratorProps {
  cardState: CardState;
  setCardState: (state: CardState) => void;
}

export function CardGenerator({ cardState, setCardState }: CardGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCardState({ ...cardState, [name]: value });
  };

  const handleGenerateAI = async () => {
    if (!cardState.recipientName || !cardState.occasion) {
      toast.error("Please provide recipient name and occasion first");
      return;
    }

    setIsGenerating(true);
    const auth = getAuth();
    try {
      const res = await fetch("http://localhost:5000/api/cards/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          recipientName: cardState.recipientName,
          senderName: cardState.senderName,
          occasion: cardState.occasion,
          relationship: cardState.relationship || "Friend",
          language: cardState.language || "English",
          tone: cardState.aiTone || "Heartfelt",
        }),
      });

      const data = await res.json();
      if (data.success && data.data.suggestions.length > 0) {
        // For now, let's take the first suggestion
        setCardState({
          ...cardState,
          message: data.data.suggestions[0],
          isAiGenerated: true,
        });
        toast.success("Message generated!");
      } else {
        toast.error("Failed to generate suggestions");
      }
    } catch (error) {
      console.error("AI Generation error:", error);
      toast.error("Something went wrong with AI generation");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 font-space">
      <div className="space-y-1">
        <h3 className="text-sm font-bold uppercase text-[#191A23]">
          Basic Details
        </h3>
        <p className="text-[10px] text-neutral-600 uppercase font-semibold">
          Tell us about the person and the occasion
        </p>
      </div>

      <div className="space-y-4">
        {/* Sender Name */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-[#191A23]">
            Your Name / Nickname
          </Label>
          <Input
            name="senderName"
            value={cardState.senderName || ""}
            onChange={handleChange}
            placeholder="e.g. Alex"
            className="border-[#191A23] rounded-sm bg-white focus-visible:ring-1 focus-visible:ring-[#191A23] font-bold text-xs"
          />
        </div>

        {/* Recipient Name */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-[#191A23]">
            Recipient&apos;s Name
          </Label>
          <Input
            name="recipientName"
            value={cardState.recipientName || ""}
            onChange={handleChange}
            placeholder="e.g. Sam"
            className="border-[#191A23] rounded-sm bg-white focus-visible:ring-1 focus-visible:ring-[#191A23] font-bold text-xs"
          />
        </div>

        {/* Relationship */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-[#191A23]">
            Relationship
          </Label>
          <select
            name="relationship"
            value={cardState.relationship || "Friend"}
            onChange={handleChange}
            className="w-full border border-[#191A23] rounded-sm bg-white px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#191A23] appearance-none"
          >
            {[
              "Friend",
              "Partner",
              "Parent",
              "Sibling",
              "Child",
              "Colleague",
              "Mentor",
              "Other",
            ].map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        </div>

        {/* Occasion */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-[#191A23]">
            Occasion
          </Label>
          <select
            name="occasion"
            value={cardState.occasion || "Birthday"}
            onChange={handleChange}
            className="w-full border border-[#191A23] rounded-sm bg-white px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#191A23] appearance-none"
          >
            {[
              "Birthday",
              "Anniversary",
              "Wedding",
              "Graduation",
              "Thank You",
              "Congratulations",
              "Holiday",
              "Just Because",
            ].map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </select>
        </div>

        {/* AI Tone and Generation */}
        <div className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-[#191A23]">
              Message Tone (for AI)
            </Label>
            <select
              name="aiTone"
              value={cardState.aiTone || "Heartfelt"}
              onChange={handleChange}
              className="w-full border border-[#191A23] rounded-sm bg-white px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#191A23] appearance-none"
            >
              {["Heartfelt", "Funny", "Poetic", "Professional", "Playful"].map(
                (tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                )
              )}
            </select>
          </div>

          <Button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-full bg-[#FFD700] text-[#191A23] hover:bg-[#FFD700]/90 font-black uppercase text-[10px] h-10 gap-2 border-2 border-[#191A23] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] active:shadow-none active:translate-x-px active:translate-y-px transition-all"
          >
            {isGenerating ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Sparkles className="size-3" />
            )}
            {isGenerating ? "Generating..." : "Generate AI Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}
