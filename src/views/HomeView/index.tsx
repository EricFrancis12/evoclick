"use client";

import { DataProvider } from "@/contexts/DataContext";
import HeaderSection from "./HeaderSection";
import UpperCardsSection from "./UpperCardsSection";
import ChartSection from "./ChartSection";
import LowerCardsSection from "./LowerCardsSection";
import { TPrimaryData, TClick } from "@/lib/types";

export enum EDataMetric {
    visits = "visits",
    clicks = "clicks",
    conversions = "conversions",
    revenue = "revenue",
    cost = "cost",
    profit = "profit",
};

export default function HomeView({ primaryData, clicks, timeframe }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
}) {
    return (
        <DataProvider primaryData={primaryData} clicks={clicks}>
            <main className="flex flex-col items-center gap-8 min-h-screen w-full pb-16">
                <HeaderSection timeframe={timeframe} />
                <UpperCardsSection clicks={clicks} />
                <ChartSection clicks={clicks} timeframe={timeframe} />
                <LowerCardsSection clicks={clicks} />
            </main>
        </DataProvider>
    )
}

export function lineColor(metric: EDataMetric): string {
    return metricColorsRecord[metric];
}

const metricColorsRecord: Record<EDataMetric, string> = {
    [EDataMetric.visits]: "blue",
    [EDataMetric.clicks]: "orange",
    [EDataMetric.conversions]: "purple",
    [EDataMetric.revenue]: "teal",
    [EDataMetric.cost]: "yellow",
    [EDataMetric.profit]: "green",
} 
