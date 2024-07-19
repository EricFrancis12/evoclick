"use client";

import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { TView } from "@/lib/store";
import TabContainer from "./TabContainer";
import { getPrimaryItemById, isPrimary, primaryItemNameToKeyOfPrimaryData } from "@/lib/utils";
import { useReportView } from "../ReportViewContext";

export default function Tab({ view, onClick, onClose, reportItemId }: {
    view: TView;
    onClick: (view: TView) => void;
    onClose?: (view: TView) => void;
    reportItemId?: number;
}) {
    const { type, reportItemName, icon } = view;
    const isActive = useIsTabActive(view);

    const { primaryData } = useReportView();

    const { primaryItemName } = reportItemName ? isPrimary(reportItemName) : { primaryItemName: null };
    const key = primaryItemName ? primaryItemNameToKeyOfPrimaryData(primaryItemName) : null;
    const result = primaryItemName && key && reportItemId ? getPrimaryItemById(primaryData, key, reportItemId) : null;
    const { name } = result || { name: "" };

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
                <span>{type === "main" ? "Dashboard" : `${reportItemName}${name ? ": " + name : ""}`}</span>
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

function useIsTabActive(view: TView): boolean {
    const params = useParams();

    const isActiveMainTab = view.type === "main" && !params.id;
    if (isActiveMainTab) return true;

    const isActiveReportTab = view.type === "report"
        && typeof params.id === "string"
        && decodeURIComponent(params.id) === view.id;
    if (isActiveReportTab) return true;

    return false;
}
