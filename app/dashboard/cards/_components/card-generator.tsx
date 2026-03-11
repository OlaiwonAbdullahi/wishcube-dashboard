import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardState } from "../page";

interface CardGeneratorProps {
  cardState: CardState;
  setCardState: (state: CardState) => void;
}

export function CardGenerator({ cardState, setCardState }: CardGeneratorProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCardState({ ...cardState, [name]: value });
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
            name="userName"
            value={cardState.userName}
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
            value={cardState.recipientName}
            onChange={handleChange}
            placeholder="e.g. Sam"
            className="border-[#191A23] rounded-sm bg-white focus-visible:ring-1 focus-visible:ring-[#191A23] font-bold text-xs"
          />
        </div>

        {/* Occasion */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-[#191A23]">
            Occasion
          </Label>
          <select
            name="occasion"
            value={cardState.occasion}
            onChange={handleChange}
            className="w-full border border-[#191A23] rounded-sm bg-white px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#191A23] appearance-none"
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Wedding">Wedding</option>
            <option value="Graduation">Graduation</option>
            <option value="Thank You">Thank You</option>
            <option value="Congratulations">Congratulations</option>
            <option value="Holiday">Holiday</option>
            <option value="Just Because">Just Because</option>
          </select>
        </div>
      </div>
    </div>
  );
}
