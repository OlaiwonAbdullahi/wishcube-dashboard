"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Share01Icon,
  CloudUploadIcon,
  Copy01Icon,
  Settings01Icon,
  SparklesIcon,
  FlowerIcon,
  ClipboardIcon,
  IceCreamIcon,
  MoreVerticalCircle01Icon,
  BookOpenIcon,
  Edit01Icon,
  RocketIcon,
  Share08Icon,
  Agreement01Icon,
  ArrowUpRight01Icon,
  Award01Icon,
  ArrowLeft01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import Gift from "./_components/gift";
import Music from "./_components/music";
import VoiceMessage from "./_components/voiceMessage";

// Define theme type
interface Theme {
  name: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  bgNeutral: string;
  textNeutral: string;
  bgAccent?: string;
  hoverAccent?: string;
}

// Define occasion type
interface Occasion {
  value: string;
  label: string;
}

// Define gift type
export interface GiftItem {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  bgColor: string;
}

// Theme configurations with professional color schemes
const THEMES: Theme[] = [
  {
    name: "corporate-blue",
    primary: "bg-blue-600",
    secondary: "bg-blue-800",
    textPrimary: "text-blue-600",
    textSecondary: "text-blue-800",
    bgNeutral: "bg-gray-50",
    textNeutral: "text-gray-50",
    bgAccent: "bg-blue-100",
    hoverAccent: "hover:bg-blue-100",
  },
  {
    name: "elegant-charcoal",
    primary: "bg-gray-700",
    secondary: "bg-gray-900",
    textPrimary: "text-gray-700",
    textSecondary: "text-gray-900",
    bgNeutral: "bg-gray-100",
    textNeutral: "text-gray-100",
    bgAccent: "bg-gray-200",
    hoverAccent: "hover:bg-gray-200",
  },
  {
    name: "emerald-success",
    primary: "bg-emerald-600",
    secondary: "bg-emerald-800",
    textPrimary: "text-emerald-600",
    textSecondary: "text-emerald-800",
    bgNeutral: "bg-white",
    textNeutral: "text-white",
    bgAccent: "bg-emerald-100",
    hoverAccent: "hover:bg-emerald-100",
  },
  {
    name: "royal-purple",
    primary: "bg-purple-600",
    secondary: "bg-purple-900",
    textPrimary: "text-purple-600",
    textSecondary: "text-purple-900",
    bgNeutral: "bg-gray-50",
    textNeutral: "text-gray-50",
    bgAccent: "bg-purple-100",
    hoverAccent: "hover:bg-purple-100",
  },
  {
    name: "classic-maroon",
    primary: "bg-red-800",
    secondary: "bg-red-900",
    textPrimary: "text-red-800",
    textSecondary: "text-red-900",
    bgNeutral: "bg-gray-100",
    textNeutral: "text-gray-100",
    bgAccent: "bg-red-100",
    hoverAccent: "hover:bg-red-100",
  },
  {
    name: "teal-professional",
    primary: "bg-teal-600",
    secondary: "bg-teal-800",
    textPrimary: "text-teal-600",
    textSecondary: "text-teal-800",
    bgNeutral: "bg-white",
    textNeutral: "text-white",
    bgAccent: "bg-teal-100",
    hoverAccent: "hover:bg-teal-100",
  },
  {
    name: "amber-accent",
    primary: "bg-amber-600",
    secondary: "bg-amber-800",
    textPrimary: "text-amber-600",
    textSecondary: "text-amber-800",
    bgNeutral: "bg-gray-50",
    textNeutral: "text-gray-50",
    bgAccent: "bg-amber-100",
    hoverAccent: "hover:bg-amber-100",
  },
  {
    name: "indigo-modern",
    primary: "bg-indigo-600",
    secondary: "bg-indigo-900",
    textPrimary: "text-indigo-600",
    textSecondary: "text-indigo-900",
    bgNeutral: "bg-white",
    textNeutral: "text-white",
    bgAccent: "bg-indigo-100",
    hoverAccent: "hover:bg-indigo-100",
  },
];

const OCCASIONS: Occasion[] = [
  { value: "", label: "Select an Occasion" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "congratulations", label: "Congratulations" },
  { value: "appreciation", label: "Appreciation" },
  { value: "wedding", label: "Wedding" },
  { value: "getwell", label: "Get Well" },
  { value: "professional", label: "Professional Greeting" },
  { value: "holiday", label: "Holiday" },
  { value: "other", label: "Other" },
];

const Generator: React.FC = () => {
  // Form state
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [recipientName, setRecipientName] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [greetingId, setGreetingId] = useState<string>("");
  const [isOn, setIsOn] = useState(false);
  const [addMusic, setAddMusic] = useState(false);

  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Check if window is defined (client-side only)
  const isBrowser = typeof window !== "undefined";

  // Generate a unique ID for the greeting
  const generateGreetingId = (): string => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const generateMessage = async (): Promise<void> => {
    const prompt = `
You are a professional greeting card writer. 
Please write a heartfelt and personalized ${occasion} greeting for someone named "${recipientName}". 
If relevant, incorporate the following message or sentiment: "${customMessage}". 
The tone should be warm, sincere, and creative. 
Keep it concise but meaningful (around 3-5 sentences). 
Do not include a signature or sender name. Use emojis.
`;
    try {
      const response = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const newMessage =
        data.choices?.[0]?.message?.content || "No message generated.";
      setGeneratedMessage(newMessage);

      // Update the message state with the generated content
      setMessage(newMessage);
    } catch (error) {
      console.error("Failed to generate message:", error);
    }
  };

  // Handle image upload with preview capability
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageName(file.name);

      // Create an image preview
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const copyGreetingLink = async (): Promise<void> => {
    try {
      // Generate a new ID if one doesn't exist
      if (!greetingId) {
        setGreetingId(generateGreetingId());
      }

      // Create the greeting data object
      const greetingData = {
        id: greetingId,
        recipientName,
        occasion,
        message: message || customMessage,
        theme: selectedTheme.name,
        image: imagePreview,
        gift: selectedGift,
      };

      // Create the URL with the greeting data
      const baseUrl = window.location.origin;
      const greetingUrl = `${baseUrl}/greeting/${greetingId}`;

      // Store the greeting data in localStorage (temporary solution)
      localStorage.setItem(
        `greeting_${greetingId}`,
        JSON.stringify(greetingData)
      );

      // Copy the URL to clipboard
      await navigator.clipboard.writeText(greetingUrl);

      // Show success message
      alert(
        "Greeting link copied to clipboard! Share this link with your recipient."
      );
    } catch (err) {
      console.error("Failed to copy greeting link:", err);
      alert("Failed to copy the greeting link. Please try again.");
    }
  };

  // Paste message functionality
  const handlePasteMessage = async (): Promise<void> => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setCustomMessage(clipboardText);
        if (messageRef.current) {
          messageRef.current.focus();
        }
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      alert(
        "Unable to access clipboard. Please check your browser permissions."
      );
    }
  };

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle using the generated message as the custom message
  const useGeneratedMessage = (): void => {
    setCustomMessage(generatedMessage);
    setGeneratedMessage("");
  };

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  const handleMusicToggle = () => {
    setAddMusic(!addMusic);
  };

  // Gift data
  const gifts: GiftItem[] = [
    {
      id: "flower",
      name: "Flower",
      price: 500,
      icon: (
        <HugeiconsIcon
          icon={FlowerIcon}
          size={24}
          className="text-pink-600"
          color="currentColor"
        />
      ),
      bgColor: "bg-pink-100",
    },
    {
      id: "ice-cream",
      name: "Ice Cream",
      price: 500,
      icon: (
        <HugeiconsIcon
          icon={IceCreamIcon}
          size={24}
          className="text-teal-600"
          color="currentColor"
        />
      ),
      bgColor: "bg-teal-100",
    },
    {
      id: "cupcake",
      name: "Cupcake",
      price: 750,
      icon: (
        <HugeiconsIcon
          icon={Award01Icon}
          size={24}
          className="text-purple-600"
          color="currentColor"
        />
      ),
      bgColor: "bg-purple-100",
    },
    {
      id: "frozen-yogurt",
      name: "Frozen Yogurt",
      price: 650,
      icon: (
        <HugeiconsIcon
          icon={IceCreamIcon}
          size={24}
          className="text-blue-600"
          color="currentColor"
        />
      ),
      bgColor: "bg-blue-100",
    },
  ];

  // Simple form validation
  const isFormValid = recipientName.trim() !== "";

  // Render form section
  const renderForm = () => (
    <form className="space-y-5">
      {/* Recipient Name */}
      <div className="flex flex-col space-y-1.5">
        <label
          htmlFor="recipientName"
          className="text-[10px] font-bold uppercase text-[#191A23]"
        >
          Recipient&apos;s Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="recipientName"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Enter recipient's name"
          required
          className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium"
        />
      </div>

      {/* Occasion */}
      <div className="flex flex-col space-y-1.5">
        <label
          htmlFor="occasion"
          className="text-[10px] font-bold uppercase text-[#191A23]"
        >
          Occasion
        </label>
        <select
          id="occasion"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium appearance-none cursor-pointer"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="%23191A23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
          }}
        >
          {OCCASIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="font-space font-medium"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col space-y-1.5 mb-4">
        <label
          htmlFor="message"
          className="text-[10px] font-bold uppercase text-[#191A23]"
        >
          Custom Message (Optional)
        </label>
        <textarea
          id="message"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          ref={messageRef}
          cols={20}
          rows={5}
          placeholder="Write your message here..."
          className="rounded-sm px-4 py-3 border-2 border-[#191A23] text-[#191A23] text-sm focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all bg-white font-medium resize-none shadow-sm"
        ></textarea>
        <div className="mt-2.5 flex items-center justify-between border border-[#191A23] bg-[#F3F3F3] p-2 rounded-sm shadow-[2px_2px_0px_0px_rgba(25,26,35,1)]">
          <button
            type="button"
            onClick={generateMessage}
            className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase text-[#191A23] hover:translate-y-px transition-all"
          >
            <HugeiconsIcon icon={SparklesIcon} size={12} color="currentColor" />
            Generate AI Message
          </button>
          <div className="w-px h-4 bg-[#191A23]/20"></div>
          <button
            type="button"
            onClick={handlePasteMessage}
            className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase text-[#191A23] hover:translate-y-px transition-all"
          >
            <HugeiconsIcon
              icon={ClipboardIcon}
              size={12}
              color="currentColor"
            />
            Paste Message
          </button>
        </div>
        {generatedMessage && (
          <div className="text-[#191A23] mt-4 bg-[#B4F8C8] p-4 rounded-sm border-2 border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            <p className="text-sm font-medium">{generatedMessage}</p>
            <button
              type="button"
              onClick={useGeneratedMessage}
              className="mt-3 w-full py-2 bg-white border border-[#191A23] text-[10px] font-bold uppercase hover:-translate-y-px shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] transition-all"
            >
              Use this message
            </button>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="flex flex-col space-y-1.5">
        <label
          htmlFor="image"
          className="text-[10px] font-bold uppercase text-[#191A23]"
        >
          Upload Image
        </label>
        <div className="flex flex-col">
          <label
            htmlFor="image"
            className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#191A23] rounded-sm py-8 hover:bg-[#F3F3F3] transition-all group bg-white"
          >
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <div className="h-24 w-48 relative mb-3 rounded-sm overflow-hidden border-2 border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#191A23] uppercase">
                  {imageName}
                </span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase mt-1 group-hover:text-[#191A23] transition-colors">
                  Click to change
                </span>
              </div>
            ) : (
              <>
                <div className="size-12 rounded-full border-2 border-[#191A23] bg-[#E5F5FF] flex items-center justify-center mb-3 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] group-hover:-translate-y-1 transition-all">
                  <HugeiconsIcon
                    icon={CloudUploadIcon}
                    size={20}
                    color="#191A23"
                  />
                </div>
                <span className="text-sm font-bold text-[#191A23] uppercase">
                  Upload an image
                </span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase mt-1">
                  PNG, JPG, GIF up to 5MB
                </span>
              </>
            )}
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Theme Picker */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Select Theme
        </label>
        <div className="grid grid-cols-4 gap-3">
          {THEMES.map((theme) => (
            <div
              key={theme.name}
              onClick={() => setSelectedTheme(theme)}
              className={`rounded-lg cursor-pointer transition-all duration-200 ${
                selectedTheme.name === theme.name
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "hover:ring-1 hover:ring-gray-300"
              }`}
            >
              <div className="flex flex-col h-16 w-full rounded-lg overflow-hidden">
                <div className={`flex flex-row flex-1`}>
                  <div className={`flex-1 ${theme.primary}`} />
                  <div className={`flex-1 ${theme.bgNeutral}`} />
                </div>
                <div className={`flex-1 ${theme.secondary}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Features */}
      <div className=" space-y-4">
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Additional Features
          </h3>
          <div className=" flex items-center justify-between  mx-auto border border-gray-300 rounded-xl p-3">
            <div className="">
              <h2 className=" text-xl font-medium">Add Gift</h2>
            </div>
            <div
              className={`h-5 w-10 rounded-xl border border-gray-400 flex items-center cursor-pointer transition-colors duration-200 ${
                isOn ? "bg-gray-200" : "bg-gray-200"
              }`}
              onClick={handleToggle}
            >
              <div
                className={`bg-gray-800 h-4 w-4 rounded-full shadow-sm transition-transform duration-200 ${
                  isOn
                    ? "transform translate-x-5 "
                    : "transform translate-x-0.5 bg-gray-700"
                }`}
              />
            </div>
          </div>
          <div className=" flex items-center justify-between  mx-auto border border-gray-300 rounded-xl p-3 mt-4">
            <div className="">
              <h2 className=" text-xl font-medium">Add Music</h2>
            </div>
            <div
              className={`h-5 w-10 rounded-xl border border-gray-400 flex items-center cursor-pointer transition-colors duration-200 ${
                addMusic ? "bg-gray-200" : "bg-gray-200"
              }`}
              onClick={handleMusicToggle}
            >
              <div
                className={`bg-gray-800 h-4 w-4 rounded-full shadow-sm transition-transform duration-200 ${
                  addMusic
                    ? "transform translate-x-5 "
                    : "transform translate-x-0.5 bg-gray-700"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {isOn && (
            <div className="">
              <Gift gifts={gifts} onSelectGift={setSelectedGift} />
            </div>
          )}
          {addMusic && (
            <div className="">
              <Music />
            </div>
          )}
          <VoiceMessage />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-8 border-t-2 border-[#191A23]/10">
        <button
          type="button"
          onClick={() => setIsPreviewMode(true)}
          disabled={!isFormValid}
          className={`w-full py-4 px-4 rounded-sm text-[#191A23] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? "bg-[#B4F8C8] border-[#191A23] shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 cursor-pointer"
              : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          <HugeiconsIcon icon={ViewIcon} size={20} />
          Preview Website
        </button>
        {!isFormValid && (
          <p className="text-[10px] font-bold uppercase text-red-500 mt-2 text-center tracking-wider">
            Please enter recipient&apos;s name to continue
          </p>
        )}
      </div>
    </form>
  );

  // Render preview section
  const renderPreview = () => (
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
              <div className="space-y-3.5">
                {recipientName && (
                  <h1
                    className={`text-3xl font-bold ${selectedTheme.textPrimary}`}
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
                      {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                    </div>
                  </div>
                )}
              </div>

              {/* Image (if uploaded) */}
              {imagePreview && (
                <div className="py-4">
                  <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden shadow-md bg-white">
                    <Image
                      src={imagePreview}
                      alt="Greeting"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
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
                <p className="text-gray-700 leading-relaxed">
                  {message || customMessage}
                </p>
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
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#FFF3B0] text-[#191A23] py-3.5 px-4 rounded-sm hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] transition-all font-black uppercase tracking-wide border-2 border-[#191A23]">
              <HugeiconsIcon
                icon={Share01Icon}
                size={18}
                color="currentColor"
              />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#F3F3F3] font-space min-h-screen p-6 pt-10">
      <div className="max-w-4xl mx-auto">
        {!isPreviewMode ? (
          /* Form View */
          <div className="bg-white border-2 border-[#191A23] shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] rounded-sm w-full p-8 space-y-6 relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#191A23]/10">
              <h2 className="text-2xl font-black text-[#191A23] uppercase tracking-tight">
                Create Website
              </h2>
            </div>
            {renderForm()}
          </div>
        ) : (
          /* Preview View */
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#191A23] bg-white rounded-sm text-sm font-black text-[#191A23] hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] transition-all uppercase"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                Back to Edit
              </button>
              <h2 className="text-2xl font-black text-[#191A23] uppercase tracking-tight">
                Review Website
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">{renderPreview()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
