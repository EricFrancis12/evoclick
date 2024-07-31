"use client";

import { useState } from "react";
import { faTachometerAltFast } from "@fortawesome/free-solid-svg-icons";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { startOfDay } from "date-fns";
import { DataProvider } from "@/contexts/DataContext";
import useIsServerSide from "@/hooks/useIsServerSide";
import useQueryRouter from "@/hooks/useQueryRouter";
import Button from "@/components/Button";
import CalendarButton from "@/components/CalendarButton";
import {
    calcClicks, calcConversions, calcProfit,
    calcROI, calcTotalCost, calcTotalRevenue, calcVisits
} from "./dashboard/ReportView/DataTable/columnsMap";
import { encodeTimeframe, startOfDaysBetween } from "@/lib/utils";
import { TPrimaryData, TClick } from "@/lib/types";

export default function HomeView({ primaryData, clicks, timeframe }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
}) {
    const queryRouter = useQueryRouter();

    const chartData = makeChartData(clicks, timeframe);
    const cards = makeCards(clicks);
    const statsCards = makeStateCards();

    const [lines, setLines] = useState<Set<ELine>>(new Set(Object.values(ELine)));

    function handleChange(line: ELine) {
        const newLines = structuredClone(lines);
        if (lines.has(line)) {
            newLines.delete(line);
        } else {
            newLines.add(line);
        }
        setLines(newLines);
    }

    return (
        <DataProvider primaryData={primaryData} clicks={clicks}>
            <main className="flex flex-col items-center gap-4 h-screen w-full">
                <div className="flex justify-end items-center gap-2 w-full p-2">
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
                <div className={`grid grid-cols-1 md:grid-cols-${cards.length} gap-2 w-full p-4 md:px-2`}>
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
                <div className="flex justify-center w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-[90%]">
                        {statsCards.map((statsCard, index) => (
                            <StatsCard
                                key={index}
                                card={statsCard}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                    <div className="grid grid-cols-3">
                        {Object.values(ELine).map((line, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={lines.has(line)}
                                    onChange={() => handleChange(line)}
                                />
                                <span>{line}</span>
                            </div>
                        ))}
                    </div>
                    <Chart
                        height={400}
                        width="100%"
                        className="px-4 sm:px-8 md:px-16"
                        data={chartData}
                        lines={Array.from(lines).map(line => ({ dataKey: line, stroke: lineColor(line) }))}
                    />
                </div>
            </main>
        </DataProvider>
    )
}

type TStatsCard = {
    title: string;
    metric: string;
    rows: { text: string, value: number }[];
};

function makeStateCards(): TStatsCard[] {
    return _statsCards;
}

const _statsCards: TStatsCard[] = [
    {
        title: "title",
        metric: "metric",
        rows: [
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
        ],
    },
    {
        title: "title",
        metric: "metric",
        rows: [
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
        ],
    },
    {
        title: "title",
        metric: "metric",
        rows: [
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
            { text: "text", value: 1 },
        ],
    },
];

function StatsCard({ card }: {
    card: TStatsCard;
}) {
    const { title, metric, rows } = card;

    return (
        <div className="rounded-md border shadow overflow-hidden">
            <StatsCardRow className="bg-blue-300">
                <span>{title}</span>
                <span>{metric}</span>
            </StatsCardRow>
            {rows.map(({ text, value }, index) => (
                <StatsCardRow key={index}>
                    <span>{text}</span>
                    <span>{value}</span>
                </StatsCardRow>
            ))}
        </div>
    )
}

function StatsCardRow({ children, className = "" }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className + " flex justify-between items-center gap-2 w-full px-2"}>
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

enum ELine {
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
            <LineChart
                data={data}
            >
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
                <Legend />
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

function lineColor(line: ELine): string {
    return lineColorsRecord[line];
}

const lineColorsRecord: Record<ELine, string> = {
    [ELine.visits]: "blue",
    [ELine.clicks]: "orange",
    [ELine.conversions]: "purple",
    [ELine.revenue]: "teal",
    [ELine.cost]: "yellow",
    [ELine.profit]: "green",
} 
