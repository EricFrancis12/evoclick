"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DialogueViewProvider } from "./contexts/DialogueMenuContext";
import { ReportViewProvider, TPrimaryData } from "./ReportViewContext";
import useActiveView from "@/hooks/useActiveView";
import useQueryRouter from "@/hooks/useQueryRouter";
import Report from "./Report";
import ReportSkeleton from "./ReportSkeleton";
import Tab from "@/app/dashboard/ReportView/Tab";
import TabSkeleton from "./Tab/TabSkeleton";
import { TView, useViewsStore } from "@/lib/store";
import { encodeTimeframe } from "@/lib/utils";
import { EItemName, TClick } from "@/lib/types";

export default function ReportView({ primaryData, clicks, timeframe, reportItemName, reportItemId }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    timeframe: [Date, Date];
    reportItemName?: EItemName;
    reportItemId?: string;
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
        if (typeof params.id === "string" && view.id === decodeURIComponent(params.id)) {
            queryRouter.push("/dashboard", { timeframe: encodeTimeframe(mainView.timeframe) });
        }
    }

    return (
        <ReportViewProvider primaryData={primaryData} clicks={clicks}>
            <DialogueViewProvider>
                <div className="flex flex-col h-screen w-full">
                    <div className="flex gap-2 h-[40px] w-[100vw] bg-[#2f918e]">
                        <div className="flex justify-center items-center h-full">
                            <Link href="/" className="hidden md:inline px-6">
                                <Image
                                    src="/assets/images/logo-no-bg.png"
                                    alt="Logo"
                                    height={35}
                                    width={35}
                                />
                            </Link>
                        </div>
                        {activeView
                            ? <>
                                <Tab
                                    view={mainView}
                                    onClick={() => queryRouter.push("/dashboard", { timeframe: encodeTimeframe(mainView.timeframe) })}
                                />
                                {reportViews.map(view => (
                                    <Tab
                                        key={view.id}
                                        view={view}
                                        reportItemId={reportItemId}
                                        onClick={handleReportTabClick}
                                        onClose={handleReportTabClose}
                                    />
                                ))}
                            </>
                            : <TabSkeleton />
                        }
                    </div>
                    <div className="flex flex-col flex-1 text-sm">
                        {activeView
                            ? <Report
                                view={activeView}
                                reportItemName={reportItemName}
                            />
                            : <ReportSkeleton reportItemName={reportItemName} />
                        }
                    </div>
                </div>
            </DialogueViewProvider>
        </ReportViewProvider>
    )
}
