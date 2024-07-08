"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ReportViewProvider, TPrimaryData } from "./ReportViewContext";
import useActiveView from "@/hooks/useActiveView";
import useQueryRouter from "@/hooks/useQueryRouter";
import Report from "./Report";
import Tab from "@/app/dashboard/ReportView/Tab";
import { TView, useViewsStore } from "@/lib/store";
import { encodeTimeframe } from "@/lib/utils";
import { EItemName, TClick } from "@/lib/types";

export default function ReportView({ primaryData, clicks, timeframe, reportItemName }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
    reportItemName?: EItemName;
}) {
    const { mainView, reportViews, updateViewOnPageLoad, removeReportViewById } = useViewsStore(store => store);

    const activeView = useActiveView();
    useEffect(() => {
        if (!activeView?.id) return;
        updateViewOnPageLoad(activeView.id, { timeframe });
    }, [timeframe]);

    const params = useParams();
    const queryRouter = useQueryRouter();

    function handleReportTabClick(view: TView) {
        if (!view.reportItemName) return;
        queryRouter.push(
            `/dashboard/report/${encodeURIComponent(view.reportItemName)}/${encodeURIComponent(view.id)}`,
            { timeframe: encodeTimeframe(view.timeframe) }
        );
    }

    // Delete view, then if the deleted view was the current one redirect to /dashboard
    function handleReportTabClose(view: TView) {
        removeReportViewById(view.id);
        if (view.id === params.id) {
            queryRouter.push("/dashboard", { timeframe: encodeTimeframe(mainView.timeframe) });
        }
    }

    return (
        <ReportViewProvider primaryData={primaryData} clicks={clicks}>
            <div className="h-screen w-full">
                <div className="flex h-[40px] w-[100vw] bg-[#2f918e]">
                    <div className="flex justify-center items-center h-full">
                        <Image
                            src="/assets/images/logo-no-bg.png"
                            alt="Logo"
                            height={35}
                            width={35}
                            className="mx-6"
                        />
                    </div>
                    <Tab
                        view={mainView}
                        onClick={() => queryRouter.push("/dashboard", { timeframe: encodeTimeframe(mainView.timeframe) })}
                    />
                    {reportViews.map(view => (
                        <Tab
                            key={view.id}
                            view={view}
                            onClick={handleReportTabClick}
                            onClose={handleReportTabClose}
                        />
                    ))}
                </div>
                <div className="width-[100vw] text-sm">
                    {activeView
                        ? <Report
                            view={activeView}
                            reportItemName={reportItemName}
                        />
                        : "Report Not Found :("
                    }
                </div>
            </div>
        </ReportViewProvider>
    )
}
