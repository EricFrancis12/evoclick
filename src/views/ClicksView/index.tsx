import { TClick, TPrimaryData } from "@/lib/types";
import ControlPanel from "./ControlPanel";
import ClicksTable from "./ClicksTable";

export default function ClicksView({ primaryData, clicks, timeframe, currentPage, totalPages }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
    currentPage: number;
    totalPages: number;
}) {
    return (
        <main className="flex flex-col items-center gap-8 min-h-screen w-full pb-16">
            <ControlPanel
                primaryData={primaryData}
                timeframe={timeframe}
                currentPage={currentPage}
            />
            <ClicksTable
                clicks={clicks}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </main>
    )
}
