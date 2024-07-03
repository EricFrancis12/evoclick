"use client";

import { useRef } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import useActiveView from "@/hooks/useActiveView";
import useHover from "@/hooks/useHover";
import { TUpperCPItem } from "./UpperCPItem";

export type TUpperCPItemGroup = {
    name: string;
    icon: IconDefinition;
    children: TUpperCPItem[];
};

export default function UpperCPItemGroup({ itemGroup, onClick = () => { } }: {
    itemGroup: TUpperCPItemGroup;
    onClick?: (item: TUpperCPItem) => any;
}) {
    const ref = useRef(null);
    const [isHovered, setHover] = useHover(ref);

    const activeView = useActiveView()
    const isActive = useGroupIsActive(itemGroup);

    function handleClick(e: React.MouseEvent<HTMLDivElement>, item: TUpperCPItem) {
        e.stopPropagation();
        setHover(false);
        onClick(item);
    }

    return (
        <div className="flex bg-transparent">
            <div
                ref={ref}
                className={(isActive ? "text-white bg-[#1f76c6] " : "text-black bg-transparent ")
                    + "relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#1f76c6] hover:text-white"}
            >
                <FontAwesomeIcon icon={itemGroup.icon} className="mr-[4px]" />
                <span className="mr-[4px]">
                    {isActive ? activeView?.itemName : itemGroup.name}
                </span>
                <FontAwesomeIcon icon={isHovered ? faChevronUp : faChevronDown} />
                {isHovered &&
                    <div className="absolute top-[100%] bg-white text-black border border-black rounded-sm">
                        {itemGroup.children.map((item, index) => (
                            <div
                                key={index}
                                className="p-1 bg-white hover:bg-blue-300"
                                onClick={e => handleClick(e, item)}
                            >
                                <span style={{ whiteSpace: "nowrap" }}>
                                    {item.itemName}
                                </span>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

function useGroupIsActive(group: TUpperCPItemGroup): boolean {
    const activeView = useActiveView()
    if (!activeView) return false;
    for (const item of group.children) {
        if (item.itemName === activeView.itemName) return true;
    }
    return false;
}
