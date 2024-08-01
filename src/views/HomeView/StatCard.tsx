"use client";

import usePagination from "@/hooks/usePagination";
import { makeRows } from "@/hooks/useRows";
import {
    calcClicks, calcConversions, calcProfit,
    calcTotalCost, calcTotalRevenue, calcVisits
} from "../ReportView/DataTable/columnsMap";
import { minZero } from "@/lib/utils";
import { TPrimaryData, TClick, EItemName } from "@/lib/types";
import { EDataMetric } from ".";

const STAT_CARD_ROWS_PER_PAGE = 4;
const STAT_CARD_ROW_HEIGHT = 30; // pixels

type TStatCard = {
    title: string;
    metric: EDataMetric;
    rows: TStatCardRow[];
};
type TStatCardRow = { name: string, value: number };

export default function StatCard({ card }: {
    card: TStatCard;
}) {
    const { title, metric, rows } = card;

    const { Pagination, itemsOnCurrentPage } = usePagination(rows, STAT_CARD_ROWS_PER_PAGE);

    const numDummyRows = minZero(STAT_CARD_ROWS_PER_PAGE - itemsOnCurrentPage.length);

    return (
        <div className="rounded-md border shadow overflow-hidden">
            <StatCardRow className="bg-[#2f918e]">
                <span className="font-bold">{title}</span>
                <span className="font-bold">{metric}</span>
            </StatCardRow>
            {itemsOnCurrentPage.length === 0
                ? <div className="w-full text-center italic">no data...</div>
                : itemsOnCurrentPage.map(({ name, value }, index) => (
                    <StatCardRow key={index} className="border-b">
                        <span>{name}</span>
                        <span>{value}</span>
                    </StatCardRow>
                ))}
            {Array.from({ length: numDummyRows }).map((_, index) => (
                <StatCardRow key={index} />
            ))}
            {rows.length > STAT_CARD_ROWS_PER_PAGE &&
                <Pagination />
            }
        </div>
    )
}

function StatCardRow({ children, className = "" }: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={className + " flex justify-between items-center gap-2 w-full px-2"}
            style={{ height: `${STAT_CARD_ROW_HEIGHT}px` }}
        >
            {children}
        </div>
    )
}

export function makeStatCards(primaryData: TPrimaryData, clicks: TClick[], metric: EDataMetric): TStatCard[] {
    return [
        {
            title: "Campaigns",
            metric,
            rows: makeStatCardRows(primaryData, clicks, metric, EItemName.CAMPAIGN),
        },
        {
            title: "Traffic Sources",
            metric,
            rows: makeStatCardRows(primaryData, clicks, metric, EItemName.TRAFFIC_SOURCE),
        },
        {
            title: "Offers",
            metric,
            rows: makeStatCardRows(primaryData, clicks, metric, EItemName.OFFER),
        },
        {
            title: "Countries",
            metric,
            rows: makeStatCardRows(primaryData, clicks, metric, EItemName.COUNTRY),
        },
    ];
}

function makeStatCardRows(primaryData: TPrimaryData, clicks: TClick[], metric: EDataMetric, itemName: EItemName): TStatCardRow[] {
    return makeRows(primaryData, clicks, itemName).map(({ name }) => ({
        name,
        value: calcValueFromMetric(clicks, metric),
    }));
}

function calcValueFromMetric(clicks: TClick[], metric: EDataMetric): number {
    switch (metric) {
        case EDataMetric.visits:
            return calcVisits(clicks);
        case EDataMetric.clicks:
            return calcClicks(clicks);
        case EDataMetric.conversions:
            return calcConversions(clicks);
        case EDataMetric.revenue:
            return calcTotalRevenue(clicks);
        case EDataMetric.cost:
            return calcTotalCost(clicks);
        case EDataMetric.profit:
            return calcProfit(calcTotalRevenue(clicks), calcTotalCost(clicks));
        default:
            return 0;
    }
}
