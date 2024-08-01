"use client";

import { useState } from "react";
import { useDataContext } from "@/contexts/DataContext";
import DropdownButton from "@/components/DropdownButton";
import StatCard, { makeStatCards } from "./StatCard";
import { EDataMetric } from ".";
import { TClick } from "@/lib/types";

export default function LowerCardsSection({ clicks }: {
    clicks: TClick[];
}) {
    const { primaryData } = useDataContext();

    const [metric, setMetric] = useState<EDataMetric>(EDataMetric.visits);
    const statCards = makeStatCards(primaryData, clicks, metric);

    return (
        <div className="flex flex-col items-center gap-4 md:gap-8 w-[90%]">
            <div className="flex justify-end items-center w-full">
                <DropdownButton
                    value={metric}
                    options={Object.values(EDataMetric)}
                    onClick={setMetric}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                {statCards.map((statCard, index) => (
                    <StatCard key={index} card={statCard} />
                ))}
            </div>
        </div>
    )
}
