"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { Calendar, MapPin, Sparkles, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const categories = [
  "All", "Cakes", "Flowers", "Fashion", "Gifts", "Food",
  "Accessories", "Art & Decor", "Beauty & Spa", "Events & Parties",
  "Personalized Gifts",
];

const occasions = [
  "All", "Birthday", "Anniversary", "Wedding", "Valentine's Day",
  "Mother's Day", "Father's Day", "Christmas", "New Year",
  "Graduation", "Housewarming",
];

const states = [
  "All", "Lagos", "Abuja", "Port Harcourt", "Ibadan",
  "Kano", "Enugu", "Benin City", "Kaduna",
];

export interface FilterState {
  search: string;
  category: string;
  occasion: string;
  state: string;
  minPrice: string;
  maxPrice: string;
}

interface FiltersProps {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onResetAdvanced: () => void;
}

function FilterSelects({ filters, onChange }: Pick<FiltersProps, "filters" | "onChange">) {
  return (
    <>
      <div className="w-full lg:w-40">
        <Select value={filters.category} onValueChange={(v) => onChange("category", v)}>
          <SelectTrigger className="border-2 border-[#191A23] rounded-sm font-black uppercase text-[10px] h-10 w-full focus:ring-0">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={FilterIcon} size={13} />
              <SelectValue placeholder="CATEGORY" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="font-bold uppercase text-[10px]">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full lg:w-40">
        <Select value={filters.occasion} onValueChange={(v) => onChange("occasion", v)}>
          <SelectTrigger className="border-2 border-[#191A23] rounded-sm font-black uppercase text-[10px] h-10 w-full focus:ring-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <SelectValue placeholder="OCCASION" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            {occasions.map((occ) => (
              <SelectItem key={occ} value={occ} className="font-bold uppercase text-[10px]">
                {occ}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full lg:w-36">
        <Select value={filters.state} onValueChange={(v) => onChange("state", v)}>
          <SelectTrigger className="border-2 border-[#191A23] rounded-sm font-black uppercase text-[10px] h-10 w-full focus:ring-0">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <SelectValue placeholder="LOCATION" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            {states.map((s) => (
              <SelectItem key={s} value={s} className="font-bold uppercase text-[10px]">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function AdvancedFilters({ filters, onChange, onResetAdvanced }: FiltersProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-2 border-[#191A23] rounded-sm font-black uppercase text-[10px] h-10 gap-2 hover:bg-[#191A23] hover:text-white transition-all w-full lg:w-auto"
        >
          <Sparkles className="w-3 h-3" />
          Advanced
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] p-4 space-y-4">
        <h4 className="font-black uppercase text-xs tracking-widest text-neutral-400">
          Price Range (₦)
        </h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="h-9 border-2 border-[#191A23] rounded-sm font-bold text-xs"
          />
          <span className="font-black text-neutral-400">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="h-9 border-2 border-[#191A23] rounded-sm font-bold text-xs"
          />
        </div>
        <Button
          variant="outline"
          className="w-full h-9 border-2 border-[#191A23] font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:bg-[#191A23] hover:text-white transition-all active:shadow-none active:translate-x-px active:translate-y-px"
          onClick={onResetAdvanced}
        >
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function MarketplaceFilters({ filters, onChange, onResetAdvanced }: FiltersProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex items-center gap-3 flex-wrap">
        <div className="relative group">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#191A23] transition-colors"
          />
          <Input
            placeholder="SEARCH..."
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="pl-9 w-56 border-2 border-[#191A23] rounded-sm font-black text-xs h-10 focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all placeholder:text-neutral-300 placeholder:font-bold"
          />
        </div>
        <FilterSelects filters={filters} onChange={onChange} />
        <AdvancedFilters filters={filters} onChange={onChange} onResetAdvanced={onResetAdvanced} />
      </div>

      {/* Mobile/Tablet */}
      <div className="flex lg:hidden items-center gap-3 w-full">
        <div className="relative flex-1 group">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#191A23] transition-colors"
          />
          <Input
            placeholder="SEARCH..."
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="pl-9 w-full border-2 border-[#191A23] rounded-sm font-black text-xs h-10 focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all placeholder:text-neutral-300"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="border-2 border-[#191A23] rounded-sm h-10 w-10 p-0 hover:bg-[#191A23] hover:text-white transition-all shrink-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] px-5">
            <SheetHeader className="mb-6">
              <SheetTitle className="font-black uppercase tracking-tighter text-xl">
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3">
              <FilterSelects filters={filters} onChange={onChange} />
              <AdvancedFilters filters={filters} onChange={onChange} onResetAdvanced={onResetAdvanced} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
