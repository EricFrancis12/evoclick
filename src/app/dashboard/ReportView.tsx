"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconDefinition, faBullseye, faChevronDown, faChevronUp, faFolder, faGlobe, faGlobeEurope, faHandshake,
    faLaptop, faMobile, faRandom, faSitemap, faSyncAlt, faUsers, faWifi
} from "@fortawesome/free-solid-svg-icons";
import useDragger from "@/hooks/useDragger";
import useHover from "@/hooks/useHover";
import useQueryRouter from "@/hooks/useQueryRouter";
import Tab, { TTab, newReportTab } from "@/components/Tab";
import Button from "@/components/Button";
import CalendarButton from "@/components/CalendarButton";
import DropdownButton, { DropdownItem } from "@/components/DropdownButton";
import { refreshAction } from "@/lib/actions";
import { useTabsStore } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";
import useActiveTab from "@/hooks/useActiveTab";

export default function ReportView({ clicks, page, size, timeframe, reportItemName }: {
    clicks: TClick[];
    page: number;
    size: number;
    timeframe: [Date, Date];
    reportItemName: EItemName | null;
}) {
    const {
        mainTab, reportTabs, updateTabPageById, updateTabSizeById,
        updateTabTimeframeById, updateTabReportItemNameById, updateTabItemNameById, removeReportTabById
    } = useTabsStore(store => store);

    const activeTab = useActiveTab();
    useEffect(() => {
        if (activeTab?.id) {
            updateTabPageById(activeTab.id, page);
            updateTabSizeById(activeTab.id, size);
            updateTabTimeframeById(activeTab.id, timeframe);
            if (reportItemName) updateTabReportItemNameById(activeTab.id, reportItemName);
        }
    }, [page, size, timeframe, reportItemName]);

    const params = useParams();
    const queryRouter = useQueryRouter();

    function handleTabClose(tab: TTab) {
        removeReportTabById(tab.id);
        // If the deleted tab was the current one, redirect to /dashboard
        if (tab.id === params?.tabId) {
            queryRouter.push("/dashboard");
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
                    onClick={() => queryRouter.push("/dashboard")}
                />
                {reportTabs.map(tab => (
                    <Tab
                        key={tab.id}
                        tab={tab}
                        onClick={tab => queryRouter.push(`/dashboard/report/${tab.itemName}/${tab.id}`)}
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
                            onClick={item => updateTabItemNameById(activeTab.id, item.itemName)}
                        />
                        <LowerControlPanel tab={activeTab} />
                        <DataTable
                            clicks={clicks}
                            itemName={activeTab.itemName}
                        />
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
    const { makeNewReportTab, updateTabReportChainById } = useTabsStore(store => store);
    const queryRouter = useQueryRouter();

    function handleClick() {
        const id = "REPLACE"; // TODO: Pull id from the first data table row that is selected
        const _tab = newReportTab(EItemName.CAMPAIGN, faBullseye, tab.itemName, id);
        makeNewReportTab(_tab);
        queryRouter.push(`/dashboard/report/${tab.itemName}/${_tab.id}`);
    }

    return (
        <div
            className="flex flex-col justify-center align-start gap-6 w-full px-8 py-6 bg-[#ebedef]"
            style={{ borderTop: "solid lightgrey 3px" }}
        >
            <LowerCPRow>
                <CalendarButton
                    timeframe={tab.timeframe}
                    onChange={timeframe => queryRouter.push(`/dashboard/report/${tab.itemName}/${tab.id}`)}
                />
                <RefreshButton />
                {tab.type === "main" && <ReportButton onClick={handleClick} />}
            </LowerCPRow>
            <LowerCPRow>
                {tab.type === "report" &&
                    <ReportChain
                        reportChain={tab.reportChain}
                        onChange={reportChain => updateTabReportChainById(tab.id, reportChain)}
                    />
                }
            </LowerCPRow>
        </div>
    )
}

function LowerCPRow({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex gap-6 w-full">
            <div className="flex flex-wrap gap-2 justify-center items-center">
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
            text="Report"
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
            text="Refresh"
        />
    )
}

export type TReportChain = [TReportChainLink, TReportChainLink, TReportChainLink];
export type TReportChainLink = null | {
    itemName?: EItemName;
};

const MAX_REPORT_CHAIN_LENGTH = 3;

function ReportChain({ reportChain, onChange }: {
    reportChain: TReportChain;
    onChange: (reportChain: TReportChain) => any;
}) {
    const { updateTabItemNameById } = useTabsStore(store => store);
    const activeTab = useActiveTab();
    const dropdownItems = Object.values(EItemName);

    const [dropdownsActive, setDropdownsActive] = useState<[boolean, boolean, boolean]>([false, false, false]);

    useEffect(() => {
        if (!activeTab?.itemName) return;
        handleClick({ itemName: activeTab.itemName }, 0);
    }, [activeTab?.itemName]);

    function handleClick(chainlink: TReportChainLink, index: number) {
        if (!chainlink) return;
        if (index === 0 && activeTab?.id && chainlink?.itemName) {
            updateTabItemNameById(activeTab.id, chainlink.itemName);
        }
        setDropdownsActive([false, false, false]);

        const newReportChain = [...reportChain]
            .splice(
                index,
                MAX_REPORT_CHAIN_LENGTH,
                { ...chainlink },
                {},
                ...arrayOf(null, MAX_REPORT_CHAIN_LENGTH)
            )
            .slice(0, MAX_REPORT_CHAIN_LENGTH) as TReportChain;
        onChange(newReportChain);
    }

    function handleSetActive(active: boolean, index: number) {
        setDropdownsActive(prevDropdownsActive => {
            const newDropdownsActive = [...prevDropdownsActive];
            newDropdownsActive.splice(index, 1, active);

            return newDropdownsActive as [boolean, boolean, boolean];
        });
    }

    return (
        <div className="flex flex-wrap justify-center items-center">
            {reportChain.map((chainLink, index) => (
                <div key={index} className="p-1">
                    <DropdownButton
                        text={!chainLink?.itemName ? "" : ((index === 0 ? activeTab?.itemName : chainLink?.itemName) || "None")}
                        disabled={!chainLink}
                        active={dropdownsActive[index] !== false}
                        setActive={(active: boolean) => handleSetActive(active, index)}
                    >
                        {index !== 0 &&
                            <DropdownItem text={"None"}
                                onClick={() => handleClick({}, index)}
                            />
                        }
                        {dropdownItems.map((itemName, _index) => {
                            const isPrevChainLink = reportChain.find(chainLink => chainLink?.itemName === itemName) != undefined;
                            return (
                                <Fragment key={_index}>
                                    {!isPrevChainLink &&
                                        <DropdownItem
                                            key={_index}
                                            text={itemName}
                                            onClick={() => handleClick({ itemName }, index)}
                                        />
                                    }
                                </Fragment>
                            )
                        })}
                    </DropdownButton>
                </div>
            ))
            }
        </div>
    )
}

export function arrayOf<T>(any: T, length: number = 1): T[] {
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(structuredClone(any));
    }
    return result;
}

function DataTable({ clicks, itemName }: {
    clicks: TClick[];
    itemName: EItemName;
}) {
    const rows = makeRows(clicks, itemName);
    const [columns, setColumns] = useState<TColumn[]>(initialColumns);

    console.log(clicks);
    console.log(rows);

    return (
        <div className="relative flex flex-col min-h-[400px] max-w-[100vw] overflow-x-scroll">
            <div className="absolute top-0 left-0 h-full">
                <TitleRow name={itemName} columns={columns} setColumns={setColumns} />
                {Object.entries(rows).map(([name, clicks]) => (
                    <Row key={name} name={name} clicks={clicks} columns={columns} />
                ))}
            </div>
        </div>
    )
}

type TColumn = {
    title: string;
    width: string;
};

const columnTitles = [
    "Name",
    "Visits",
    "Clicks",
    "Conversions",
    "Revenue",
    "Cost",
    "Profit",
    "CPV",
    "CPC",
    "CPCV",
    "CTR",
    "CVR",
    "ROI",
    "EPV",
    "EPC",
];

const initialColumns = columnTitles.map((title, i) => ({ title, width: i === 0 ? '300px' : '100px' }));

function TitleRow({ name, columns, setColumns }: {
    name: string;
    columns: TColumn[];
    setColumns: (cols: TColumn[]) => any;
}) {
    const mouseDownClientX = useRef<number>(0);

    const startDrag = useDragger((e, i) => {
        if (typeof i === "number") {
            const newWidth = `${parseFloat(columns[i].width) + e.clientX - mouseDownClientX.current}px`;
            setColumns(columns.map((col, index) => index === i ? { ...col, width: newWidth } : col));
        }
    });

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>, i: number) {
        mouseDownClientX.current = e.clientX;
        startDrag(e, i);
    }

    return (
        <RowWrapper>
            {columns.map(({ title, width }, index) => (
                <Fragment key={index}>
                    <Cell value={index === 0 ? name : title} width={width} />
                    <div className="relative h-auto w-[0px]">
                        <div
                            className="absolute top-0 left-0 h-full w-[1px] bg-blue-500 cursor-e-resize"
                            onMouseDown={e => handleMouseDown(e, index)}
                        />
                    </div>
                </Fragment>
            ))}
        </RowWrapper>
    )
}

type RowsHashMap = Record<string, TClick[]>

function Row({ name, clicks, columns }: {
    name: keyof RowsHashMap;
    clicks: TClick[];
    columns: TColumn[];
}) {
    const cells = makeCells(clicks, name);

    return (
        <RowWrapper>
            {cells.map((value, index) => (
                <Cell key={index} value={value} width={columns[index].width} />
            ))}
        </RowWrapper>
    )
}

function Cell({ value, width }: {
    value: string | number;
    width: string;
}) {
    return (
        <div className="px-1" style={{ width }}>
            {value}
        </div>
    )
}

function RowWrapper({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full px-4">
            {children}
        </div>
    )
}

function makeRows(clicks: TClick[], itemName: EItemName) {
    return clicks.reduce((acc: RowsHashMap, curr: TClick) => {
        const clickProp = itemNameToClickProp(itemName);
        const key = clickProp ? curr[clickProp] : null;
        if (key && (typeof key === "string" || typeof key === "number")) {
            const keyStr = key.toString();
            if (acc[keyStr]) {
                acc[keyStr].push(curr);
            } else {
                acc[keyStr] = [curr];
            }
        }
        return acc;
    }, {});
}

function makeCells(clicks: TClick[], name: string): (string | number)[] {
    const numVisits = clicks.length;
    const numClicks = clicks.filter(click => !!click.clickTime).length;
    const numConversions = clicks.filter(click => !!click.convTime).length;
    const revenue = clicks.reduce((total, click) => total + click.revenue, 0);
    const cost = clicks.reduce((total, click) => total + click.cost, 0);
    const profit = revenue - cost;
    const cpv = (cost / numVisits) || 0;
    const cpc = (cost / numClicks) || 0;
    const cpcv = (cost / numConversions) || 0;
    const ctr = (numClicks / numVisits) || 0;
    const cvr = (numConversions / numVisits) || 0;
    const roi = ((revenue - cost) / cost) || 0;
    const epv = (revenue / numVisits) || 0;
    const epc = (revenue / numClicks) || 0;

    return [
        name,
        numVisits,
        numClicks,
        numConversions,
        revenue,
        cost,
        profit,
        cpv,              // cost per visit
        cpc,              // cost per click
        cpcv,             // cost per conversion
        ctr,              // clickthrough rate
        cvr,              // conversion rate
        roi,              // return on investment
        epv,              // earnings per visit
        epc,              // earnings per click    
    ];
}

function itemNameToClickProp(itemName: EItemName): keyof TClick | undefined {
    return hashMap[itemName];
}

const hashMap: Record<EItemName, keyof TClick> = {
    [EItemName.AFFILIATE_NETWORK]: "affiliateNetworkId",
    [EItemName.CAMPAIGN]: "campaignId",
    [EItemName.FLOW]: "flowId",
    [EItemName.LANDING_PAGE]: "landingPageId",
    [EItemName.OFFER]: "offerId",
    [EItemName.TRAFFIC_SOURCE]: "trafficSourceId",
    [EItemName.IP]: "ip",
    [EItemName.ISP]: "isp",
    [EItemName.USER_AGENT]: "userAgent",
    [EItemName.LANGUAGE]: "language",
    [EItemName.COUNTRY]: "country",
    [EItemName.REGION]: "region",
    [EItemName.CITY]: "city",
    [EItemName.DEVICE_TYPE]: "deviceType",
    [EItemName.DEVICE]: "device",
    [EItemName.SCREEN_RESOLUTION]: "screenResolution",
    [EItemName.OS]: "os",
    [EItemName.OS_VERSION]: "osVersion",
    [EItemName.BROWSER_NAME]: "browserName",
    [EItemName.BROWSER_VERSION]: "browserVersion",
};
