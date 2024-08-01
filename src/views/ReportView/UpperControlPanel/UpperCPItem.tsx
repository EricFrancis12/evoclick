"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { itemNameToIcon } from "../Report";
import { TView } from "@/lib/store";
import { EItemName } from "@/lib/types";

export default function UpperCPItem({ view, itemName, onClick = () => { } }: {
    view: TView;
    itemName: EItemName;
    onClick?: (item: EItemName) => void;
}) {
    const isActive = view.itemName === itemName;

    function handleClick(e: React.MouseEvent<HTMLDivElement>, itemName: EItemName) {
        e.stopPropagation();
        onClick(itemName);
    }

    return (
        <div
            className={(isActive ? "text-white bg-[#1f76c6]" : "text-black bg-transparent")
                + " relative flex flex-nowrap items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#1f76c6] hover:text-white"}
            style={{ whiteSpace: "nowrap" }}
            onClick={e => handleClick(e, itemName)}
        >
            <FontAwesomeIcon icon={itemNameToIcon(itemName)} className="mr-[4px]" />
            <span className="mr-[4px]">
                {itemName}
            </span>
        </div>
    )
}
