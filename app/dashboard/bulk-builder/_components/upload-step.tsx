"use client";

import { useRef } from "react";
import { Download, Upload, Loader2, FileSpreadsheet, Check } from "lucide-react";

interface UploadStepProps {
  occasion: string;
  setOccasion: (v: string) => void;
  file: File | null;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onDownloadTemplate: () => void;
}

export function UploadStep({
  occasion,
  setOccasion,
  file,
  isUploading,
  onFileChange,
  onUpload,
  onDownloadTemplate,
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4 max-w-2xl">
      {/* ── Card 01 — Download Template ── */}
      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        <div className="h-1.5 bg-[#191A23]" />
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 bg-[#191A23] rounded-sm flex items-center justify-center text-white text-[10px] font-black shrink-0">
              01
            </div>
            <p className="text-sm font-black uppercase text-[#191A23]">
              Download Template
            </p>
          </div>

          <p className="text-xs text-neutral-500 font-medium pl-9">
            Get the official Excel template with the required columns for bulk
            processing.
          </p>

          <div className="pl-9">
            <button
              type="button"
              onClick={onDownloadTemplate}
              className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-white hover:bg-[#F3F3F3] transition-all shadow-[3px_3px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
              <Download size={12} strokeWidth={2.5} />
              Download .xlsx Template
            </button>
          </div>
        </div>
      </div>

      {/* ── Card 02 — Upload File ── */}
      <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
        <div className="h-1.5 bg-[#9151FF]" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="size-7 bg-[#9151FF] rounded-sm flex items-center justify-center text-white text-[10px] font-black shrink-0">
              02
            </div>
            <p className="text-sm font-black uppercase text-[#191A23]">
              Upload Your File
            </p>
          </div>

          <div className="pl-9 space-y-4">
            {/* Occasion */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#191A23]">
                Occasion <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Christmas, Employee Appreciation"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="max-w-sm rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium"
              />
            </div>

            {/* File */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#191A23]">
                Excel File (.xlsx) <span className="text-red-500">*</span>
              </label>
              <div className="relative max-w-sm">
                <input
                  type="file"
                  accept=".xlsx"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#191A23] rounded-sm bg-[#F3F3F3] hover:bg-white transition-colors">
                  <FileSpreadsheet size={16} className="text-[#9151FF] shrink-0" />
                  <span className="text-xs font-bold text-neutral-500 truncate">
                    {file ? file.name : "Click to select your filled template"}
                  </span>
                </div>
              </div>
              {file && (
                <p className="text-[9px] font-bold text-green-600 flex items-center gap-1 pl-0.5">
                  <Check size={9} strokeWidth={3} />
                  {file.name} selected
                </p>
              )}
            </div>

            {/* Upload button */}
            <button
              type="button"
              onClick={onUpload}
              disabled={isUploading || !file || !occasion.trim()}
              className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-[#191A23] text-white hover:bg-[#191A23]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[3px_3px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
              {isUploading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Upload size={13} strokeWidth={2.5} />
              )}
              {isUploading ? "Uploading & Processing…" : "Upload and Generate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
