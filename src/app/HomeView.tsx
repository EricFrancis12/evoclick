"use client";

import Link from "next/link";
import { ReportViewProvider } from "./dashboard/ReportView/ReportViewContext";
import useQueryRouter from "@/hooks/useQueryRouter";
import CalendarButton from "@/components/CalendarButton";
import { encodeTimeframe } from "@/lib/utils";
import { TPrimaryData, TClick } from "@/lib/types";
import { DataProvider } from "@/contexts/DataContext";

export default function HomeView({ primaryData, clicks, timeframe }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
}) {
    const queryRouter = useQueryRouter();

    return (
        <DataProvider primaryData={primaryData} clicks={clicks}>
            <ReportViewProvider>
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
        </DataProvider>
    )
}
