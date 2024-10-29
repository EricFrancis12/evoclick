"use client";

import { useState } from "react";
import { TClick, TPrimaryData } from "@/lib/types";
import ControlPanel from "./ControlPanel";
import ClicksTable from "./ClicksTable";
import { ActionMenuProvider } from "../../contexts/ActionMenuContext";

export default function ClicksView({ primaryData, clicks, timeframe, currentPage, totalPages }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
    currentPage: number;
    totalPages: number;
}) {
    const [selectedClickIds, setSelectedClickIds] = useState<Set<number>>(new Set());

    return (
        <ActionMenuProvider>
            <main className="flex flex-col items-center gap-8 min-h-screen w-full pb-16">
                <ControlPanel
                    primaryData={primaryData}
                    timeframe={timeframe}
                    currentPage={currentPage}
                    selectedClickIds={selectedClickIds}
                    setSelectedClickIds={setSelectedClickIds}
                />
                <ClicksTable
                    clicks={clicks}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    selectedClickIds={selectedClickIds}
                    setSelectedClickIds={setSelectedClickIds}
                />
            </main>
        </ActionMenuProvider>
    )
}
