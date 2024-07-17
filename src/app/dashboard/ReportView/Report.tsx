"use client";

import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { useReportView } from "./ReportViewContext";
import { useRows } from "@/hooks/useRows";
import useQueryRouter from "@/hooks/useQueryRouter";
import UpperControlPanel from "./UpperControlPanel";
import LowerControlPanel from "./LowerControlPanel";
import DataTable from "./DataTable";
import ReportSkeleton from "./ReportSkeleton";
import { TView, useViewsStore, newReportView } from "@/lib/store";
import { encodeTimeframe } from "@/lib/utils";
import { EItemName } from "@/lib/types";

export default function Report({ view, reportItemName }: {
    view: TView;
    reportItemName?: EItemName;
}) {
    const { id, itemName } = view;
    const { clicks } = useReportView();
    const [rows, setRows] = useRows(clicks, itemName);

    const { reportViews, addReportView, updateViewItemNameById } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    // Finds the first row that is selected and creates a report for it
    function handleNewReport() {
        if (!rows) return;
        const selectedRows = rows.filter(row => row.selected);
        if (selectedRows.length < 1) return;
        const newViewItemName = itemName !== EItemName.CAMPAIGN ? EItemName.CAMPAIGN : EItemName.OFFER;
        const newView = newReportView(newViewItemName, faBullseye, itemName, selectedRows[0].id.toString());
        if (!reportViews.some(v => v.itemName === newView.itemName && v.id === newView.id)) {
            addReportView(newView);
        }
        if (newView.reportItemName) {
            queryRouter.push(
                `/dashboard/report/${encodeURIComponent(newView.reportItemName)}/${encodeURIComponent(newView.id)}`,
                { timeframe: encodeTimeframe(view.timeframe) }
            );
        }
    }

    return rows
        ? <>
            <UpperControlPanel
                onClick={item => updateViewItemNameById(id, item.itemName)}
                reportItemName={reportItemName}
            />
            <LowerControlPanel
                view={view}
                onNewReport={handleNewReport}
                reportItemName={reportItemName}
                rows={rows}
                setRows={setRows}
            />
            <DataTable
                view={view}
                rows={rows}
                setRows={setRows}
            />
        </>
        : <ReportSkeleton />
}
