"use client";

import Link from "next/link";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { startOfDay } from "date-fns";
import { DataProvider } from "@/contexts/DataContext";
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

    // const [chartData, setChartData] = useState<TChartDataPoint[]>(makeChartData(clicks, timeframe));
    const chartData = makeChartData(clicks, timeframe);

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
                <Chart data={chartData} lines={lines} />
            </main>
        </DataProvider>
    )
}

const lines: string[] = ["visits", "clicks", "conversions", "revenue", "cost", "profit"];

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
    lines: string[];
}) {
    return (
        <LineChart width={500} height={300} data={data}>
            {data.length < 5 && <XAxis dataKey="name" />}
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            {lines.map((line, index) => (
                <Line
                    key={index}
                    type="monotone"
                    dataKey={line}
                    stroke={colorFromIndex(index)}
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

function colorFromIndex(index: number): string {
    return colors[index] ?? "black";
}

const colors: string[] = [
    "green",
    "red",
    "blue",
    "yellow",
    "purple",
    "orange",
];
