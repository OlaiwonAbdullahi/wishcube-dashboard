"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Send, Loader2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLoadSelectedFont } from "@/lib/use-google-fonts";

import { UploadStep } from "./_components/upload-step";
import { BatchStylingPanel, AiTone } from "./_components/batch-styling-panel";
import { RecipientCard } from "./_components/recipient-card";
import { BulkGiftModal, AttachGiftData } from "./_components/gift-modal";
import { BulkAssetModal, AssetData } from "./_components/asset-modal";
import { PublishedStep } from "./_components/published-step";
import { THEMES, Theme } from "./_components/theme-picker";

import {
  BulkUpload,
  BulkRecipient,
  BulkStyleConfig,
  downloadTemplate,
  uploadBulkFile,
  attachGiftToRecipient,
  attachAssetsToRecipient,
  getBulkSummary,
  publishBulk,
  exportBulkLinks,
  updateRecipientMessage,
  regenerateRecipientMessage,
} from "@/lib/bulk";

// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ["upload", "preview", "published"] as const;
type Step = (typeof STEPS)[number];

// ─────────────────────────────────────────────────────────────────────────────

export default function BulkBuilderPage() {
  // ── Upload ─────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("upload");
  const [occasion, setOccasion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [bulkInfo, setBulkInfo] = useState<BulkUpload | null>(null);
  const [recipients, setRecipients] = useState<BulkRecipient[]>([]);

  // ── Summary polling ────────────────────────────────────────────────────────
  const [summary, setSummary] = useState<{
    total: number;
    gift_attached: number;
    pending: number;
    ai_generation_status: "pending" | "completed" | "failed";
    ready_to_publish: boolean;
  } | null>(null);

  useEffect(() => {
    if (step === "preview" && bulkInfo?.bulk_id) {
      fetchSummary();
      const interval = setInterval(fetchSummary, 5000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, bulkInfo]);

  const fetchSummary = async () => {
    if (!bulkInfo?.bulk_id) return;
    try {
      const res = await getBulkSummary(bulkInfo.bulk_id);
      if (res.success && res.data) setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch bulk summary:", err);
    }
  };

  // ── Gift modal ─────────────────────────────────────────────────────────────
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);

  // ── Asset modal ─────────────────────────────────────────────────────────────
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAttachingAssets, setIsAttachingAssets] = useState(false);

  // ── Batch styling ──────────────────────────────────────────────────────────
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [selectedFont, setSelectedFont] = useState("Space Grotesk");
  const [fontSearch, setFontSearch] = useState("");
  const [layout, setLayout] = useState<"classic" | "modern">("classic");
  const [language, setLanguage] = useState("English");
  const [aiTone, setAiTone] = useState<AiTone>("Professional");
  const [expiresAt, setExpiresAt] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [stylingOpen, setStylingOpen] = useState(true);

  // ── Publish ────────────────────────────────────────────────────────────────
  const [isPublishing, setIsPublishing] = useState(false);

  // Load chosen font into the document so the live preview renders correctly
  useLoadSelectedFont(selectedFont);

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedRecipient =
    recipients.find((r) => r.row_id === selectedRowId) ?? null;

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetAll = () => {
    setStep("upload");
    setBulkInfo(null);
    setRecipients([]);
    setFile(null);
    setOccasion("");
    setSummary(null);
    setSelectedTheme(THEMES[0]);
    setSelectedFont("Space Grotesk");
    setFontSearch("");
    setLayout("classic");
    setLanguage("English");
    setAiTone("Professional");
    setIsPasswordProtected(false);
    setPassword("");
    setStylingOpen(true);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate();
      toast.success("Template downloaded!");
    } catch {
      toast.error("Failed to download template");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file to upload");
    if (!occasion.trim()) return toast.error("Please enter an occasion");

    setIsUploading(true);
    const res = await uploadBulkFile(file, occasion.trim());
    setIsUploading(false);

    if (res.success && res.data) {
      setBulkInfo(res.data.upload);
      setRecipients(res.data.preview);
      setStep("preview");
      toast.success(
        `Uploaded! ${res.data.preview.length} recipient(s) processed.`,
      );
    } else {
      toast.error(res.message || "Upload failed");
    }
  };

  const openGiftModal = (rowId: string) => {
    setSelectedRowId(rowId);
    setIsGiftModalOpen(true);
  };

  const openAssetModal = (rowId: string) => {
    setSelectedRowId(rowId);
    setIsAssetModalOpen(true);
  };

  const handleAttachAssets = async (assetData: AssetData) => {
    if (!selectedRowId || !bulkInfo?.bulk_id) return;
    setIsAttachingAssets(true);
    const res = await attachAssetsToRecipient(
      bulkInfo.bulk_id,
      selectedRowId,
      assetData,
    );
    setIsAttachingAssets(false);

    if (res.success && res.data) {
      toast.success("Assets saved successfully!");
      setIsAssetModalOpen(false);
      setRecipients((prev) =>
        prev.map((r) => (r.row_id === selectedRowId ? res.data!.recipient : r)),
      );
    } else {
      toast.error(res.message || "Failed to save assets");
    }
  };

  const handleAttachGift = async (giftData: AttachGiftData) => {
    if (!selectedRowId || !bulkInfo?.bulk_id) return;
    setIsAttaching(true);
    const res = await attachGiftToRecipient(
      bulkInfo.bulk_id,
      selectedRowId,
      giftData,
    );
    setIsAttaching(false);

    if (res.success && res.data) {
      toast.success("Gift attached successfully!");
      setIsGiftModalOpen(false);
      setRecipients((prev) =>
        prev.map((r) => (r.row_id === selectedRowId ? res.data!.recipient : r)),
      );
      fetchSummary();
    } else {
      toast.error(res.message || "Failed to attach gift");
    }
  };

  const handleUpdateMessage = async (rowId: string, message: string) => {
    if (!bulkInfo?.bulk_id) return;
    const res = await updateRecipientMessage(bulkInfo.bulk_id, rowId, message);
    if (res.success && res.data) {
      setRecipients((prev) =>
        prev.map((r) => (r.row_id === rowId ? res.data!.recipient : r)),
      );
      toast.success("Message updated");
    } else {
      toast.error(res.message || "Failed to update message");
    }
  };

  const handleRegenerateMessage = async (rowId: string) => {
    if (!bulkInfo?.bulk_id) return;
    const res = await regenerateRecipientMessage(
      bulkInfo.bulk_id,
      rowId,
      aiTone,
      language,
    );
    if (res.success && res.data) {
      setRecipients((prev) =>
        prev.map((r) => (r.row_id === rowId ? res.data!.recipient : r)),
      );
      toast.success("Message regenerated");
    } else {
      toast.error(res.message || "Failed to regenerate message");
    }
  };

  const handlePublish = async () => {
    if (!bulkInfo?.bulk_id) return;
    setIsPublishing(true);

    const styleConfig: BulkStyleConfig = {
      theme: selectedTheme.name,
      font: selectedFont,
      layout,
      language,
      aiTone,
      expiresAt,
      isPasswordProtected,
      password: isPasswordProtected ? password : undefined,
    };

    const res = await publishBulk(bulkInfo.bulk_id, styleConfig);
    setIsPublishing(false);

    if (
      res.success ||
      res.message?.includes("Accepted") ||
      res.message?.includes("started")
    ) {
      toast.success("Batch publishing started in the background!");
      setStep("published");
    } else {
      toast.error(res.message || "Failed to publish");
    }
  };

  const handleExport = async () => {
    if (!bulkInfo?.bulk_id) return;
    try {
      await exportBulkLinks(bulkInfo.bulk_id);
      toast.success("Export downloaded successfully!");
    } catch {
      toast.error("Failed to export links. Make sure processing is done.");
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-[#191A23]">
            Bulk Builder
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            Generate automated personalised wishcubes for your entire team.
          </p>
        </div>

        {/* Step breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
          {STEPS.map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-neutral-300 text-[8px]">›</span>}
              <span
                className={cn(
                  "px-2.5 py-1 rounded-sm border",
                  step === s
                    ? "bg-[#191A23] text-white border-[#191A23]"
                    : STEPS.indexOf(step) > i
                      ? "bg-[#B4F8C8] text-[#191A23] border-[#191A23]"
                      : "text-neutral-400 border-neutral-200 bg-white",
                )}
              >
                {s}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 1 — UPLOAD
      ══════════════════════════════════════════════════════════════════════ */}
      {step === "upload" && (
        <UploadStep
          occasion={occasion}
          setOccasion={setOccasion}
          file={file}
          isUploading={isUploading}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          onDownloadTemplate={handleDownloadTemplate}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 2 — PREVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {step === "preview" && (
        <div className="space-y-5">
          {/* Batch header bar */}
          <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
            <div className="h-1.5 bg-[#191A23]" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                  Batch Summary
                </p>
                <h2 className="text-base font-black text-[#191A23] mt-0.5 capitalize">
                  {bulkInfo?.occasion}
                </h2>
                <p className="text-xs font-medium text-neutral-500 mt-0.5">
                  {bulkInfo?.total ?? recipients.length} recipient
                  {(bulkInfo?.total ?? recipients.length) !== 1 ? "s" : ""}{" "}
                  loaded
                </p>
              </div>

              {/* Summary pills */}
              {summary && (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#191A23]/20 rounded-sm bg-[#F3F3F3] text-[9px] font-black uppercase text-neutral-600">
                    <span className="size-2 rounded-full bg-[#B4F8C8] border border-[#191A23]" />
                    Gifts: {summary.gift_attached}/{summary.total}
                  </span>
                  {summary.pending > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-amber-300 rounded-sm bg-amber-50 text-[9px] font-black uppercase text-amber-700">
                      {summary.pending} pending
                    </span>
                  )}
                  {summary.ai_generation_status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-blue-300 rounded-sm bg-blue-50 text-[9px] font-black uppercase text-blue-700">
                      <Loader2 size={9} className="animate-spin" />
                      AI Generating...
                    </span>
                  )}
                  {summary.ai_generation_status === "failed" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-red-300 rounded-sm bg-red-50 text-[9px] font-black uppercase text-red-700">
                      AI Failed
                    </span>
                  )}
                  {summary.ready_to_publish && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#191A23] rounded-sm bg-[#B4F8C8] text-[9px] font-black uppercase text-[#191A23]">
                      <Check size={9} strokeWidth={3} />
                      Ready
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-[#191A23] text-white hover:bg-[#191A23]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[3px_3px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              >
                {isPublishing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} strokeWidth={2.5} />
                )}
                {isPublishing ? "Publishing…" : "Publish All Pages"}
              </button>
            </div>
          </div>

          {/* Batch Styling Panel */}
          <BatchStylingPanel
            stylingOpen={stylingOpen}
            setStylingOpen={setStylingOpen}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            fontSearch={fontSearch}
            setFontSearch={setFontSearch}
            layout={layout}
            setLayout={setLayout}
            language={language}
            setLanguage={setLanguage}
            aiTone={aiTone}
            setAiTone={setAiTone}
            expiresAt={expiresAt}
            setExpiresAt={setExpiresAt}
            isPasswordProtected={isPasswordProtected}
            setIsPasswordProtected={setIsPasswordProtected}
            password={password}
            setPassword={setPassword}
            occasion={bulkInfo?.occasion}
          />

          {/* Recipients list */}
          <div className="bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] overflow-hidden">
            <div className="h-1.5 bg-[#B4F8C8]" />
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#191A23]/10">
              <div>
                <p className="text-sm font-black uppercase text-[#191A23]">
                  Recipients
                </p>
                <p className="text-[9px] font-medium text-neutral-400 mt-0.5">
                  Review AI messages · attach gifts · then publish
                </p>
              </div>
              <span className="inline-flex items-center justify-center size-7 border-2 border-[#191A23] rounded-sm bg-[#F3F3F3] text-[10px] font-black">
                {recipients.length}
              </span>
            </div>

            <div className="divide-y divide-[#191A23]/10">
              {recipients.map((recipient) => (
                <RecipientCard
                  key={recipient.row_id}
                  recipient={recipient}
                  onAttachGift={openGiftModal}
                  onAttachAssets={openAssetModal}
                  onUpdateMessage={handleUpdateMessage}
                  onRegenerateMessage={handleRegenerateMessage}
                />
              ))}

              {recipients.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <FileSpreadsheet size={32} className="text-neutral-200" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    No recipients loaded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 3 — PUBLISHED
      ══════════════════════════════════════════════════════════════════════ */}
      {step === "published" && (
        <PublishedStep
          selectedTheme={selectedTheme}
          selectedFont={selectedFont}
          layout={layout}
          language={language}
          aiTone={aiTone}
          onExport={handleExport}
          onReset={resetAll}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GIFT MODAL
          key=selectedRowId ensures fresh state (and fresh gift fetch) for
          each recipient without synchronous setState inside an effect.
      ══════════════════════════════════════════════════════════════════════ */}
      <BulkGiftModal
        key={selectedRowId ?? "gift-modal-closed"}
        isOpen={isGiftModalOpen}
        recipientName={
          selectedRecipient
            ? `${selectedRecipient.first_name} ${selectedRecipient.last_name}`
            : ""
        }
        onClose={() => setIsGiftModalOpen(false)}
        onAttach={handleAttachGift}
        isAttaching={isAttaching}
      />

      <BulkAssetModal
        key={
          selectedRowId ? `asset-modal-${selectedRowId}` : "asset-modal-closed"
        }
        isOpen={isAssetModalOpen}
        recipientName={
          selectedRecipient
            ? `${selectedRecipient.first_name} ${selectedRecipient.last_name}`
            : ""
        }
        onClose={() => setIsAssetModalOpen(false)}
        onAttach={handleAttachAssets}
        isAttaching={isAttachingAssets}
        initialData={
          selectedRecipient
            ? {
                images: selectedRecipient.images || [],
                voiceMessageUrl: selectedRecipient.voiceMessageUrl || null,
                voiceMessagePublicId:
                  selectedRecipient.voiceMessagePublicId || null,
              }
            : null
        }
      />
    </div>
  );
}
