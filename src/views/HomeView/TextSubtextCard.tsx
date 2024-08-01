"use client";

import {
    calcClicks, calcConversions, calcProfit, calcROI,
    calcTotalCost, calcTotalRevenue, calcVisits
} from "../ReportView/DataTable/columnsMap";
import { TClick } from "@/lib/types";

type TTextSubtextCard = {
    text: string;
    subtext: string;
};

export default function TextSubtextCard({ card }: {
    card: TTextSubtextCard;
}) {
    const { text, subtext } = card;

    return (
        <div className="flex md:flex-col justify-between md:justify-center items-center gap-2 w-full md:w-[unset] px-4 py-2 border rounded-md shadow">
            <span>{text}</span>
            <span>{subtext}</span>
        </div>
    )
}

export function makeTextSubtextCards(clicks: TClick[]): TTextSubtextCard[] {
    const revenue = calcTotalRevenue(clicks);
    const cost = calcTotalCost(clicks)
    return [
        {
            text: "Visits",
            subtext: calcVisits(clicks).toString(),
        },
        {
            text: "Clicks",
            subtext: calcClicks(clicks).toString(),
        },
        {
            text: "Conversions",
            subtext: calcConversions(clicks).toString(),
        },
        {
            text: "Revenue",
            subtext: revenue.toString(),
        },
        {
            text: "Cost",
            subtext: cost.toString(),
        },
        {
            text: "Profit",
            subtext: calcProfit(revenue, cost).toString(),
        },
        {
            text: "ROI",
            subtext: calcROI(revenue, cost).toString(),
        },
    ];
}
