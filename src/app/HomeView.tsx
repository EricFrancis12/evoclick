"use client";

import { useState } from "react";
import Link from "next/link";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { startOfDay } from "date-fns";
import { DataProvider } from "@/contexts/DataContext";
import useIsServerSide from "@/hooks/useIsServerSide";
import useQueryRouter from "@/hooks/useQueryRouter";
import CalendarButton from "@/components/CalendarButton";
import { encodeTimeframe, startOfDaysBetween } from "@/lib/utils";
import { TPrimaryData, TClick } from "@/lib/types";

export default function HomeView({ primaryData, clicks, timeframe }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
}) {
    const queryRouter = useQueryRouter();

    const chartData = makeChartData(clicks, timeframe);

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
            <main className="flex flex-col justify-center items-center gap-2 h-screen w-full">
                Home Page
                <Link href="/dashboard">
                    Navigate to Dashboard
                </Link>
                <CalendarButton
                    timeframe={timeframe}
                    onChange={_timeframe => queryRouter.push(
                        window.location.href,
                        { timeframe: encodeTimeframe(_timeframe) }
                    )}
                />
                <div>
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
                    data={chartData}
                    lines={Array.from(lines).map(line => ({ dataKey: line, stroke: lineColor(line) }))}
                />
            </main>
        </DataProvider>
    )
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

function Chart({ data, lines }: {
    data: TChartDataPoint[];
    lines: { dataKey: string, stroke: string }[];
}) {
    const isServerSide = useIsServerSide();

    if (isServerSide) return null;

    return (
        <LineChart width={500} height={300} data={data}>
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
