"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ImageAdd01Icon,
  Cancel01Icon,
  Calendar03Icon,
  Location01Icon,
  UserGroupIcon,
  MessageQuestionIcon,
  PaintBoardIcon,
} from "@hugeicons/core-free-icons";
import { Loader2 } from "lucide-react";
import { RsvpCreateData, RsvpOccasion, uploadRsvpCoverImage } from "@/lib/rsvp";
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
import { QuestionBuilder } from "./question-builder";

const OCCASIONS: RsvpOccasion[] = ["Birthday", "Wedding", "House Warming"];

interface RsvpFormProps {
  data: RsvpCreateData;
  onChange: (data: RsvpCreateData) => void;
}

function SectionHeader({
  icon,
  title,
  hint,
}: {
  icon: any;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="size-7 rounded-sm bg-[#F3F3F3] border border-[#191A23]/15 flex items-center justify-center shrink-0">
        <HugeiconsIcon icon={icon} size={14} color="#191A23" />
      </div>
      <div>
        <p className="text-xs font-black uppercase text-[#191A23]">{title}</p>
        {hint && <p className="text-[10px] text-neutral-400">{hint}</p>}
      </div>
    </div>
  );
}

const Form = ({ data, onChange }: RsvpFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof RsvpCreateData>(key: K, value: RsvpCreateData[K]) =>
    onChange({ ...data, [key]: value });

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadRsvpCoverImage(file);
      if (res.success && res.data?.images?.[0]) {
        set("coverImage", res.data.images[0]);
      } else {
        toast.error(res.message || "Failed to upload cover image");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-7">
      {/* ── Cover image ── */}
      <div className="space-y-2.5">
        <SectionHeader icon={ImageAdd01Icon} title="Cover Image" />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
        {data.coverImage?.url ? (
          <div className="relative rounded-sm overflow-hidden border-2 border-[#191A23] h-40">
            <img
              src={data.coverImage.url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => set("coverImage", null)}
              className="absolute top-2 right-2 size-7 rounded-sm bg-white border-2 border-[#191A23] flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-32 border-2 border-dashed border-[#191A23]/30 rounded-sm flex flex-col items-center justify-center gap-1.5 text-neutral-400 hover:border-[#191A23] hover:text-[#191A23] hover:bg-[#F9F9FB] transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <HugeiconsIcon icon={ImageAdd01Icon} size={20} />
            )}
            <span className="text-[10px] font-black uppercase">
              {isUploading ? "Uploading…" : "Upload a cover image"}
            </span>
          </button>
        )}
      </div>

      {/* ── Basics ── */}
      <div className="space-y-2.5">
        <SectionHeader icon={Calendar03Icon} title="Event Details" />
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-[#191A23]">
            Event Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Sarah's 30th Birthday Bash"
            className="border-2 border-[#191A23] rounded-sm h-11 text-base font-bold"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-[#191A23]">
              Occasion
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
            <Label className="text-[10px] font-black uppercase text-[#191A23] flex items-center gap-1">
              <HugeiconsIcon icon={UserGroupIcon} size={11} />
              Guest Limit (optional)
            </Label>
            <Input
              type="number"
              min={1}
              value={data.capacity ?? ""}
              onChange={(e) => set("capacity", e.target.value ? Number(e.target.value) : null)}
              placeholder="Unlimited"
              className="border-2 border-[#191A23] rounded-sm h-11"
            />
          </div>
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
      </div>

      {/* ── Location & schedule ── */}
      <div className="space-y-2.5">
        <SectionHeader icon={Location01Icon} title="Location & Time" />
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
      </div>

      {/* ── Custom questions (form builder) ── */}
      <div className="space-y-2.5">
        <SectionHeader
          icon={MessageQuestionIcon}
          title="Custom Questions"
          hint="Ask guests anything beyond yes/no — dietary needs, T-shirt size, song requests..."
        />
        <QuestionBuilder
          questions={data.customQuestions}
          onChange={(customQuestions) => set("customQuestions", customQuestions)}
        />
      </div>

      {/* ── Appearance ── */}
      <div className="space-y-2.5">
        <SectionHeader icon={PaintBoardIcon} title="Appearance" />
        <ColorPicker
          label="Accent Color"
          value={data.accentColor}
          onChange={(c) => set("accentColor", c)}
        />
      </div>
    </div>
  );
};

export default Form;
