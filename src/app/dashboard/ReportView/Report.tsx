"use client";

import { useState, useEffect } from "react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import useQueryRouter from "@/hooks/useQueryRouter";
import UpperControlPanel from "./UpperControlPanel";
import LowerControlPanel from "./LowerControlPanel";
import DataTable, { TRow } from "./DataTable";
import { TView, useViewsStore, newReportView } from "@/lib/store";
import { EItemName, TClick, } from "@/lib/types";
import { TPrimaryData, useReportView } from "./ReportViewContext";

export default function Report({ view, reportItemName }: {
    view: TView;
    reportItemName?: EItemName;
}) {
    const { id, itemName } = view;
    const { clicks } = useReportView();
    const [rows, setRows] = useRows(clicks, itemName);

    useEffect(() => {
        setRows(prev => prev.map(row => ({ ...row, selected: false })));
    }, [view.reportChain?.[0]]);

    const { reportViews, addReportView, updateViewItemNameById } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    // Finds the first row that is selected and creates a report for it
    function handleNewReport() {
        const selectedRows = rows.filter(row => row.selected === true);
        if (selectedRows.length < 1) return;
        const newViewItemName = itemName !== EItemName.CAMPAIGN ? EItemName.CAMPAIGN : EItemName.OFFER;
        const newView = newReportView(newViewItemName, faBullseye, itemName, selectedRows[0].name);
        if (!reportViews.some(v => v.itemName === newView.itemName && v.id === newView.id)) {
            addReportView(newView);
        }
        if (newView.reportItemName) {
            queryRouter.push(`/dashboard/report/${encodeURIComponent(newView.reportItemName)}/${encodeURIComponent(newView.id)}`);
        }
    }

    return (
        <>
            <UpperControlPanel
                onClick={item => updateViewItemNameById(id, item.itemName)}
                reportItemName={reportItemName}
            />
            <LowerControlPanel
                view={view}
                onNewReport={handleNewReport}
                reportItemName={reportItemName}
                rows={rows}
            />
            <DataTable
                view={view}
                rows={rows}
                setRows={setRows}
            />
        </>
    )
}

export function useRows(clicks: TClick[], itemName: EItemName) {
    const { primaryData } = useReportView();

    const enrichWith = itemNameInPrimaryData(itemName, primaryData)?.map(d => d.id.toString());
    const [rows, setRows] = useState<TRow[]>([]);

    useEffect(() => {
        setRows(makeRows(clicks, itemName, enrichWith));
    }, [clicks.length, itemName]);

    const value: [TRow[], React.Dispatch<React.SetStateAction<TRow[]>>] = [rows, setRows];
    return value;
}

function makeRows(clicks: TClick[], itemName: EItemName, enrichWith?: string[]): TRow[] {
    const rows = clicks.reduce((rows: TRow[], click: TClick) => {
        const clickProp = itemNameToClickProp(itemName);
        const key = clickProp ? click[clickProp] : null;
        if (key && (typeof key === "string" || typeof key === "number")) {
            const name = key.toString();

            const i = rows.findIndex(row => row.name === name);
            if (i !== -1) {
                rows[i].clicks.push(click);
            } else {
                rows.push({
                    name,
                    clicks: [click],
                    selected: false,
                });
            }
        }
        return rows;
    }, []);

    if (enrichWith) {
        for (const name of enrichWith) {
            if (rows.some(row => row.name === name)) continue;
            rows.push({
                clicks: [],
                name,
                selected: false,
            });
        }
    }

    return rows;
}

function itemNameInPrimaryData(itemName: EItemName, primaryData: TPrimaryData) {
    switch (itemName) {
        case EItemName.AFFILIATE_NETWORK:
            return primaryData.affiliateNetworks;
        case EItemName.CAMPAIGN:
            return primaryData.campaigns;
        case EItemName.FLOW:
            return primaryData.flows;
        case EItemName.LANDING_PAGE:
            return primaryData.landingPages;
        case EItemName.OFFER:
            return primaryData.offers;
        case EItemName.TRAFFIC_SOURCE:
            return primaryData.trafficSources;
        default:
            return undefined;
    }
}

function itemNameToClickProp(itemName: EItemName): keyof TClick | undefined {
    return clickPropsMap[itemName];
}

const clickPropsMap: Record<EItemName, keyof TClick> = {
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
