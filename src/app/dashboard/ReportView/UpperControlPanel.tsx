"use client";

import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconDefinition, faBullseye, faChevronDown, faChevronUp, faFolder, faGlobe, faGlobeEurope, faHandshake,
    faLaptop, faMobile, faSitemap, faUsers, faWifi
} from "@fortawesome/free-solid-svg-icons";
import useActiveView from "@/hooks/useActiveView";
import useHover from "@/hooks/useHover";
import { EItemName } from "@/lib/types";

export default function UpperControlPanel({ onClick = () => { } }: {
    onClick?: (item: TUpperCPItem) => any;
}) {
    return (
        <div className="flex flex-col justify-center gap-6 w-full px-8 py-6 bg-[#ffffff]">
            <div className="flex flex-wrap gap-6 w-full">
                {upperCPItems.map((item, _index) => (
                    <UpperCPItem
                        key={_index}
                        item={item}
                        onClick={onClick}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-6 w-full">
                {upperCPItemGroups.map((group, index) => (
                    <UpperCPItemGroup
                        key={index}
                        itemGroup={group}
                        onClick={onClick}
                    />
                ))}
            </div>
        </div>
    )
}

type TUpperCPItem = {
    itemName: EItemName;
    icon: IconDefinition;
};

type TUpperCPItemGroup = {
    name: string;
    icon: IconDefinition;
    children: TUpperCPItem[];
};

const upperCPItems: TUpperCPItem[] = [
    { itemName: EItemName.CAMPAIGN, icon: faBullseye },
    { itemName: EItemName.OFFER, icon: faHandshake },
    { itemName: EItemName.LANDING_PAGE, icon: faFolder },
    { itemName: EItemName.FLOW, icon: faSitemap },
    { itemName: EItemName.TRAFFIC_SOURCE, icon: faGlobe },
    { itemName: EItemName.AFFILIATE_NETWORK, icon: faUsers },
];

const upperCPItemGroups: TUpperCPItemGroup[] = [
    {
        name: EItemName.COUNTRY, icon: faGlobeEurope, children: [
            { itemName: EItemName.COUNTRY, icon: faGlobeEurope },
            { itemName: EItemName.REGION, icon: faGlobeEurope },
            { itemName: EItemName.CITY, icon: faGlobeEurope },
            { itemName: EItemName.LANGUAGE, icon: faGlobeEurope },
        ],
    },
    {
        name: EItemName.ISP, icon: faWifi, children: [
            { itemName: EItemName.ISP, icon: faWifi },
            { itemName: EItemName.IP, icon: faWifi },
            { itemName: EItemName.USER_AGENT, icon: faWifi },
        ],
    },
    {
        name: EItemName.DEVICE, icon: faLaptop, children: [
            { itemName: EItemName.DEVICE, icon: faLaptop },
            { itemName: EItemName.DEVICE_TYPE, icon: faLaptop },
            { itemName: EItemName.SCREEN_RESOLUTION, icon: faLaptop },
        ],
    },
    {
        name: EItemName.OS, icon: faMobile, children: [
            { itemName: EItemName.OS, icon: faMobile },
            { itemName: EItemName.OS_VERSION, icon: faMobile },
        ],
    },
    {
        name: EItemName.BROWSER_NAME, icon: faFolder, children: [
            { itemName: EItemName.BROWSER_NAME, icon: faFolder },
            { itemName: EItemName.BROWSER_VERSION, icon: faFolder },
        ],
    },
];

function UpperCPItem({ item, onClick = () => { } }: {
    item: TUpperCPItem;
    onClick?: (item: TUpperCPItem) => any;
}) {
    const activeView = useActiveView()
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

function UpperCPItemGroup({ itemGroup, onClick = () => { } }: {
    itemGroup: TUpperCPItemGroup;
    onClick?: (item: TUpperCPItem) => any;
}) {
    const ref = useRef(null);
    const [isHovered, setHover] = useHover(ref);
    const activeView = useActiveView()
    const isActive = useIsActive(itemGroup);

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

function useIsActive(group: TUpperCPItemGroup): boolean {
    const activeView = useActiveView()
    if (!activeView) return false;
    for (const item of group.children) {
        if (item.itemName === activeView.itemName) return true;
    }
    return false;
}
