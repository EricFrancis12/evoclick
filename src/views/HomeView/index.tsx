"use client";

import { useState } from "react";
import { faTachometerAltFast } from "@fortawesome/free-solid-svg-icons";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { startOfDay } from "date-fns";
import { DataProvider } from "@/contexts/DataContext";
import useIsServerSide from "@/hooks/useIsServerSide";
import usePagination from "@/hooks/usePagination";
import useQueryRouter from "@/hooks/useQueryRouter";
import { makeRows } from "@/hooks/useRows";
import Button from "@/components/Button";
import CalendarButton from "@/components/CalendarButton";
import {
    calcClicks, calcConversions, calcProfit, calcROI,
    calcTotalCost, calcTotalRevenue, calcVisits
} from "../ReportView/DataTable/columnsMap";
import { encodeTimeframe, startOfDaysBetween, zeroIfNeg } from "@/lib/utils";
import { TPrimaryData, TClick, EItemName } from "@/lib/types";
import DropdownButton from "@/components/DropdownButton";

export default function HomeView({ primaryData, clicks, timeframe }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
}) {
    const queryRouter = useQueryRouter();

    const chartData = makeChartData(clicks, timeframe);
    const cards = makeCards(clicks);

    const [metric, setMetric] = useState<EMetric>(EMetric.visits);
    const statCards = makeStatCards(primaryData, clicks, metric);

    const [metrics, setMetrics] = useState<Set<EMetric>>(new Set(Object.values(EMetric)));

    function handleChange(metric: EMetric) {
        const newMetrics = structuredClone(metrics);
        if (metrics.has(metric)) {
            newMetrics.delete(metric);
        } else {
            newMetrics.add(metric);
        }
        setMetrics(newMetrics);
    }

    return (
        <DataProvider primaryData={primaryData} clicks={clicks}>
            <main className="flex flex-col items-center gap-8 min-h-screen w-full pb-16">
                <div className="flex justify-end items-center gap-2 w-full p-4">
                    <CalendarButton
                        timeframe={timeframe}
                        onChange={_timeframe => queryRouter.push(
                            window.location.href,
                            { timeframe: encodeTimeframe(_timeframe) }
                        )}
                    />
                    <Button
                        text="Dashboard"
                        icon={faTachometerAltFast}
                        onClick={() => queryRouter.push(
                            "/dashboard",
                            { timeframe: encodeTimeframe(timeframe) }
                        )}
                    />
                </div>
                <div className={"grid grid-cols-1 md:grid-cols-7 gap-2 w-full px-3 md:px-6"}>
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="flex md:flex-col justify-between md:justify-center items-center gap-2 w-full md:w-[unset] px-4 py-2 border rounded-md shadow"
                        >
                            <span>{card.text}</span>
                            <span>{card.subtext}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                    <div className="grid grid-cols-3">
                        {Object.values(EMetric).map((metric, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={metrics.has(metric)}
                                    onChange={() => handleChange(metric)}
                                />
                                <span>{metric}</span>
                            </div>
                        ))}
                    </div>
                    <Chart
                        height={400}
                        width="100%"
                        className="px-4 sm:px-8 md:px-16"
                        data={chartData}
                        lines={Array.from(metrics).map(metric => ({ dataKey: metric, stroke: lineColor(metric) }))}
                    />
                </div>
                <div className="flex flex-col items-center gap-4 md:gap-8 w-[90%]">
                    <div className="flex justify-end items-center w-full">
                        <DropdownButton
                            value={metric}
                            options={Object.values(EMetric)}
                            onClick={setMetric}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                        {statCards.map((statsCard, index) => (
                            <StatsCard key={index} card={statsCard} />
                        ))}
                    </div>
                </div>
            </main>
        </DataProvider>
    )
}

type TStatCard = {
    title: string;
    metric: EMetric;
    rows: TStatCardRow[];
};
type TStatCardRow = { name: string, value: number };

function calcValueFromMetric(clicks: TClick[], metric: EMetric): number {
    switch (metric) {
        case EMetric.visits:
            return calcVisits(clicks);
        case EMetric.clicks:
            return calcClicks(clicks);
        case EMetric.conversions:
            return calcConversions(clicks);
        case EMetric.revenue:
            return calcTotalRevenue(clicks);
        case EMetric.cost:
            return calcTotalCost(clicks);
        case EMetric.profit:
            return calcProfit(calcTotalRevenue(clicks), calcTotalCost(clicks));
        default:
            return 0;
    }
}

function makeStatCards(primaryData: TPrimaryData, clicks: TClick[], metric: EMetric): TStatCard[] {
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

function makeStatCardRows(primaryData: TPrimaryData, clicks: TClick[], metric: EMetric, itemName: EItemName): TStatCardRow[] {
    return makeRows(primaryData, clicks, itemName).map(({ name }) => ({
        name,
        value: calcValueFromMetric(clicks, metric),
    }));
}

const ROWS_PER_PAGE = 4;

function StatsCard({ card }: {
    card: TStatCard;
}) {
    const { title, metric, rows } = card;

    const { Pagination, itemsOnCurrentPage } = usePagination(rows, ROWS_PER_PAGE);

    const numDummyRows = zeroIfNeg(ROWS_PER_PAGE - itemsOnCurrentPage.length);

    return (
        <div className="rounded-md border shadow overflow-hidden">
            <StatsCardRow className="bg-[#2f918e]">
                <span className="font-bold">{title}</span>
                <span className="font-bold">{metric}</span>
            </StatsCardRow>
            {itemsOnCurrentPage.length === 0
                ? <div className="w-full text-center italic">no data...</div>
                : itemsOnCurrentPage.map(({ name, value }, index) => (
                    <StatsCardRow key={index} className="border-b">
                        <span>{name}</span>
                        <span>{value}</span>
                    </StatsCardRow>
                ))}
            {Array.from({ length: numDummyRows }).map((_, index) => (
                <StatsCardRow key={index} />
            ))}
            {rows.length > ROWS_PER_PAGE &&
                <Pagination />
            }
        </div>
    )
}

const STATS_CARD_ROW_HEIGHT = 30; // pixels

function StatsCardRow({ children, className = "" }: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={className + " flex justify-between items-center gap-2 w-full px-2"}
            style={{ height: `${STATS_CARD_ROW_HEIGHT}px` }}
        >
            {children}
        </div>
    )
}

type TCard = {
    text: string;
    subtext: string;
};

function makeCards(clicks: TClick[]): TCard[] {
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

enum EMetric {
    visits = "visits",
    clicks = "clicks",
    conversions = "conversions",
    revenue = "revenue",
    cost = "cost",
    profit = "profit",
};

type TChartDataPoint = {
    name: string;
    visits: number;
    clicks: number;
    conversions: number;
    revenue: number;
    cost: number;
    profit: number;
};

function Chart({ data, lines, height, width, className }: {
    data: TChartDataPoint[];
    lines: { dataKey: string, stroke: string }[];
    height: string | number;
    width?: string | number;
    className?: string;
}) {
    const isServerSide = useIsServerSide();
    if (isServerSide) return null;

    return (
        <ResponsiveContainer height={height} width={width} className={className}>
            <LineChart data={data}>
                {data.length < 5 && <XAxis dataKey="name" />}
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                {lines.map(({ dataKey, stroke }, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        dataKey={dataKey}
                        stroke={stroke}
                    />
                ))}
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

function makeChartData(clicks: TClick[], timeframe: [Date, Date]): TChartDataPoint[] {
    const dates = startOfDaysBetween(timeframe);
    const datesMap: Map<string, TChartDataPoint> = new Map();
    for (const date of dates) {
        datesMap.set(date.toLocaleDateString(), {
            name: date.toLocaleDateString(),
            visits: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
        });
    }

    for (const click of clicks) {
        const viewTimeSOD = startOfDay(click.viewTime).toLocaleDateString();
        const viewTimeDataPoint = datesMap.get(viewTimeSOD);
        if (viewTimeDataPoint) {
            datesMap.set(viewTimeSOD, {
                ...viewTimeDataPoint,
                visits: viewTimeDataPoint.visits + 1,
                cost: viewTimeDataPoint.cost + click.cost,
            });
        }

        if (click.clickTime) {
            const clickTimeSOD = startOfDay(click.clickTime).toLocaleDateString();
            const clickTimeDataPoint = datesMap.get(clickTimeSOD);
            if (clickTimeDataPoint) {
                datesMap.set(clickTimeSOD, { ...clickTimeDataPoint, clicks: clickTimeDataPoint.clicks + 1 });
            }
        }

        if (click.convTime) {
            const convTimeSOD = startOfDay(click.convTime).toLocaleDateString();
            const convTimeDataPoint = datesMap.get(convTimeSOD);
            if (convTimeDataPoint) {
                datesMap.set(convTimeSOD, {
                    ...convTimeDataPoint,
                    conversions: convTimeDataPoint.conversions + 1,
                    revenue: convTimeDataPoint.revenue + click.revenue,
                    profit: convTimeDataPoint.profit + click.revenue - click.cost,
                });
            }
        }
    }

    return Array.from(datesMap.values());
}

function lineColor(metric: EMetric): string {
    return metricColorsRecord[metric];
}

const metricColorsRecord: Record<EMetric, string> = {
    [EMetric.visits]: "blue",
    [EMetric.clicks]: "orange",
    [EMetric.conversions]: "purple",
    [EMetric.revenue]: "teal",
    [EMetric.cost]: "yellow",
    [EMetric.profit]: "green",
} 
