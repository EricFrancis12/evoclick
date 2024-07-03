"use client";

import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { TView } from "@/lib/store";

export default function Tab({ view, onClick, onClose }: {
    view: TView;
    onClick: (view: TView) => any;
    onClose?: (view: TView) => any;
}) {
    const { type, reportItemName, icon } = view;
    const isActive = useIsTabActive(view);

    function handleClose(e: React.MouseEvent<HTMLOrSVGElement>) {
        e.stopPropagation();
        if (onClose) onClose(view);
    }

    return (
        <div className="flex items-end h-full mr-[8px]">
            <div
                onClick={() => onClick(view)}
                className={(isActive ? "bg-[#ffffff] " : "bg-[#c3ccd2] hover:bg-[#d0d9de] ")
                    + " group relative h-[32px] max-w-[245px] text-[#394146] text-sm text-ellipsis overflow-hidden cursor-pointer"}
                style={{
                    userSelect: "none",
                    padding: "6px 8px 6px 8px",
                    borderRadius: "6px 6px 0 0",
                    whiteSpace: "nowrap",
                }}
            >
                <FontAwesomeIcon icon={icon} className="mr-[8px]" />
                <span>{type === "main" ? "Dashboard" : reportItemName}</span>
                {onClose &&
                    <div className="absolute flex justify-end items-center top-0 left-0 h-full w-full">
                        <div className={(isActive ? "bg-[#ffffff] " : "bg-[#c3ccd2] group-hover:bg-[#d0d9de] ")}>
                            <FontAwesomeIcon
                                icon={faClose}
                                className="mr-2 cursor-pointer"
                                onClick={handleClose}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
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
