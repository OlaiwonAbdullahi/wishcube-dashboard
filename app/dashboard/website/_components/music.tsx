import { HugeiconsIcon } from "@hugeicons/react";
import {
  MusicNote01Icon,
  PlayIcon,
  CloudUploadIcon,
  Tick01Icon,
  SpotifyIcon,
  MagicWand01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { callAI } from "@/lib/ai";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  preview: string;
  type: "ai" | "spotify";
}

interface MusicProps {
  onSelectMusic: (track: Track) => void;
  selectedMusic?: Track | null;
}

export default function Music({ onSelectMusic, selectedMusic }: MusicProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "spotify">("ai");
  const [isGenerating, setIsGenerating] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");
  const [isVerifyingSpotify, setIsVerifyingSpotify] = useState(false);

  const generateAIMusic = async () => {
    setIsGenerating(true);
    try {
      const prompt = `
        Create a fictional but realistic background music track description for a professional greeting card website.
        Return ONLY a JSON object:
        {
          "title": "A soulful and uplifting title",
          "artist": "WishCube AI",
          "album": "AI Collections",
          "cover": "A professional unsplash music related image URL",
          "preview": "A URL to a short, royalty-free MP3 audio file (e.g., from a stock audio site)"
        }
      `;
      const response = await callAI(prompt, "google/gemini-2.0-flash");
      const jsonStr = response.replace(/```json|```/g, "").trim();
      const data = JSON.parse(jsonStr);
      console.log("Generated AI Music:", data);

      const newTrack: Track = {
        id: `ai-${Date.now()}`,
        title: data.title,
        artist: data.artist,
        album: data.album,
        cover:
          data.cover ||
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
        preview: data.preview || "#", // Use the preview URL from AI
        type: "ai",
      };
      onSelectMusic(newTrack);
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpotifyLink = async () => {
    if (!spotifyLink.includes("spotify.com/track/")) {
      alert("Please enter a valid Spotify track link");
      return;
    }

    setIsVerifyingSpotify(true);
    try {
      const trackId = spotifyLink.split("track/")[1]?.split("?")[0];
      // In a real app, we'd fetch track info from Spotify API here.
      // For now, we simulate the metadata.
      const newTrack: Track = {
        id: trackId,
        title: "Spotify Track",
        artist: "Linked Artist",
        album: "Spotify Album",
        cover:
          "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
        preview: spotifyLink,
        type: "spotify",
      };
      onSelectMusic(newTrack);
    } catch (error) {
      console.error("Spotify link failed:", error);
    } finally {
      setIsVerifyingSpotify(false);
    }
  };

  return (
    <div className="space-y-4 font-space animate-in fade-in slide-in-from-bottom-2 duration-300 border-2 border-[#191A23] rounded-sm p-5 bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-[#F3F3F3] border-2 border-[#191A23] rounded-sm">
          <HugeiconsIcon
            icon={MusicNote01Icon}
            size={18}
            className="text-[#191A23]"
          />
        </div>
        <h3 className="text-xs font-black uppercase text-[#191A23] tracking-wider">
          Background Music
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#F3F3F3] border-2 border-[#191A23] rounded-sm">
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase transition-all rounded-sm",
            activeTab === "ai"
              ? "bg-[#191A23] text-white"
              : "text-[#191A23] hover:bg-[#191A23]/5"
          )}
        >
          <HugeiconsIcon icon={MagicWand01Icon} size={14} />
          AI Magic
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("spotify")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase transition-all rounded-sm",
            activeTab === "spotify"
              ? "bg-[#1DB954] text-white border-2 border-[#191A23] shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]"
              : "text-[#191A23] hover:bg-[#191A23]/5"
          )}
        >
          <HugeiconsIcon icon={SpotifyIcon} size={14} />
          Spotify
        </button>
      </div>

      {/* Content */}
      <div className="py-2">
        {activeTab === "ai" ? (
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-[#191A23]/30 rounded-sm bg-[#F3F3F3]/50 text-center space-y-3">
              <p className="text-[10px] font-bold text-neutral-500 uppercase">
                Generate a unique background track tailored to your website's
                mood
              </p>
              <button
                type="button"
                onClick={generateAIMusic}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#B4F8C8] border-2 border-[#191A23] rounded-sm font-black uppercase text-xs text-[#191A23] hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all disabled:opacity-50"
              >
                <HugeiconsIcon
                  icon={MagicWand01Icon}
                  size={16}
                  className={isGenerating ? "animate-spin" : ""}
                />
                {isGenerating ? "Composing..." : "Generate with AI"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-[#191A23]">
                Paste Spotify Track Link
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={spotifyLink}
                    onChange={(e) => setSpotifyLink(e.target.value)}
                    placeholder="https://open.spotify.com/track/..."
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-[#191A23] rounded-sm text-xs font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all"
                  />
                  <HugeiconsIcon
                    icon={Link01Icon}
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#191A23]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSpotifyLink}
                  disabled={isVerifyingSpotify || !spotifyLink}
                  className="px-4 py-2 bg-white border-2 border-[#191A23] rounded-sm font-black uppercase text-[10px] hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Track Preview */}
      {selectedMusic && (
        <div className="mt-4 animate-in zoom-in-95 duration-200">
          <div className="p-3 flex flex-col bg-[#F3F3F3] border-2 border-[#191A23] rounded-sm  items-start gap-2 justify-start group">
            <div className="flex items-center gap-3">
              <div className="size-12 relative rounded-sm overflow-hidden border-2 border-[#191A23]">
                <img
                  src={selectedMusic.cover}
                  alt={selectedMusic.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-[#191A23]/40 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={18}
                    className="text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-black uppercase text-[#191A23] truncate">
                    {selectedMusic.title}
                  </p>
                  {selectedMusic.type === "spotify" && (
                    <HugeiconsIcon
                      icon={SpotifyIcon}
                      size={10}
                      className="text-[#1DB954]"
                    />
                  )}
                </div>
                <p className="text-[8px] font-bold text-neutral-500 uppercase truncate">
                  {selectedMusic.artist}
                </p>
              </div>
            </div>

            {selectedMusic.type === "spotify" && selectedMusic.id && (
              <div className="hidden md:block">
                {/* Minimal Spotify Player Preview */}
                <iframe
                  src={`https://open.spotify.com/embed/track/${selectedMusic.id}?utm_source=generator&theme=0`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-sm"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
