"use client";

import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useReportView } from "./ReportViewContext";
import useQueryRouter from "@/hooks/useQueryRouter";
import CalendarButton from "@/components/CalendarButton";
import RefreshButton from "@/components/RefreshButton";
import ReportButton from "@/components/ReportButton";
import ReportChain from "./ReportChain";
import { TView, useViewsStore } from "@/lib/store";
import Button from "@/components/Button";
import { EItemName } from "@/lib/types";
import { TRow } from "./DataTable";

export default function LowerControlPanel({ view, onNewReport, reportItemName, rows }: {
    view: TView;
    onNewReport: () => any;
    reportItemName?: EItemName;
    rows: TRow[];
}) {
    const { setActionMenu } = useReportView();

    const { updateViewReportChainById } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    const selectedRows = rows.filter(row => row.selected === true);

    function handleCreateNewItem() {
        if (view.itemName === EItemName.FLOW) {
            setActionMenu({ itemName: EItemName.FLOW, type: "SAVED" });
        } else if (
            view.itemName === EItemName.AFFILIATE_NETWORK
            || view.itemName === EItemName.LANDING_PAGE
            || view.itemName === EItemName.OFFER
            || view.itemName === EItemName.TRAFFIC_SOURCE
        ) {
            setActionMenu({ itemName: view.itemName });
        } else {
            setActionMenu({ itemName: EItemName.CAMPAIGN });
        }
    }

    function handleEditItem() {
        // TODO: ...
        console.log("Edit button clicked");
    }

    return (
        <div
            className="flex flex-col justify-center align-start gap-6 w-full px-8 py-6 bg-[#ebedef]"
            style={{ borderTop: "solid lightgrey 3px" }}
        >
            <LowerCPRow>
                <CalendarButton
                    timeframe={view.timeframe}
                    onChange={timeframe => queryRouter.push(
                        window.location.href,
                        { timeframe: timeframeQueryParam(timeframe) },
                        true
                    )}
                />
                <RefreshButton />
                {view.type === "main" &&
                    <>
                        <ReportButton
                            onClick={onNewReport}
                            disabled={selectedRows.length < 1}
                        />
                        {selectedRows.length > 0 && isPrimary(view.itemName)
                            ? <Button
                                text={`Edit ${view.itemName}`}
                                icon={faPencil}
                                onClick={handleEditItem}
                            />
                            : <Button
                                text={`Create New ${isPrimary(view.itemName) ? view.itemName : EItemName.CAMPAIGN}`}
                                icon={faPlus}
                                onClick={handleCreateNewItem}
                            />
                        }
                    </>
                }
            </LowerCPRow>
            <LowerCPRow>
                {view.type === "report" &&
                    <ReportChain
                        reportChain={view.reportChain}
                        onChange={reportChain => updateViewReportChainById(view.id, reportChain)}
                        omissions={reportItemName ? [view.itemName, reportItemName] : [view.itemName]}
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

function timeframeQueryParam(timeframe: [Date, Date]): string {
    return timeframe.map(date => date.getTime()).join(",");
}

function isPrimary(itemName: EItemName): boolean {
    return itemName === EItemName.AFFILIATE_NETWORK
        || itemName === EItemName.CAMPAIGN
        || itemName === EItemName.FLOW
        || itemName === EItemName.LANDING_PAGE
        || itemName === EItemName.OFFER
        || itemName === EItemName.TRAFFIC_SOURCE;
}
