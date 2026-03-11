"use client";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2 font-space">
      {label && (
        <label className="text-[10px] font-bold uppercase">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={handleChange}
          className="h-10 w-12 cursor-pointer rounded-sm border border-[#191A23] p-1 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="text-xs font-mono font-bold flex-1 rounded-sm border border-[#191A23] bg-white px-2 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#191A23]"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}
