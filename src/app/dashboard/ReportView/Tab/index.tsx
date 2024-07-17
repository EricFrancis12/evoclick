"use client";

import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { TView } from "@/lib/store";
import TabContainer from "./TabContainer";

export default function Tab({ view, onClick, onClose }: {
    view: TView;
    onClick: (view: TView) => void;
    onClose?: (view: TView) => void;
}) {
    const { type, reportItemName, icon } = view;
    const isActive = useIsTabActive(view);

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
                <span>{type === "main" ? "Dashboard" : reportItemName}</span>
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
