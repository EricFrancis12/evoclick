"use client";

import {
    faBullseye, faFolder, faGlobe, faGlobeEurope, faHandshake, faLaptop,
    faMobile, faSitemap, faUsers, faWifi, IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { useReportView } from "./ReportViewContext";
import { useRows } from "@/hooks/useRows";
import UpperControlPanel from "./UpperControlPanel";
import LowerControlPanel from "./LowerControlPanel";
import DataTable from "./DataTable";
import ReportSkeleton from "./ReportSkeleton";
import { TView, useViewsStore } from "@/lib/store";
import { EItemName } from "@/lib/types";

export default function Report({ view, reportItemName }: {
    view: TView;
    reportItemName?: EItemName;
}) {
    const { id, itemName } = view;
    const { clicks } = useReportView();
    const [rows, setRows] = useRows(clicks, itemName);

    const { updateViewItemNameById } = useViewsStore(store => store);

    return rows
        ? <>
            <UpperControlPanel
                view={view}
                onClick={itemName => updateViewItemNameById(id, itemName)}
                reportItemName={reportItemName}
            />
            <LowerControlPanel
                view={view}
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

export function itemNameToIcon(itemName: EItemName): IconDefinition {
    return itemNameIconsMap[itemName];
}

const itemNameIconsMap: Record<EItemName, IconDefinition> = {
    [EItemName.AFFILIATE_NETWORK]: faUsers,
    [EItemName.CAMPAIGN]: faBullseye,
    [EItemName.FLOW]: faSitemap,
    [EItemName.LANDING_PAGE]: faFolder,
    [EItemName.OFFER]: faHandshake,
    [EItemName.TRAFFIC_SOURCE]: faGlobe,
    [EItemName.IP]: faWifi,
    [EItemName.ISP]: faWifi,
    [EItemName.USER_AGENT]: faWifi,
    [EItemName.LANGUAGE]: faGlobeEurope,
    [EItemName.COUNTRY]: faGlobeEurope,
    [EItemName.REGION]: faGlobeEurope,
    [EItemName.CITY]: faGlobeEurope,
    [EItemName.DEVICE_TYPE]: faLaptop,
    [EItemName.DEVICE]: faLaptop,
    [EItemName.SCREEN_RESOLUTION]: faLaptop,
    [EItemName.OS]: faMobile,
    [EItemName.OS_VERSION]: faMobile,
    [EItemName.BROWSER_NAME]: faFolder,
    [EItemName.BROWSER_VERSION]: faFolder,
};
