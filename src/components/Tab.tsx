"use client";

import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faClose } from "@fortawesome/free-solid-svg-icons";
import { EItemName } from "@/lib/types";
import { TReportChain } from "@/app/dashboard/ReportView";

export type TTabType = "main" | "report";

export type TTab = {
    id: "0";
    itemName: EItemName;
    type: "main";
    icon: IconDefinition;
    timeframe: [Date, Date];
    reportItemName: null;
    page: number;
    size: number;
} | {
    id: string;
    itemName: EItemName;
    type: "report";
    icon: IconDefinition;
    timeframe: [Date, Date];
    reportItemName: EItemName;
    reportChain: TReportChain;
    page: number;
    size: number;
};

export function newMainTab(itemName: EItemName, icon: IconDefinition): TTab {
    return {
        id: "0",
        itemName,
        type: "main",
        icon,
        timeframe: [new Date, new Date],
        reportItemName: null,
        page: 1,
        size: 50,
    };
}

export function newReportTab(itemName: EItemName, icon: IconDefinition, reportItemName: EItemName, reportItemId: string): TTab {
    return {
        id: reportItemId,
        itemName,
        type: "report",
        icon,
        timeframe: [new Date, new Date],
        reportItemName,
        reportChain: [{}, null, null],
        page: 1,
        size: 50,
    };
}

export default function Tab({ tab, onClick, onClose }: {
    tab: TTab;
    onClick: (tab: TTab) => any;
    onClose?: (tab: TTab) => any;
}) {
    const { itemName, icon } = tab;
    const params = useParams();
    const active = params?.id === tab.id || (!params?.id && tab.type === "main");

    function handleClose(e: React.MouseEvent<HTMLOrSVGElement>) {
        e.stopPropagation();
        if (onClose) onClose(tab);
    }

    return (
        <div className="flex items-end h-full mr-[8px]">
            <div
                onClick={() => onClick(tab)}
                className={(active ? "bg-[#ffffff] " : "bg-[#c3ccd2] hover:bg-[#d0d9de] ")
                    + " group relative h-[32px] max-w-[245px] text-[#394146] text-sm text-ellipsis overflow-hidden cursor-pointer"}
                style={{
                    userSelect: "none",
                    padding: "6px 8px 6px 8px",
                    borderRadius: "6px 6px 0 0",
                    whiteSpace: "nowrap",
                }}
            >
                <FontAwesomeIcon icon={icon} className="mr-[8px]" />
                <span>{itemName}</span>
                {onClose &&
                    <div className="absolute flex justify-end items-center top-0 left-0 h-full w-full">
                        <div className={(active ? "bg-[#ffffff] " : "bg-[#c3ccd2] group-hover:bg-[#d0d9de] ")}>
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
