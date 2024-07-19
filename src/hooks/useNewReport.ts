"use client";

import { itemNameToIcon } from "@/app/dashboard/ReportView/Report";
import useQueryRouter from "@/hooks/useQueryRouter";
import { useViewsStore, newReportView } from "@/lib/store";
import { encodeTimeframe } from "@/lib/utils";
import { EItemName } from "@/lib/types";

export default function useNewReport() {
    const { reportViews, addReportView } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    // Finds the first row that is selected and creates a report for it
    return function handleNewReport(
        reportItemName: EItemName,
        id: string,
        timeframe: [Date, Date]
    ) {
        const newViewItemName = reportItemName !== EItemName.CAMPAIGN ? EItemName.CAMPAIGN : EItemName.OFFER;
        const newView = newReportView(newViewItemName, itemNameToIcon(reportItemName), reportItemName, id);
        if (!reportViews.some(v => v.itemName === newView.itemName && v.id === newView.id)) {
            addReportView(newView);
        }
        if (newView.reportItemName) {
            queryRouter.push(
                `/dashboard/report/${encodeURIComponent(newView.reportItemName)}/${encodeURIComponent(newView.id)}`,
                { timeframe: encodeTimeframe(timeframe) }
            );
        }
    }
}
