"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import useActiveView from "@/hooks/useActiveView";
import useQueryRouter from "@/hooks/useQueryRouter";
import Report from "./Report";
import Tab, { TView } from "@/app/dashboard/ReportView/Tab";
import { useViewsStore } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";

export default function ReportView({ clicks, page, size, timeframe, reportItemName }: {
    clicks: TClick[];
    page: number;
    size: number;
    timeframe: [Date, Date];
    reportItemName: EItemName | null;
}) {
    const {
        mainView, reportViews, updateViewOnPageLoad, updateViewReportItemNameById, removeReportViewById
    } = useViewsStore(store => store);

    const activeView = useActiveView();
    useEffect(() => {
        if (activeView?.id) {
            updateViewOnPageLoad(activeView.id, { page, size, timeframe, });
            if (reportItemName) updateViewReportItemNameById(activeView.id, reportItemName);
        }
    }, [page, size, timeframe, reportItemName]);

    const params = useParams();
    const queryRouter = useQueryRouter();

    function handleViewClose(view: TView) {
        removeReportViewById(view.id);
        // If the deleted view was the current one, redirect to /dashboard
        if (view.id === params?.id) {
            queryRouter.push("/dashboard");
        }
    }

    return (
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
                        onClick={view => queryRouter.push(`/dashboard/report/${view.itemName}/${view.id}`)}
                        onClose={handleViewClose}
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
        </div >
    )
}
