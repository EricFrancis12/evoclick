"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import useActiveView from "@/hooks/useActiveView";
import { EItemName } from "@/lib/types";
import { itemNameToIcon } from "../Report";

export default function UpperCPItem({ itemName, onClick = () => { } }: {
    itemName: EItemName;
    onClick?: (item: EItemName) => void;
}) {
    const activeView = useActiveView();
    const isActive = activeView?.itemName === itemName;

    function handleClick(e: React.MouseEvent<HTMLDivElement>, itemName: EItemName) {
        e.stopPropagation();
        onClick(itemName);
    }

    return (
        <div className="flex bg-transparent">
            <div
                className={(isActive ? "text-white bg-[#1f76c6] " : "text-black bg-transparent ")
                    + "relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#1f76c6] hover:text-white"}
                onClick={e => handleClick(e, itemName)}
            >
                <FontAwesomeIcon icon={itemNameToIcon(itemName)} className="mr-[4px]" />
                <span className="mr-[4px]">
                    {itemName}
                </span>
            </div>
        </div>
    )
}
