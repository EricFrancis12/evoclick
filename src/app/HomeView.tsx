"use client";

import Link from "next/link";
import { ReportViewProvider, TPrimaryData } from "./dashboard/ReportView/ReportViewContext";
import useQueryRouter from "@/hooks/useQueryRouter";
import CalendarButton from "@/components/CalendarButton";
import { encodeTimeframe } from "@/lib/utils";
import { TClick } from "@/lib/types";

export default function HomeView({ primaryData, clicks, timeframe }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
}) {
    const queryRouter = useQueryRouter();

    return (
        <ReportViewProvider primaryData={primaryData} clicks={clicks}>
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
            </main>
        </ReportViewProvider>
    )
}
