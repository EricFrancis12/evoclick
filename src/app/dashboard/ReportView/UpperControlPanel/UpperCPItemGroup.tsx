"use client";

import { useRef } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import useActiveView from "@/hooks/useActiveView";
import useHover from "@/hooks/useHover";
import { BASE_Z_INDEX } from "../DataTable";
import { EItemName } from "@/lib/types";

export type TUpperCPItemGroup = {
    name: string;
    icon: IconDefinition;
    children: EItemName[];
};

export default function UpperCPItemGroup({ itemGroup, onClick = () => { }, reportItemName }: {
    itemGroup: TUpperCPItemGroup;
    onClick?: (itemName: EItemName) => void;
    reportItemName?: EItemName;
}) {
    const ref = useRef(null);
    const [isHovered, setHover] = useHover(ref);

    const activeView = useActiveView()
    const isActive = useGroupIsActive(itemGroup);

    const zIndexAboveDataTable = BASE_Z_INDEX + 1; // Ensures dropdowns appear over top of the data table

    function handleClick(e: React.MouseEvent<HTMLDivElement>, itemName: EItemName) {
        e.stopPropagation();
        setHover(false);
        onClick(itemName);
    }

    return (
        <div
            ref={ref}
            className={(isActive ? "text-white bg-[#1f76c6]" : "text-black bg-transparent")
                + " relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#1f76c6] hover:text-white"}
            style={{ whiteSpace: "nowrap" }}
        >
            <FontAwesomeIcon icon={itemGroup.icon} className="mr-[4px]" />
            <span className="mr-[4px]">
                {isActive && activeView?.itemName ? activeView.itemName : itemGroup.name}
            </span>
            <FontAwesomeIcon icon={isHovered ? faChevronUp : faChevronDown} />
            {isHovered &&
                <div
                    className="absolute top-[100%] bg-white text-black border border-black rounded-sm"
                    style={{ zIndex: zIndexAboveDataTable }}
                >
                    {itemGroup.children
                        .filter(itemName => itemName !== reportItemName)
                        .map((itemName, index) => (
                            <div
                                key={index}
                                className="p-1 bg-white hover:bg-blue-300"
                                onClick={e => handleClick(e, itemName)}
                            >
                                <span style={{ whiteSpace: "nowrap" }}>
                                    {itemName}
                                </span>
                            </div>
                        ))}
                </div>
            }
        </div>
    )
}

function useGroupIsActive(group: TUpperCPItemGroup): boolean {
    const activeView = useActiveView()
    if (!activeView) return false;
    for (const itemName of group.children) {
        if (itemName === activeView.itemName) return true;
    }
    return false;
}
