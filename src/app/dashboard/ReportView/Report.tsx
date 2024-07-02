"use client";

import { useState, useEffect } from "react";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import useQueryRouter from "@/hooks/useQueryRouter";
import UpperControlPanel from "./UpperControlPanel";
import LowerControlPanel from "./LowerControlPanel";
import DataTable from "./DataTable";
import { TView, newReportView } from "@/app/dashboard/ReportView/Tab";
import { useViewsStore } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";
import { RowsHashMap } from "./DataTable";

export default function Report({ clicks, view }: {
    clicks: TClick[];
    view: TView;
}) {
    const [rows, setRows] = useState<RowsHashMap>(makeRows(clicks, view.itemName));
    useEffect(() => {
        setRows(makeRows(clicks, view.itemName));
    }, [clicks.length, view.itemName]);

    const { makeNewReportView, updateViewItemNameById } = useViewsStore(store => store);
    const queryRouter = useQueryRouter();

    // Finds the first row that is selected and creates a report for it
    function handleNewReport() {
        for (const id in rows) {
            if (rows[id].selected) {
                const _view = newReportView(EItemName.CAMPAIGN, faBullseye, view.itemName, id);
                makeNewReportView(_view);
                queryRouter.push(`/dashboard/report/${_view.itemName}/${_view.id}`);
                return;
            }
        }
    }

    return (
        <>
            <UpperControlPanel onClick={item => updateViewItemNameById(view.id, item.itemName)} />
            <LowerControlPanel
                view={view}
                onNewReport={handleNewReport}
            />
            <DataTable
                itemName={view.itemName}
                rows={rows}
                setRows={setRows}
            />
        </>
    )
}

function makeRows(clicks: TClick[], itemName: EItemName) {
    return clicks.reduce((acc: RowsHashMap, curr: TClick) => {
        const clickProp = itemNameToClickProp(itemName);
        const key = clickProp ? curr[clickProp] : null;
        if (key && (typeof key === "string" || typeof key === "number")) {
            const keyStr = key.toString();
            if (acc[keyStr]?.clicks) {
                acc[keyStr].clicks = [...acc[keyStr].clicks, curr]
            } else {
                acc[keyStr] = {
                    clicks: [curr],
                    selected: false,
                };
            }
        }
        return acc;
    }, {});
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
