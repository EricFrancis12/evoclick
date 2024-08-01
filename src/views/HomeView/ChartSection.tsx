"use client";

import { useState } from "react";
import Chart, { makeChartData } from "./Chart";
import { EDataMetric, lineColor } from ".";
import { TClick } from "@/lib/types";

export default function ChartSection({ clicks, timeframe }: {
    clicks: TClick[];
    timeframe: [Date, Date];
}) {
    const chartData = makeChartData(clicks, timeframe);

    const [metrics, setMetrics] = useState<Set<EDataMetric>>(new Set(Object.values(EDataMetric)));

    function handleChange(metric: EDataMetric) {
        const newMetrics = structuredClone(metrics);
        if (metrics.has(metric)) {
            newMetrics.delete(metric);
        } else {
            newMetrics.add(metric);
        }
        setMetrics(newMetrics);
    }

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <div className="grid grid-cols-3">
                {Object.values(EDataMetric).map((metric, index) => (
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
    )
}
