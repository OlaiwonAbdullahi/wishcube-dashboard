"use client";

import { RsvpCreateData, RsvpOccasion } from "@/lib/rsvp";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/app/dashboard/cards/_components/color-picker";

const OCCASIONS: RsvpOccasion[] = ["Birthday", "Wedding", "House Warming"];

interface RsvpFormProps {
  data: RsvpCreateData;
  onChange: (data: RsvpCreateData) => void;
}

const Form = ({ data, onChange }: RsvpFormProps) => {
  const set = <K extends keyof RsvpCreateData>(key: K, value: RsvpCreateData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[10px] font-black uppercase text-[#191A23]">
          Occasion <span className="text-red-500">*</span>
        </Label>
        <Select value={data.occasion} onValueChange={(v) => set("occasion", v as RsvpOccasion)}>
          <SelectTrigger className="w-full border-2 border-[#191A23] rounded-sm h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OCCASIONS.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-black uppercase text-[#191A23]">
          Message to Guests
        </Label>
        <textarea
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Join us as we celebrate..."
          rows={3}
          className="w-full border-2 border-[#191A23] rounded-sm p-3 text-sm focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-[#191A23]">
            Venue Name
          </Label>
          <Input
            value={data.venueName}
            onChange={(e) => set("venueName", e.target.value)}
            placeholder="e.g. Grand Ballroom"
            className="border-2 border-[#191A23] rounded-sm h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-[#191A23]">
            Venue Address
          </Label>
          <Input
            value={data.venueAddress}
            onChange={(e) => set("venueAddress", e.target.value)}
            placeholder="e.g. 12 Admiralty Way, Lekki"
            className="border-2 border-[#191A23] rounded-sm h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-[#191A23]">
            Event Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            value={data.occasionDate}
            onChange={(e) => set("occasionDate", e.target.value)}
            className="border-2 border-[#191A23] rounded-sm h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-[#191A23]">
            Start Time
          </Label>
          <Input
            type="time"
            value={data.startTime}
            onChange={(e) => set("startTime", e.target.value)}
            className="border-2 border-[#191A23] rounded-sm h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-[#191A23]">
            End Time
          </Label>
          <Input
            type="time"
            value={data.endTime}
            onChange={(e) => set("endTime", e.target.value)}
            className="border-2 border-[#191A23] rounded-sm h-11"
          />
        </div>
      </div>

      <ColorPicker
        label="Accent Color"
        value={data.accentColor}
        onChange={(c) => set("accentColor", c)}
      />
    </div>
  );
};

export default Form;
