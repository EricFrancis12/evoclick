"use client";

import { useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconDefinition, faBullseye, faChevronDown, faChevronUp, faFolder, faGlobe, faGlobeEurope, faHandshake,
    faLaptop, faMobile, faSitemap, faTachometerAltFast, faUsers, faWifi
} from "@fortawesome/free-solid-svg-icons";
import useHover from "@/hooks/useHover";
import useQueryRouter from "@/hooks/useQueryRouter";
import Tab from "../components/Tab";
import { TClick } from "@/lib/types";

const tabs = [
    {
        name: "Dashboard",
        icon: faTachometerAltFast,
        active: true
    },
    {
        name: "Some Name",
        icon: faTachometerAltFast,
        active: false
    },
];

export default function Dashboard({ clicks, page, size }: {
    clicks: TClick[];
    page: number;
    size: number;
}) {
    const searchParams = useSearchParams();

    const item = searchParams.get("item") || "Campaigns";
    const order = searchParams.get("order") || "desc";
    const orderBy = searchParams.get("orderBy") || "id";

    console.log(clicks);
    console.log(page);
    console.log(size);
    console.log(item);
    console.log(order);
    console.log(orderBy);

    const queryRouter = useQueryRouter();

    function handleItemClick(item: TUpperControlPanelItem) {
        queryRouter.push(window.location.pathname, { item: item.name }, true);
    }

    return (
        <div className="h-screen w-full">
            <div className="flex h-[40px] w-[100vw] bg-[#2f918e]">
                <div className="flex justify-center items-center h-full">
                    <Image
                        src="/assets/images/logo-no-bg.png"
                        alt="Logo"
                        height={35}
                        width={35}
                        className="mx-6"
                    />
                </div>
                {tabs.map(tab => (
                    <Tab
                        key={tab.name}
                        {...tab}
                        onClick={() => console.log("Clicked")}
                    />
                ))}
            </div>
            <div className="width-[100vw] text-sm">
                <UpperControlPanel
                    row1={upperControlPanelRow1}
                    row2={upperControlPanelRow2}
                    onClick={handleItemClick}
                />
                {/* <LowerControlPanel /> */}
                {/* <DataTable /> */}
            </div>
        </div>
    )
}

type TUpperControlPanelItem = {
    name: string;
    icon: IconDefinition;
    children?: TUpperControlPanelItem[];
}

const upperControlPanelRow1: TUpperControlPanelItem[] = [
    { name: "Campaigns", icon: faBullseye },
    { name: "Offers", icon: faHandshake },
    { name: "Landing Pages", icon: faFolder },
    { name: "Flows", icon: faSitemap },
    { name: "Traffic Sources", icon: faGlobe },
    { name: "Affiliate Networks", icon: faUsers },
];

const upperControlPanelRow2: TUpperControlPanelItem[] = [
    {
        name: "Countries", icon: faGlobeEurope, children: [
            { name: "Countries", icon: faGlobeEurope },
            { name: "States / Regions", icon: faGlobeEurope },
            { name: "Cities", icon: faGlobeEurope },
            { name: "Languages", icon: faGlobeEurope },
        ],
    },
    {
        name: "ISP", icon: faWifi, children: [
            { name: "ISP", icon: faWifi },
            { name: "Mobile Carriers", icon: faWifi },
            { name: "Connection Types", icon: faWifi },
        ],
    },
    {
        name: "Device Types", icon: faLaptop, children: [
            { name: "Device Types", icon: faLaptop },
            { name: "Device Models", icon: faLaptop },
            { name: "Device Vendors", icon: faLaptop },
            { name: "Screen Resolutions", icon: faLaptop },
        ],
    },
    {
        name: "OS", icon: faMobile, children: [
            { name: "OS", icon: faMobile },
            { name: "OS Versions", icon: faMobile },
        ],
    },
    {
        name: "Browser Names", icon: faFolder, children: [
            { name: "Browser Names", icon: faFolder },
            { name: "Browser Versions", icon: faFolder },
        ],
    },
];

function UpperControlPanel({ row1, row2, onClick = () => { } }: {
    row1: TUpperControlPanelItem[];
    row2: TUpperControlPanelItem[];
    onClick?: (item: TUpperControlPanelItem) => any;
}) {
    return (
        <div className="flex flex-col justify-center gap-6 w-full px-8 py-6 bg-[#ffffff]">
            {[row1, row2].map((row, index) => (
                <div key={index} className="flex flex-wrap gap-6 w-full">
                    {row.map((item, _index) => (
                        <UpperControlPanelItem
                            key={_index}
                            item={item}
                            onClick={onClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

function UpperControlPanelItem({ item, onClick = () => { } }: {
    item: TUpperControlPanelItem;
    onClick?: (item: TUpperControlPanelItem) => any;
}) {
    const ref = useRef(null);
    const isHovered = useHover(ref);

    function handleClick(e: React.MouseEvent<HTMLDivElement>, item: TUpperControlPanelItem) {
        e.stopPropagation();
        onClick(item);
    }

    return (
        <div className="flex bg-transparent">
            <div
                ref={ref}
                className="relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#1f76c6] hover:text-white"
                onClick={e => handleClick(e, item)}
            >
                <FontAwesomeIcon icon={item.icon} className="mr-[4px]" />
                <span className="mr-[4px]">
                    {item.name}
                </span>
                {item.children &&
                    <>
                        <FontAwesomeIcon icon={isHovered ? faChevronUp : faChevronDown} />
                        {isHovered &&
                            <div className="absolute top-[100%] bg-white text-black border border-black rounded-sm">
                                {item.children.map((childItem, index) => (
                                    <div
                                        key={index}
                                        className="p-1 bg-white hover:bg-blue-300"
                                        onClick={e => handleClick(e, childItem)}
                                    >
                                        <span style={{ whiteSpace: "nowrap" }}>
                                            {childItem.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    )
}
