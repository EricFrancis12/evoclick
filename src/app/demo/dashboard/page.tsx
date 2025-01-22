import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ReportView from "@/views/ReportView";
import { defaultTimeframe } from "@/lib/constants";
import { decodeParams, decodeSearchParams } from "@/lib/utils/server";
import { inDemoMode } from "@/lib/utils";
import { EItemName } from "@/lib/types";
import {
    demoAffiliateNetworks, demoCampaigns, demoSavedFlows, demoLandingPages,
    demoOffers, demoTrafficSources, demoClicks,
} from "./data";

export default async function DemoDashboardPage({ params, searchParams }: {
    params: { itemName?: string, id?: string };
    searchParams: { timeframe?: string };
}) {
    if (!inDemoMode()) {
        return notFound();
    }

    const timeframe = decodeSearchParams(searchParams).timeframe ?? defaultTimeframe;
    const { reportItemName } = decodeParams(params);

    const primaryData = {
        [EItemName.AFFILIATE_NETWORK]: demoAffiliateNetworks,
        [EItemName.CAMPAIGN]: demoCampaigns,
        [EItemName.FLOW]: demoSavedFlows,
        [EItemName.LANDING_PAGE]: demoLandingPages,
        [EItemName.OFFER]: demoOffers,
        [EItemName.TRAFFIC_SOURCE]: demoTrafficSources,
    };

    return (
        <>
            <div className="flex items-center gap-2 w-full px-2 py-1 text-xs">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>While running in Demo Mode, write operations are disabled.</span>
            </div>
            <ReportView
                primaryData={primaryData}
                clicks={demoClicks}
                timeframe={timeframe}
                reportItemName={reportItemName ?? undefined}
            />
        </>
    )
}
