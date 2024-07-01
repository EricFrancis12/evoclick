'use client';

import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faClose } from "@fortawesome/free-solid-svg-icons";
import { EItemName } from "@/lib/types";

export type TTabType = "main" | "report";

export type TTab = {
    id: string;
    itemName: EItemName;
    type: TTabType;
    icon: IconDefinition;
    timeframe: [Date, Date];
};

export function newTab(itemName: EItemName, type: TTabType, icon: IconDefinition): TTab {
    return {
        id: crypto.randomUUID() as string,
        itemName,
        type,
        icon,
        timeframe: [new Date, new Date],
    };
}

export default function Tab({ tab, onClick, onClose }: {
    tab: TTab;
    onClick: (tab: TTab) => any;
    onClose?: (tab: TTab) => any;
}) {
    const { itemName, icon } = tab;
    const params = useParams();
    const active = params?.tabId === tab.id || (!params?.tabId && tab.type === "main");

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
