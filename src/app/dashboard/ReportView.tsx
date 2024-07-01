"use client";

import { useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconDefinition, faBullseye, faChevronDown, faChevronUp, faFolder, faGlobe, faGlobeEurope, faHandshake,
    faLaptop, faMobile, faRandom, faSitemap, faSyncAlt, faUsers, faWifi
} from "@fortawesome/free-solid-svg-icons";
import useHover from "@/hooks/useHover";
import useQueryRouter from "@/hooks/useQueryRouter";
import Tab, { TTab, newTab } from "@/components/Tab";
import Button from "@/components/Button";
import CalendarButton from "@/components/CalendarButton";
import { refreshAction } from "@/lib/actions";
import { useTabsStore } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";
import useActiveTab from "@/hooks/useActiveTab";

export default function ReportView({ clicks, page, size }: {
    clicks: TClick[];
    page: number;
    size: number;
}) {
    const { mainTab, reportTabs, updateTabById, removeReportTabById } = useTabsStore(store => store);
    const activeTab = useActiveTab();
    const params = useParams();
    const queryRouter = useQueryRouter();

    function handleTabClose(tab: TTab) {
        removeReportTabById(tab.id);
        // If the deleted tab was the current one, redirect to /dashboard
        if (tab.id === params?.tabId) {
            queryRouter.push("/dashboard", {}, true)
        }
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
                <Tab
                    tab={mainTab}
                    onClick={() => queryRouter.push("/dashboard", {}, true)}
                />
                {reportTabs.map(tab => (
                    <Tab
                        key={tab.id}
                        tab={tab}
                        onClick={tab => queryRouter.push(`/dashboard/report/${tab.id}`, {}, true)}
                        onClose={handleTabClose}
                    />
                ))}
            </div>
            <div className="width-[100vw] text-sm">
                {activeTab
                    ? <>
                        <UpperControlPanel
                            items={upperCPItems}
                            groups={upperCPItemGroups}
                            onClick={item => updateTabById(activeTab.id, { itemName: item.itemName })}
                        />
                        <LowerControlPanel tab={activeTab} />
                        <DataTable />
                    </>
                    : "Report Not Found :("
                }
            </div>
        </div >
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

function UpperControlPanel({ items, groups, onClick = () => { } }: {
    items: TUpperCPItem[];
    groups: TUpperCPItemGroup[];
    onClick?: (item: TUpperCPItem) => any;
}) {
    return (
        <div className="flex flex-col justify-center gap-6 w-full px-8 py-6 bg-[#ffffff]">
            <div className="flex flex-wrap gap-6 w-full">
                {items.map((item, _index) => (
                    <UpperCPItem
                        key={_index}
                        item={item}
                        onClick={onClick}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-6 w-full">
                {groups.map((group, index) => (
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

function UpperCPItem({ item, onClick = () => { } }: {
    item: TUpperCPItem;
    onClick?: (item: TUpperCPItem) => any;
}) {
    const activeTab = useActiveTab()
    const isActive = activeTab?.itemName === item.itemName;

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
    const activeTab = useActiveTab()
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
                    {isActive ? activeTab?.itemName : itemGroup.name}
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
    const activeTab = useActiveTab()
    if (!activeTab) return false;
    for (const item of group.children) {
        if (item.itemName === activeTab.itemName) return true;
    }
    return false;
}

function LowerControlPanel({ tab }: {
    tab: TTab;
}) {
    const { makeNewReportTab, updateTabById } = useTabsStore(store => store);
    const queryRouter = useQueryRouter();

    function handleClick() {
        const _tab = newTab(EItemName.LANDING_PAGE, "report", faBullseye);
        makeNewReportTab(_tab);
        queryRouter.push(`/dashboard/report/${_tab.id}`, {}, true);
    }

    return (
        <div
            className='flex flex-col justify-center align-start gap-6 w-full px-8 py-6 bg-[#ebedef]'
            style={{ borderTop: 'solid lightgrey 3px' }}
        >
            <Row>
                <CalendarButton timeframe={tab.timeframe} onChange={timeframe => updateTabById(tab.id, { timeframe })} />
                <RefreshButton />
                {tab.type === "main" && <ReportButton onClick={handleClick} />}
            </Row>
            <Row>
                {tab.type === "report" && <ReportChain />}
            </Row>
        </div>
    )
}

function Row({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className='flex gap-6 w-full'>
            <div className='flex flex-wrap gap-2 justify-center items-center'>
                {children}
            </div>
        </div>
    )
}

function ReportButton({ onClick, disabled = false }: {
    onClick: React.MouseEventHandler<HTMLDivElement>;
    disabled?: boolean;
}) {
    return (
        <Button
            icon={faRandom}
            onClick={onClick}
            disabled={disabled}
            text='Report'
        />
    )
}

function RefreshButton({ disabled = false }: {
    disabled?: boolean;
}) {
    return (
        <Button
            icon={faSyncAlt}
            onClick={() => refreshAction(window.location.href)}
            disabled={disabled}
            text='Refresh'
        />
    )
}

function ReportChain() {
    return (
        <div>Report Chain</div>
    )
}

function DataTable() {
    return (
        <div>Data Table</div>
    )
}
