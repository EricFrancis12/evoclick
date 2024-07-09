"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import useActiveView from "@/hooks/useActiveView";
import { EItemName } from "@/lib/types";

export type TUpperCPItem = {
    itemName: EItemName;
    icon: IconDefinition;
};

export default function UpperCPItem({ item, onClick = () => { } }: {
    item: TUpperCPItem;
    onClick?: (item: TUpperCPItem) => void;
}) {
    const activeView = useActiveView();
    const isActive = activeView?.itemName === item.itemName;

    function handleClick(e: React.MouseEvent<HTMLDivElement>, item: TUpperCPItem) {
        e.stopPropagation();
        onClick(item);
    }

    return (
        <div className="flex bg-transparent">
            <div
                className={(isActive ? "text-white bg-[#1f76c6] " : "text-black bg-transparent ")
                    + "relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#1f76c6] hover:text-white"}
                onClick={e => handleClick(e, item)}
            >
                <FontAwesomeIcon icon={item.icon} className="mr-[4px]" />
                <span className="mr-[4px]">
                    {item.itemName}
                </span>
            </div>
        </div>
    )
}
