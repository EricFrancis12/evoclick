"use client";

import TextSubtextCard, { makeTextSubtextCards } from "./TextSubtextCard";
import { TClick } from "@/lib/types";

export default function UpperCardsSection({ clicks }: {
    clicks: TClick[];
}) {
    const textSubtextCards = makeTextSubtextCards(clicks);

    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 w-full px-3 md:px-6">
            {textSubtextCards.map((card, index) => (
                <TextSubtextCard key={index} card={card} />
            ))}
        </div>
    )
}
