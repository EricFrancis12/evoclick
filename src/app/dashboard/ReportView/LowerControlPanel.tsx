"use client";

import useQueryRouter from "@/hooks/useQueryRouter";
import CalendarButton from "@/components/CalendarButton";
import RefreshButton from "@/components/RefreshButton";
import ReportButton from "@/components/ReportButton";
import ReportChain from "./ReportChain";
import { TView, useViewsStore } from "@/lib/store";

export default function LowerControlPanel({ view, onNewReport, newReportDisabled }: {
    view: TView;
    onNewReport: () => any;
    newReportDisabled?: boolean;
}) {
    const { updateViewReportChainById } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    return (
        <div
            className="flex flex-col justify-center align-start gap-6 w-full px-8 py-6 bg-[#ebedef]"
            style={{ borderTop: "solid lightgrey 3px" }}
        >
            <LowerCPRow>
                <CalendarButton
                    timeframe={view.timeframe}
                    onChange={timeframe => {
                        if (view.reportItemName) {
                            queryRouter.push(`/dashboard/report/${encodeURIComponent(view.reportItemName)}/${encodeURIComponent(view.id)}`);
                        }
                    }}
                />
                <RefreshButton />
                {view.type === "main" &&
                    <ReportButton
                        onClick={onNewReport}
                        disabled={newReportDisabled}
                    />
                }
            </LowerCPRow>
            <LowerCPRow>
                {view.type === "report" &&
                    <ReportChain
                        reportChain={view.reportChain}
                        onChange={reportChain => updateViewReportChainById(view.id, reportChain)}
                    />
                }
            </LowerCPRow>
        </div>
    )
}

function LowerCPRow({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex gap-6 w-full">
            <div className="flex flex-wrap gap-2 justify-center items-center">
                {children}
            </div>
        </div>
    )
}
