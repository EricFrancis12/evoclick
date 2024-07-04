"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ReportViewProvider } from "./ReportViewContext";
import useActiveView from "@/hooks/useActiveView";
import useQueryRouter from "@/hooks/useQueryRouter";
import Report from "./Report";
import Tab from "@/app/dashboard/ReportView/Tab";
import { TView, useViewsStore } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";

export default function ReportView({ clicks, page, size, timeframe, reportItemName }: {
    clicks: TClick[];
    page: number;
    size: number;
    timeframe: [Date, Date];
    reportItemName: EItemName | null;
}) {
    const {
        mainView, reportViews, updateViewOnPageLoad, removeReportViewById
    } = useViewsStore(store => store);

    const activeView = useActiveView();
    useEffect(() => {
        if (!activeView?.id) return;
        updateViewOnPageLoad(activeView.id, { page, size, timeframe, });
    }, [page, size, timeframe]);

    const params = useParams();
    const queryRouter = useQueryRouter();

    function handleReportTabClick(view: TView) {
        if (!view.reportItemName) return;
        queryRouter.push(`/dashboard/report/${encodeURIComponent(view.reportItemName)}/${encodeURIComponent(view.id)}`);
    }

    // Delete view, then if the deleted view was the current one redirect to /dashboard
    function handleReportTabClose(view: TView) {
        removeReportViewById(view.id);
        if (view.id === params.id) {
            queryRouter.push("/dashboard");
        }
    }

    return (
        <ReportViewProvider>
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
                        onClick={() => queryRouter.push("/dashboard")}
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
                            clicks={clicks}
                            view={activeView}
                        />
                        : "Report Not Found :("
                    }
                </div>
            </div>
        </ReportViewProvider>
    )
}
