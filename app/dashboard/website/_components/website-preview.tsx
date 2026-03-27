/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  ArrowUpRight01Icon,
  Agreement01Icon,
  MoreVerticalCircle01Icon,
  Edit01Icon,
  BookOpenIcon,
  Share08Icon,
  SparklesIcon,
  MusicNote01Icon,
  RocketIcon,
  Copy01Icon,
} from "@hugeicons/core-free-icons";
import { Theme } from "./website-form";
import { cn } from "@/lib/utils";

interface WebsitePreviewProps {
  selectedTheme: Theme;
  selectedFont: string;
  occasion: string;
  recipientName: string;
  images: { url: string; publicId: string }[];
  message: string;
  customMessage: string;
  selectedMusic: any | null;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  copyGreetingLink: () => void;
  handlePublish: () => void;
  isPublishing: boolean;
}

export default function WebsitePreview({
  selectedTheme,
  selectedFont,
  occasion,
  recipientName,
  images,
  message,
  customMessage,
  selectedMusic,
  toggleMenu,
  isMenuOpen,
  copyGreetingLink,
  handlePublish,
  isPublishing,
}: WebsitePreviewProps) {
  return (
    <div className="sticky top-6">
      <div className="bg-white border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] rounded-sm overflow-hidden flex flex-col h-full relative">
        {/* Preview Header */}
        <div className="bg-[#191A23] p-4 flex items-center justify-between border-b-2 border-[#191A23] z-10">
          <h3 className="font-bold text-white uppercase text-sm tracking-widest">
            Live Preview
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded-sm bg-white border border-transparent hover:border-[#191A23] text-[#191A23] transition-all">
              <HugeiconsIcon icon={Settings01Icon} size={18} color="#191A23" />
            </button>
            <button className="p-1.5 rounded-sm bg-white border border-transparent hover:border-[#191A23] text-[#191A23] transition-all">
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={18}
                color="#191A23"
              />
            </button>
          </div>
        </div>

        {/* Greeting Preview */}
        <div
          className={`${selectedTheme.bgNeutral} p-8 min-h-[500px] max-h-[600px] overflow-y-auto`}
          style={{ fontFamily: selectedFont }}
        >
          <div className="relative">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${selectedTheme.bgAccent} flex items-center`}
                >
                  <HugeiconsIcon
                    icon={Agreement01Icon}
                    size={25}
                    color="currentColor"
                    className={selectedTheme.textPrimary}
                  />
                </div>
              </div>
              <div className="">
                <h2
                  className={`text-xl font-semibold capitalize ${selectedTheme.textSecondary}`}
                >
                  {occasion ? `${occasion} Greeting` : "Greeting"}
                </h2>
              </div>

              <button
                onClick={toggleMenu}
                className={`p-2 rounded-full transition-colors ${selectedTheme.hoverAccent}`}
                aria-label="Menu"
              >
                <HugeiconsIcon
                  icon={MoreVerticalCircle01Icon}
                  size={18}
                  color="currentColor"
                  className={selectedTheme.textPrimary}
                />
              </button>
            </div>

            {isMenuOpen && (
              <div className="absolute right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
                <ul>
                  <li className="px-2">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-50">
                      <HugeiconsIcon
                        icon={Edit01Icon}
                        size={16}
                        color="currentColor"
                        className={selectedTheme.textPrimary}
                      />
                      <span>Create Your Own</span>
                    </button>
                  </li>
                  <li className="px-2">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-50">
                      <HugeiconsIcon
                        icon={BookOpenIcon}
                        size={16}
                        color="currentColor"
                        className={selectedTheme.textPrimary}
                      />
                      <span>View Templates</span>
                    </button>
                  </li>
                  <li className="px-2">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-50">
                      <HugeiconsIcon
                        icon={Share08Icon}
                        size={16}
                        color="currentColor"
                        className={selectedTheme.textPrimary}
                      />
                      <span>Share</span>
                    </button>
                  </li>
                  <li className="border-t border-gray-100 mt-1 pt-1 px-2">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-50">
                      <HugeiconsIcon
                        icon={Settings01Icon}
                        size={16}
                        color="currentColor"
                        className={selectedTheme.textPrimary}
                      />
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6 text-center">
            <div className="flex md:flex-row flex-col space-y-6 items-center justify-between">
              <div className="space-y-3.5 text-left">
                {recipientName && (
                  <h1
                    className={`text-3xl font-bold ${selectedTheme.textPrimary}`}
                    style={{ fontFamily: selectedFont }}
                  >
                    Hey, {recipientName}
                  </h1>
                )}

                {occasion && (
                  <div
                    className={`inline-block px-4 py-1 rounded-full text-sm ${selectedTheme.primary} text-white`}
                  >
                    <div className="flex gap-2 items-center">
                      <HugeiconsIcon
                        icon={SparklesIcon}
                        size={16}
                        color="currentColor"
                      />
                      <span style={{ fontFamily: selectedFont }}>
                        {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Images (if uploaded) */}
              {images.length > 0 && (
                <div className="py-4 w-full">
                  <div className="flex flex-wrap justify-center gap-4">
                    {images.map((img, index) => (
                      <div
                        key={img.publicId}
                        className={cn(
                          "relative rounded-full overflow-hidden shadow-md bg-white border-2 border-[#191A23]",
                          images.length === 1
                            ? "w-64 h-64"
                            : "w-32 h-32 sm:w-40 sm:h-40",
                        )}
                      >
                        <img src={img.url} alt={`Greeting ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            {(message || customMessage) && (
              <div
                className={`mx-auto max-w-md p-6 rounded-xl shadow-sm ${
                  selectedTheme.bgNeutral === "bg-white"
                    ? "bg-gray-50"
                    : "bg-white"
                }`}
              >
                <p
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: selectedFont }}
                >
                  {message || customMessage}
                </p>
              </div>
            )}

            {/* Selected Music Preview */}
            {selectedMusic && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex items-center gap-3 bg-white border-2 border-[#191A23] rounded-sm p-3 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] w-full max-w-sm">
                  <img
                    src={selectedMusic.cover}
                    alt={selectedMusic.title}
                    className="size-10 rounded-sm border border-[#191A23]/10 object-cover"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-[#191A23] truncate">
                      {selectedMusic.title}
                    </p>
                    <p className="text-[8px] font-bold text-neutral-500 uppercase truncate">
                      {selectedMusic.artist}
                    </p>
                  </div>
                  <div className="w-px h-6 bg-[#191A23]/10"></div>
                  <HugeiconsIcon
                    icon={MusicNote01Icon}
                    size={16}
                    className="text-[#191A23] animate-bounce"
                  />
                </div>

                {selectedMusic.type === "spotify" && (
                  <div className="w-full max-w-sm rounded-sm overflow-hidden border-2 border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${selectedMusic.id}?utm_source=generator&theme=0`}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            <div>
              <button
                className={`text-lg ${selectedTheme.secondary} ${selectedTheme.textNeutral} p-1 rounded-full px-2.5`}
              >
                Redeem Gift
              </button>
            </div>

            <div className="flex justify-center items-center gap-1 pt-6 text-sm text-gray-500">
              <HugeiconsIcon icon={RocketIcon} size={14} color="currentColor" />
              <span>Made With 💜 with WishCube</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t-2 border-[#191A23] bg-white mt-auto z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={copyGreetingLink}
              className="flex-1 flex items-center justify-center gap-2 bg-[#191A23] text-white py-3.5 px-4 rounded-sm hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(25,26,35,0.4)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,0.4)] transition-all font-bold uppercase tracking-wide border-2 border-[#191A23]"
            >
              <HugeiconsIcon icon={Copy01Icon} size={18} color="currentColor" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FFF3B0] text-[#191A23] py-3.5 px-4 rounded-sm hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] transition-all font-black uppercase tracking-wide border-2 border-[#191A23]"
            >
              <HugeiconsIcon icon={RocketIcon} size={18} color="currentColor" />
              <span>{isPublishing ? "Publishing..." : "Publish Website"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
