"use client";

import { useState, useEffect } from "react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import useFetchPrimaryData from "@/hooks/useFetchPrimaryData";
import useQueryRouter from "@/hooks/useQueryRouter";
import UpperControlPanel from "./UpperControlPanel";
import LowerControlPanel from "./LowerControlPanel";
import DataTable, { TRow } from "./DataTable";
import { TView, useViewsStore, newReportView } from "@/lib/store";
import { EItemName, TClick, } from "@/lib/types";

export default function Report({ clicks, view, reportItemName }: {
    clicks: TClick[];
    view: TView;
    reportItemName?: EItemName;
}) {
    const { id, itemName } = view;
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
    const [rows, setRows] = useState<TRow[]>(makeRows(clicks, itemName));

    useEffect(() => {
        setRows(makeRows(clicks, itemName));
    }, [clicks.length, itemName]);

    useFetchPrimaryData(itemName, (data) => {
        const names = data.map(d => d.id.toString());
        setRows(makeRows(clicks, itemName, names));
    });

    const value: [TRow[], React.Dispatch<React.SetStateAction<TRow[]>>] = [rows, setRows];
    return value;
}

function makeRows(clicks: TClick[], itemName: EItemName, enrichWith?: string[]): TRow[] {
    const rows = clicks.reduce((acc: TRow[], curr: TClick) => {
        const clickProp = itemNameToClickProp(itemName);
        const key = clickProp ? curr[clickProp] : null;
        if (key && (typeof key === "string" || typeof key === "number")) {
            const name = key.toString();
            const i = acc.findIndex(row => row.name === name);
            if (i !== -1) {
                acc[i].clicks.push(curr);
            } else {
                acc.push({
                    name,
                    clicks: [curr],
                    selected: false,
                });
            }
        }
        return acc;
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
