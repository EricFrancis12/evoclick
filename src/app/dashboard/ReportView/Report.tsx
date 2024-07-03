"use client";

import { useState, useEffect } from "react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import useQueryRouter from "@/hooks/useQueryRouter";
import UpperControlPanel from "./UpperControlPanel";
import LowerControlPanel from "./LowerControlPanel";
import DataTable, { TRow } from "./DataTable";
import { TView, useViewsStore, newReportView } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";

export default function Report({ clicks, view }: {
    clicks: TClick[];
    view: TView;
}) {
    const { id, itemName } = view;
    const [rows, setRows] = useState<TRow[]>(makeRows(clicks, itemName));
    const selectedRows = rows.filter(row => row.selected === true);
    console.log(selectedRows);
    useEffect(() => {
        setRows(makeRows(clicks, itemName));
    }, [clicks.length, itemName]);

    const { reportViews, addReportView, updateViewItemNameById } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    // Finds the first row that is selected and creates a report for it
    function handleNewReport() {
        if (selectedRows.length < 1) return;
        const _view = newReportView(EItemName.LANDING_PAGE, faBullseye, itemName, rows[0].name);
        if (!reportViews.some(v => v.itemName === _view.itemName && v.id === _view.id)) {
            addReportView(_view);
        }
        if (_view.reportItemName) {
            queryRouter.push(`/dashboard/report/${encodeURIComponent(_view.reportItemName)}/${encodeURIComponent(_view.id)}`);
        }
    }

    return (
        <>
            <UpperControlPanel onClick={item => updateViewItemNameById(id, item.itemName)} />
            <LowerControlPanel
                view={view}
                onNewReport={handleNewReport}
                newReportDisabled={selectedRows.length < 1}
            />
            <DataTable
                itemName={itemName}
                rows={rows}
                setRows={setRows}
            />
        </>
    )
}

function makeRows(clicks: TClick[], itemName: EItemName): TRow[] {
    return clicks.reduce((acc: TRow[], curr: TClick) => {
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
