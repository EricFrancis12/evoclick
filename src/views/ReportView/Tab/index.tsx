"use client";

import { useParams } from "next/navigation";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { TView } from "@/lib/store";
import TabContainer from "./TabContainer";
import { getPrimaryItemById, isPrimary } from "@/lib/utils";
import { useDataContext } from "@/contexts/DataContext";
import { EItemName, TPrimaryData } from "@/lib/types";

export default function Tab({ view, onClick, onClose }: {
    view: TView;
    onClick: (view: TView) => void;
    onClose?: (view: TView) => void;
}) {
    const { type, reportItemName, icon } = view;
    const isActive = useIsTabActive(view);

    const { primaryData } = useDataContext();
    const tabName = useReportTabName(primaryData, reportItemName, view.id);

    function handleClose(e: React.MouseEvent<HTMLOrSVGElement>) {
        e.stopPropagation();
        if (onClose) onClose(view);
    }

    return (
        <TabContainer>
            <div
                onClick={() => onClick(view)}
                className={(isActive ? "bg-[#ffffff] " : "bg-[#c3ccd2] hover:bg-[#d0d9de] ")
                    + " flex gap-2 items-center h-[32px] text-[#394146] text-sm text-ellipsis overflow-hidden cursor-pointer"}
                style={{
                    userSelect: "none",
                    padding: "6px 8px 6px 8px",
                    borderRadius: "6px 6px 0 0",
                    whiteSpace: "nowrap",
                }}
            >
                <FontAwesomeIcon icon={icon} />
                <span>{type === "main" ? "Dashboard" : `${reportItemName}${tabName ? ": " + tabName : ""}`}</span>
                {onClose &&
                    <FontAwesomeIcon
                        icon={faClose}
                        className="cursor-pointer hover:opacity-70"
                        onClick={handleClose}
                    />
                }
            </div>
        </TabContainer>
    )
}

function useReportTabName(primaryData: TPrimaryData, reportItemName: EItemName | null, reportItemId: string): string {
    if (!reportItemName || !reportItemId) return "";

    const { primaryItemName } = isPrimary(reportItemName);
    if (!primaryItemName) return reportItemId;

    const id = parseInt(reportItemId);
    if (!id) return "";

    return getPrimaryItemById(primaryData, primaryItemName, id)?.name || "";
}

export function useIsTabActive(view: TView): boolean {
    const params = useParams();
    if (isActiveMainTab(view, params)) return true;
    if (isActiveReportTab(view, params)) return true;
    return false;
}

export function isActiveMainTab(view: TView, params: Params): boolean {
    return view.type === "main" && !params.id;
}

export function isActiveReportTab(view: TView, params: Params): boolean {
    return view.type === "report"
        && typeof params.id === "string"
        && typeof params.itemName === "string"
        && decodeURIComponent(params.id) === view.id
        && decodeURIComponent(params.itemName) === view.reportItemName;
}
