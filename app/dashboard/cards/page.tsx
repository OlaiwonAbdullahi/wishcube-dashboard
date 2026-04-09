/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { CardPreview } from "./_components/card-preview";
import { CardCustomizer } from "./_components/card-customizer";
import { useLoadSelectedFont } from "./_components/use-google-fonts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAuth } from "@/lib/auth";
import {
  Card,
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "@/lib/cards";

export type CardState = Partial<Card>;

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState<CardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "edit">("list");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await getCards();
      if (res.success && res.data) {
        setCards(res.data.cards || []);
      }
    } catch (error) {
      console.error("Fetch cards error:", error);
      toast.error("Failed to load your cards");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setActiveCard({
      senderName: "",
      recipientName: "",
      occasion: "Birthday",
      message: "",
      font: "Inter",
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      textSize: "medium",
      status: "draft",
    });
    setView("edit");
  };

  const handleEditCard = (card: Card) => {
    setActiveCard(card);
    setView("edit");
  };

  useLoadSelectedFont(activeCard?.font || "Inter");

  if (view === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-space">
          {/* Header Section */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#191A23] to-[#2D2E38] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .267M7 21H5a2 2 0 01-2-2v-4a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-[#191A23]">
                    Greeting Cards
                  </h1>
                  <p className="text-sm font-medium text-[#191A23]/60">
                    Create and manage beautiful personalized cards
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-[#191A23] to-[#2D2E38] text-white hover:shadow-lg hover:shadow-[#191A23]/20 rounded-lg border-0 border-b-4 border-b-[#000000] active:border-b-2 active:translate-y-1 transition-all font-bold py-3 px-6"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Card
            </Button>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-72 bg-white rounded-lg border border-[#191A23]/10 animate-pulse shadow-sm"
                />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="bg-white rounded-2xl border-2 border-dashed border-[#191A23]/20 p-12 text-center max-w-md w-full">
                <div className="w-16 h-16 bg-[#F3F3F3] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#191A23]/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .267M7 21H5a2 2 0 01-2-2v-4a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
                <p className="text-[#191A23] font-bold text-lg mb-1">
                  No Cards Yet
                </p>
                <p className="text-[#191A23]/60 text-sm mb-6 leading-relaxed">
                  Start creating beautiful personalized greeting cards to send
                  to your loved ones.
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-[#191A23] text-white hover:bg-[#2D2E38] rounded-lg font-bold w-full py-3"
                >
                  <svg
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Your First Card
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-[#191A23]/60">
                  {cards.length} card{cards.length !== 1 ? "s" : ""} in total
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map((card) => (
                  <div
                    key={card._id}
                    onClick={() => handleEditCard(card)}
                    className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-[#191A23]/10 hover:border-[#191A23]/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className="aspect-[4/5] w-full relative overflow-hidden bg-gradient-to-br"
                      style={{
                        backgroundColor: card.backgroundColor,
                        color: card.textColor,
                        fontFamily: card.font,
                      }}
                    >
                      {card.backgroundImageUrl ? (
                        <img
                          src={card.backgroundImageUrl}
                          alt="Card preview"
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] opacity-15 uppercase font-black">
                          {card.occasion}
                        </div>
                      )}
                      <div className="absolute inset-0 p-4 flex flex-col justify-center text-center">
                        <p className="text-xs font-black uppercase truncate mb-2 tracking-wide">
                          {card.recipientName}
                        </p>
                        <p className="text-[8px] line-clamp-3 leading-relaxed opacity-80 font-medium">
                          {card.message || "Click to add message..."}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="text-xs font-black uppercase truncate text-[#191A23] tracking-wider">
                        {card.occasion}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-[#191A23]/50">
                          {new Date(card.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <Badge
                          className={cn(
                            "text-[8px] font-black uppercase px-2 py-1 rounded-md border-0",
                            card.status === "completed"
                              ? "bg-[#D1FAE5] text-[#065F46]"
                              : "bg-[#FEE2E2] text-[#991B1B]",
                          )}
                        >
                          {card.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit View
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setView("list");
              fetchCards();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#191A23] hover:bg-[#191A23]/5 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Cards
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customizer Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CardCustomizer
                cardState={activeCard as any}
                setCardState={setActiveCard as any}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#191A23]/10">
              <CardPreview cardState={activeCard as any} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
