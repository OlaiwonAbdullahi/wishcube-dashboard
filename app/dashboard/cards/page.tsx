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
      <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#191A23]">
              Greeting Cards
            </h1>
            <p className="text-sm text-neutral-600">
              Manage and create beautiful personalized greeting cards.
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-[#191A23] text-white hover:bg-[#191A23]/90 rounded-sm border-b-4 border-[#000000] active:border-b-0 active:translate-y-1 transition-all"
          >
            Create New Card
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-neutral-100 animate-pulse rounded-sm border border-[#191A23]"
              />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#F3F3F3] border border-dashed border-[#191A23] rounded-sm">
            <p className="text-neutral-500 font-bold uppercase text-xs mb-4">
              No cards found
            </p>
            <Button onClick={handleCreateNew} variant="outline">
              Create your first card
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div
                key={card._id}
                onClick={() => handleEditCard(card)}
                className="group cursor-pointer bg-white border border-[#191A23] border-b-4 hover:border-b-8 transition-all p-4 rounded-sm space-y-3"
              >
                <div
                  className="aspect-[4/5] w-full rounded-sm overflow-hidden border border-[#191A23]/10 relative"
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
                      className="w-full h-full object-cover opacity-50"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] opacity-20 uppercase font-black">
                      {card.occasion}
                    </div>
                  )}
                  <div className="absolute inset-0 p-4 flex flex-col justify-center text-center">
                    <p className="text-[10px] font-black uppercase truncate mb-1">
                      {card.recipientName}
                    </p>
                    <p className="text-[8px] line-clamp-3 leading-tight opacity-80">
                      {card.message}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase truncate text-[#191A23]">
                    {card.occasion}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-neutral-400">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                    <Badge
                      className={cn(
                        "text-[8px] font-black uppercase px-1.5 py-0.5 border border-[#191A23]",
                        card.status === "completed"
                          ? "bg-[#B4F8C8] text-[#191A23]"
                          : "bg-[#FFE5E5] text-[#191A23]",
                      )}
                    >
                      {card.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 font-space">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => {
            setView("list");
            fetchCards();
          }}
          className="hover:bg-[#191A23]/5 text-[#191A23] font-bold"
        >
          ← Back to cards
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CardCustomizer
            cardState={activeCard as any}
            setCardState={setActiveCard as any}
          />
        </div>
        <div className="lg:col-span-2">
          <CardPreview cardState={activeCard as any} />
        </div>
      </div>
    </div>
  );
}
