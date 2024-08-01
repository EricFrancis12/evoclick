"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { startOfDay } from "date-fns";
import useIsServerSide from "@/hooks/useIsServerSide";
import { startOfDaysBetween } from "@/lib/utils";
import { TClick } from "@/lib/types";
import { EDataMetric } from ".";

export type TChartDataPoint = {
    name: string;
    [EDataMetric.visits]: number;
    [EDataMetric.clicks]: number;
    [EDataMetric.conversions]: number;
    [EDataMetric.revenue]: number;
    [EDataMetric.cost]: number;
    [EDataMetric.profit]: number;
};

export default function Chart({ data, lines, height, width, className }: {
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

export function makeChartData(clicks: TClick[], timeframe: [Date, Date]): TChartDataPoint[] {
    const dates = startOfDaysBetween(timeframe);
    const datesMap: Map<string, TChartDataPoint> = new Map();
    for (const date of dates) {
        datesMap.set(date.toLocaleDateString(), {
            name: date.toLocaleDateString(),
            [EDataMetric.visits]: 0,
            [EDataMetric.clicks]: 0,
            [EDataMetric.conversions]: 0,
            [EDataMetric.revenue]: 0,
            [EDataMetric.cost]: 0,
            [EDataMetric.profit]: 0,
        });
    }

    for (const click of clicks) {
        const viewTimeSOD = startOfDay(click.viewTime).toLocaleDateString();
        const viewTimeDataPoint = datesMap.get(viewTimeSOD);
        if (viewTimeDataPoint) {
            datesMap.set(viewTimeSOD, {
                ...viewTimeDataPoint,
                [EDataMetric.visits]: viewTimeDataPoint[EDataMetric.visits] + 1,
                [EDataMetric.cost]: viewTimeDataPoint[EDataMetric.cost] + click.cost,
            });
        }

        if (click.clickTime) {
            const clickTimeSOD = startOfDay(click.clickTime).toLocaleDateString();
            const clickTimeDataPoint = datesMap.get(clickTimeSOD);
            if (clickTimeDataPoint) {
                datesMap.set(clickTimeSOD, { ...clickTimeDataPoint, [EDataMetric.clicks]: clickTimeDataPoint[EDataMetric.clicks] + 1 });
            }
        }

        if (click.convTime) {
            const convTimeSOD = startOfDay(click.convTime).toLocaleDateString();
            const convTimeDataPoint = datesMap.get(convTimeSOD);
            if (convTimeDataPoint) {
                datesMap.set(convTimeSOD, {
                    ...convTimeDataPoint,
                    [EDataMetric.conversions]: convTimeDataPoint[EDataMetric.conversions] + 1,
                    [EDataMetric.revenue]: convTimeDataPoint[EDataMetric.revenue] + click.revenue,
                    [EDataMetric.profit]: convTimeDataPoint[EDataMetric.profit] + click.revenue - click.cost,
                });
            }
        }
    }

    return Array.from(datesMap.values());
}
