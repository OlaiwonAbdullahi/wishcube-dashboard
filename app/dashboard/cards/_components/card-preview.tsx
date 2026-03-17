"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Leaf } from "lucide-react";
import { toPng } from "html-to-image";
import { CardState } from "../page";
import { HugeiconsIcon } from "@hugeicons/react";
import * as AllIcons from "@hugeicons/core-free-icons";

/**
 * Dynamic HugeIcon component to render based on icon name
 */
function SelectedHugeIcon({
  name,
  size = 24,
  className = "",
  style = {},
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const iconMap: Record<string, string> = {
    gift: "Gift01Icon",
    heart: "FavouriteIcon",
    cake: "BirthdayCakeIcon",
    sparkles: "SparklesIcon",
    star: "AiStarIcon",
    party: "PartyPopperIcon",
    trophy: "TrophyIcon",
    graduation: "EducationIcon",
    balloon: "BalloonsIcon",
    flower: "FlowerIcon",
    music: "MusicNote01Icon",
    camera: "Camera01Icon",
    plane: "AirplaneIcon",
    home: "Home01Icon",
    coffee: "CoffeeIcon",
    moon: "MoonIcon",
    sun: "Sun03Icon",
    rocket: "RocketIcon",
    crown: "CrownIcon",
    game: "GameController03Icon",
    leaf: "LeafIcon",
  };

  const ComponentName = iconMap[name] || "Gift01Icon";
  // @ts-expect-error - Dynamic component access
  const IconData = AllIcons[ComponentName];

  if (!IconData) return null;
  return (
    <HugeiconsIcon
      icon={IconData}
      size={size}
      className={className}
      style={style}
    />
  );
}

interface CardPreviewProps {
  cardState: CardState;
}

export function CardPreview({ cardState }: CardPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `greeting-card-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to download card:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const blob = await fetch(dataUrl).then((res) => res.blob());
      const file = new File([blob], "greeting-card.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "My Greeting Card",
          text: cardState.title,
        });
      } else {
        // Fallback: Copy to clipboard
        alert("Share your card by downloading it!");
      }
    } catch (error) {
      console.error("Failed to share card:", error);
    }
  };

  // Get background pattern
  const getBackgroundStyle = () => {
    if (cardState.backgroundImageUrl) {
      return {
        backgroundImage: `url(${cardState.backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    // Premium elegant dark-fade background using the editable backgroundColor
    return {
      background: `linear-gradient(180deg, ${
        cardState.backgroundColor || "#FFFFFF"
      } 0%, rgba(0,0,0,0.95) 100%)`,
    };
  };

  const getFontSizeValue = () => {
    if (cardState.textSize === "small") return 12;
    if (cardState.textSize === "large") return 28;
    return 20;
  };

  const DecorativeIcons = () => (
    <div className="flex items-center justify-center gap-6 opacity-60">
      <SelectedHugeIcon
        name="sparkles"
        size={20}
        style={{ color: cardState.textColor || "white" }}
      />
      <SelectedHugeIcon
        name="heart"
        size={20}
        style={{ color: cardState.textColor || "white" }}
      />
      <SelectedHugeIcon
        name="balloon"
        size={20}
        style={{ color: cardState.textColor || "white" }}
      />
      <SelectedHugeIcon
        name="party"
        size={20}
        style={{ color: cardState.textColor || "white" }}
      />
    </div>
  );

  return (
    <div className="space-y-4 font-space">
      <Card className="shadow-none border border-[#191A23] border-b-4 bg-[#F3F3F3] rounded-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-[#191A23]">
          <CardTitle className="text-sm font-bold text-[#191A23] uppercase tracking-wider">
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview Container */}
          <div
            ref={cardRef}
            className="mx-auto w-full max-w-2xl overflow-hidden rounded-sm border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)]"
            style={{
              aspectRatio: "1",
              ...getBackgroundStyle(),
            }}
          >
            {/* Card Content - Exclusively Premium Style */}
            <div className="relative h-full w-full flex flex-col p-8 text-white overflow-hidden">
              {/* Premium Badge */}
              <div className="absolute top-0 right-0 z-20">
                <div className="bg-[#EAB308] text-black text-[10px] font-black px-4 py-1.5 rounded-bl-sm uppercase tracking-tighter shadow-sm">
                  Premium
                </div>
              </div>

              {/* Mesh/Ambient Glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${
                    cardState.textColor || "#FFFFFF"
                  } 0%, transparent 40%), 
                              radial-gradient(circle at 80% 80%, ${
                                cardState.textColor || "#FFFFFF"
                              } 0%, transparent 40%)`,
                }}
              />

              {/* Content Container */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Top Icons */}
                <div className="pt-2">
                  <DecorativeIcons />
                </div>

                {/* Header */}
                <div className="flex flex-col items-center mt-6 mb-4">
                  <span className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-60 mb-1">
                    {(cardState.occasion || "Birthday").toUpperCase()}
                  </span>
                  <h2
                    className="text-2xl font-black tracking-tight text-center leading-tight"
                    style={{
                      fontFamily: cardState.font,
                      color: cardState.textColor || "white",
                    }}
                  >
                    Happy {cardState.occasion}
                  </h2>
                </div>

                {/* Leaf Divider */}
                <div className="flex items-center gap-4 w-full px-8 mb-6">
                  <div className="h-[1px] flex-1 bg-white/20" />
                  <Leaf className="size-3 opacity-40 text-white" />
                  <div className="h-[1px] flex-1 bg-white/20" />
                </div>

                {/* Main Message Box (Glassmorphism) */}
                <div className="flex-1 flex items-center justify-center -mt-2">
                  <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-sm p-6 relative overflow-hidden">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

                    <div className="space-y-4 text-center">
                      {cardState.recipientName && (
                        <p className="text-base italic font-medium">
                          Dear{" "}
                          <span className="font-black not-italic">
                            {cardState.recipientName},
                          </span>
                        </p>
                      )}

                      <p
                        className="text-xs leading-relaxed opacity-90 italic font-medium max-w-[90%] mx-auto"
                        style={{
                          fontSize: `${getFontSizeValue()}px`,
                          fontFamily: cardState.font,
                        }}
                      >
                        &quot;
                        {cardState.message ||
                          "Your message will appear here..."}
                        &quot;
                      </p>

                      <div className="pt-2 flex flex-col items-end">
                        <p className="text-[10px] italic opacity-60">
                          With love,
                        </p>
                        <p className="font-bold text-xs tracking-tight">
                          {cardState.senderName || "Your Friend"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Icons */}
                <div className="mt-auto pt-6">
                  <DecorativeIcons />
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between opacity-40 text-[7px] font-bold uppercase tracking-widest pt-2 border-t border-white/10">
                  <span>Wishcube Premium</span>
                  <div className="text-right">
                    <p>© Wishcube</p>
                    <p>Built by {cardState.senderName || "Wishcube"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="gap-2 rounded-sm border-[#191A23] border-b-4 hover:translate-y-[2px] hover:border-b-2 transition-all font-bold uppercase text-xs"
              onClick={handleDownload}
              disabled={isDownloading || !cardState._id}
            >
              <Download className="size-4" />
              Download
            </Button>
            <Button
              className="gap-2 rounded-sm bg-[#191A23] text-white border-[#191A23] border-b-4 hover:translate-y-[2px] hover:border-b-2 transition-all font-bold uppercase text-xs"
              onClick={handleShare}
              disabled={!cardState._id}
            >
              <Share2 className="size-4" />
              Share
            </Button>
          </div>

          {/* Info */}
          <div className="rounded-sm border border-[#191A23] bg-white p-3 text-[10px] font-bold text-[#191A23] uppercase flex items-center gap-2">
            <span className="bg-[#E6D1FF] size-5 rounded-full flex items-center justify-center border border-[#191A23]">
              💡
            </span>
            Your card will be saved as a high-quality PNG image.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
