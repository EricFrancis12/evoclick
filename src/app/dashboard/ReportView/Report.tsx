"use client";

import { useState, useEffect } from "react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { TPrimaryData, useReportView } from "./ReportViewContext";
import useQueryRouter from "@/hooks/useQueryRouter";
import UpperControlPanel from "./UpperControlPanel";
import LowerControlPanel from "./LowerControlPanel";
import DataTable, { TRow } from "./DataTable";
import ReportSkeleton from "./ReportSkeleton";
import { TView, useViewsStore, newReportView } from "@/lib/store";
import { encodeTimeframe } from "@/lib/utils";
import { EItemName, TClick, } from "@/lib/types";

export default function Report({ view, reportItemName }: {
    view: TView;
    reportItemName?: EItemName;
}) {
    const { id, itemName } = view;
    const { clicks } = useReportView();
    const [rows, setRows] = useRows(clicks, itemName);

    const { reportViews, addReportView, updateViewItemNameById } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    // Finds the first row that is selected and creates a report for it
    function handleNewReport() {
        if (!rows) return;
        const selectedRows = rows.filter(row => row.selected);
        if (selectedRows.length < 1) return;
        const newViewItemName = itemName !== EItemName.CAMPAIGN ? EItemName.CAMPAIGN : EItemName.OFFER;
        const newView = newReportView(newViewItemName, faBullseye, itemName, selectedRows[0].id.toString());
        if (!reportViews.some(v => v.itemName === newView.itemName && v.id === newView.id)) {
            addReportView(newView);
        }
        if (newView.reportItemName) {
            queryRouter.push(
                `/dashboard/report/${encodeURIComponent(newView.reportItemName)}/${encodeURIComponent(newView.id)}`,
                { timeframe: encodeTimeframe(view.timeframe) }
            );
        }
    }

    return rows
        ? <>
            <UpperControlPanel
                onClick={item => updateViewItemNameById(id, item.itemName)}
                reportItemName={reportItemName}
            />
            <LowerControlPanel
                view={view}
                onNewReport={handleNewReport}
                reportItemName={reportItemName}
                rows={rows}
                setRows={setRows}
            />
            <DataTable
                view={view}
                rows={rows}
                setRows={setRows}
            />
        </>
        : <ReportSkeleton />
}

export function useRows(clicks: TClick[], itemName: EItemName) {
    const { primaryData } = useReportView();

    const [rows, setRows] = useState<TRow[] | null>(null);

    useEffect(() => {
        const newRows = makeRows(clicks, itemName, makeEnrichWith(itemName, primaryData));
        setRows(newRows);
    }, [clicks.length, itemName]);

    const value: [TRow[] | null, React.Dispatch<React.SetStateAction<TRow[] | null>>] = [rows, setRows];
    return value;
}

type TEnrichWith = {
    id: number;
    name: string;
};

function makeRows(clicks: TClick[], itemName: EItemName, enrichWith?: TEnrichWith[]): TRow[] {
    const rows = clicks.reduce((rows: TRow[], click: TClick) => {
        const clickProp = itemNameToClickProp(itemName);
        const value = clickProp ? click[clickProp] : null;
        if (value && (typeof value === "number" || typeof value === "string")) {
            const index = rows.findIndex(row => row.id === value);
            if (index !== -1) {
                rows[index].clicks.push(click);
            } else {
                rows.push({
                    id: value,
                    name: typeof value === "string" ? value : "",
                    clicks: [click],
                    selected: false,
                });
            }
        }
        return rows;
    }, []);

    if (enrichWith) {
        for (let i = 0; i < enrichWith.length; i++) {
            const { id, name } = enrichWith[i];
            if (rows.some(row => row.id === id)) continue;
            rows.push({
                id,
                name,
                clicks: [],
                selected: false,
            });
        }
    }

    return rows;
}

function makeEnrichWith(itemName: EItemName, primaryData: TPrimaryData): TEnrichWith[] | undefined {
    return itemNameInPrimaryData(itemName, primaryData)?.map(({ id, name }) => ({ id, name: name || "" }));
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
    [EItemName.FLOW]: "savedFlowId",
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
