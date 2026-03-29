"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mic01Icon,
  StopIcon,
  CloudUploadIcon,
  Tick02Icon,
  Cancel01Icon,
  AudioWaveIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { getAuth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoiceMessageProps {
  voiceMessageUrl: string | null;
  voiceMessagePublicId: string | null;
  onUpload: (url: string, publicId: string) => void;
  onRemove: () => void;
}

type RecordState = "idle" | "recording" | "recorded" | "uploading" | "done";

const MAX_SECONDS = 120; // 2 min

/** Upload an audio Blob to Cloudinary via the /api/products/media-upload endpoint */
async function uploadAudioBlob(
  blob: Blob,
  filename: string,
): Promise<{ url: string; publicId: string }> {
  const auth = getAuth();
  const formData = new FormData();
  formData.append("files", blob, filename);

  const response = await fetch(
    "https://api.usewishcube.com/api/products/media-upload",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${auth?.token || ""}` },
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(`Upload failed: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (!json.success || !json.data?.images?.[0]) {
    throw new Error(json.message || "Upload returned no data");
  }

  const { url, publicId } = json.data.images[0];
  return { url, publicId };
}

/** Formats seconds as MM:SS */
function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function VoiceMessage({
  voiceMessageUrl,
  voiceMessagePublicId,
  onUpload,
  onRemove,
}: VoiceMessageProps) {
  const [state, setState] = useState<RecordState>(
    voiceMessageUrl ? "done" : "idle",
  );
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(
    voiceMessageUrl ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync state if parent clears the URL (deferred to avoid synchronous setState in effect)
  useEffect(() => {
    if (!voiceMessageUrl && state === "done") {
      const id = setTimeout(() => {
        setState("idle");
        setAudioBlob(null);
        setAudioUrl(null);
        setElapsed(0);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [voiceMessageUrl, state]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
          ? "audio/ogg;codecs=opus"
          : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setState("recorded");
        stopTimer();
        // Stop all tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      recorder.start(250);
      setState("recording");
      startTimer();
    } catch (err) {
      console.error("Mic access error:", err);
      setError("Microphone access denied. Please allow mic permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const startTimer = () => {
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= MAX_SECONDS) {
          stopRecording();
          return s + 1;
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const discard = () => {
    if (audioUrl && !voiceMessageUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setElapsed(0);
    setState("idle");
    onRemove();
  };

  const uploadRecording = async () => {
    if (!audioBlob) return;
    setState("uploading");
    setError(null);
    try {
      const ext = audioBlob.type.includes("ogg") ? "ogg" : "webm";
      const filename = `voice-message-${Date.now()}.${ext}`;
      const { url, publicId } = await uploadAudioBlob(audioBlob, filename);
      setAudioUrl(url);
      setState("done");
      onUpload(url, publicId);
      toast.success("Voice message uploaded! 🎙️");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
      setState("recorded");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file (MP3, WAV, M4A, OGG…)");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Audio file must be under 15MB");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setAudioUrl(localUrl);
    setAudioBlob(file);
    setState("uploading");
    setError(null);

    try {
      const { url, publicId } = await uploadAudioBlob(file, file.name);
      setAudioUrl(url);
      setState("done");
      onUpload(url, publicId);
      toast.success("Voice message uploaded! 🎙️");
    } catch (err) {
      console.error("File upload error:", err);
      setError("Upload failed. Please try again.");
      setState("idle");
      setAudioBlob(null);
      setAudioUrl(null);
      URL.revokeObjectURL(localUrl);
    }
    // Reset file input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="space-y-3 font-space animate-in fade-in slide-in-from-bottom-2 duration-300 border-2 border-[#191A23] rounded-sm p-4 bg-[#F3F3F3] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Mic01Icon} size={14} className="text-[#191A23]" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#191A23]">
            Voice Message
          </h3>
        </div>

        {/* File upload trigger */}
        {state === "idle" && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-1 bg-white border-2 border-[#191A23] rounded-sm text-[8px] font-black uppercase text-[#191A23] hover:bg-neutral-100 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all"
            >
              <HugeiconsIcon icon={CloudUploadIcon} size={10} />
              Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </>
        )}

        {/* Remove when done */}
        {state === "done" && (
          <button
            type="button"
            onClick={discard}
            className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-sm text-[8px] font-black uppercase text-red-500 hover:bg-red-100 transition-all"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={10} />
            Remove
          </button>
        )}
      </div>

      {/* ── State: idle ── */}
      {state === "idle" && (
        <div className="flex flex-col items-center justify-center py-7 border-2 border-dashed border-[#191A23]/20 bg-white rounded-sm gap-3">
          <button
            type="button"
            onClick={startRecording}
            className="size-16 rounded-full border-2 border-[#191A23] bg-[#FFE5E5] flex items-center justify-center text-[#191A23] hover:-translate-y-1 shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[0_2px_0_0_rgba(0,0,0,1)] transition-all"
          >
            <HugeiconsIcon icon={Mic01Icon} size={26} />
          </button>
          <p className="text-[10px] font-black uppercase tracking-wider text-[#191A23]">
            Tap to record
          </p>
          <p className="text-[9px] text-neutral-400 font-medium">
            Up to 2 minutes · or upload an audio file above
          </p>
          {error && (
            <p className="text-[9px] text-red-500 font-bold text-center px-4">
              {error}
            </p>
          )}
        </div>
      )}

      {/* ── State: recording ── */}
      {state === "recording" && (
        <div className="flex flex-col items-center justify-center py-7 border-2 border-red-200 bg-red-50 rounded-sm gap-3">
          {/* Pulsing mic */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
            <button
              type="button"
              onClick={stopRecording}
              className="relative size-16 rounded-full border-2 border-red-500 bg-red-500 flex items-center justify-center text-white shadow-[0_4px_0_0_rgba(185,28,28,1)] hover:shadow-[0_6px_0_0_rgba(185,28,28,1)] hover:-translate-y-1 active:shadow-[0_2px_0_0_rgba(185,28,28,1)] active:translate-y-0 transition-all"
            >
              <HugeiconsIcon icon={StopIcon} size={22} color="white" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black text-red-600">
              {fmt(elapsed)}
            </span>
            <span className="text-[9px] text-red-400 font-medium">/ {fmt(MAX_SECONDS)}</span>
          </div>
          <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider">
            Tap the button to stop
          </p>
        </div>
      )}

      {/* ── State: recorded (preview before upload) ── */}
      {state === "recorded" && audioUrl && (
        <div className="space-y-3">
          <div className="p-3 bg-white border-2 border-[#191A23] rounded-sm shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]">
            <div className="flex items-center gap-2 mb-2">
              <HugeiconsIcon icon={AudioWaveIcon} size={14} color="#191A23" />
              <p className="text-[9px] font-black uppercase text-[#191A23]">
                Preview · {fmt(elapsed)}
              </p>
            </div>
            <audio
              src={audioUrl}
              controls
              className="w-full h-8"
              style={{ accentColor: "#191A23" }}
            />
          </div>

          {error && (
            <p className="text-[9px] text-red-500 font-bold text-center">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={discard}
              className="flex-1 py-2.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-0.5 transition-all"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={uploadRecording}
              className="flex-1 py-2.5 border-2 border-[#191A23] rounded-sm text-[10px] font-black uppercase bg-[#191A23] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
            >
              <HugeiconsIcon icon={CloudUploadIcon} size={12} color="white" />
              Upload
            </button>
          </div>
        </div>
      )}

      {/* ── State: uploading ── */}
      {state === "uploading" && (
        <div className="flex flex-col items-center justify-center py-7 bg-white border-2 border-[#191A23]/10 rounded-sm gap-3">
          <div className="size-10 rounded-full border-4 border-[#191A23] border-t-transparent animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-wider text-[#191A23] animate-pulse">
            Uploading to cloud…
          </p>
        </div>
      )}

      {/* ── State: done ── */}
      {state === "done" && (
        <div
          className={cn(
            "space-y-2 p-3 rounded-sm border-2 bg-[#B4F8C8]",
            "border-[#191A23] shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]",
          )}
        >
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Tick02Icon} size={14} color="#191A23" />
            <p className="text-[9px] font-black uppercase tracking-wider text-[#191A23]">
              Voice message ready
              {voiceMessagePublicId && (
                <span className="ml-1 font-medium normal-case text-[#191A23]/50 text-[8px]">
                  ({voiceMessagePublicId.split("/").pop()})
                </span>
              )}
            </p>
          </div>
          <audio
            src={audioUrl ?? voiceMessageUrl ?? undefined}
            controls
            className="w-full h-8"
            style={{ accentColor: "#191A23" }}
          />
        </div>
      )}
    </div>
  );
}
