import { notFound } from "next/navigation";
import ReportView from "@/views/ReportView";
import { defaultTimeframe } from "@/lib/constants";
import { decodeParams, decodeSearchParams } from "@/lib/utils/server";
import { inDemoMode } from "@/lib/utils";
import { EItemName } from "@/lib/types";
import {
    demoAffiliateNetworks, demoCampaigns, demoSavedFlows, demoLandingPages,
    demoOffers, demoTrafficSources, demoClicks,
} from "./data";

export default async function DashboardPage({ params, searchParams }: {
    params: { itemName?: string, id?: string };
    searchParams: { timeframe?: string };
}) {
    if (!inDemoMode()) {
        return notFound();
    }

    const timeframe = decodeSearchParams(searchParams).timeframe ?? defaultTimeframe;
    const { reportItemName, reportItemId } = decodeParams(params);

    const primaryData = {
        [EItemName.AFFILIATE_NETWORK]: demoAffiliateNetworks,
        [EItemName.CAMPAIGN]: demoCampaigns,
        [EItemName.FLOW]: demoSavedFlows,
        [EItemName.LANDING_PAGE]: demoLandingPages,
        [EItemName.OFFER]: demoOffers,
        [EItemName.TRAFFIC_SOURCE]: demoTrafficSources,
    };

    return (
        // TODO: Decouple CRUD operations from view components,
        // and impliment persist data to local storage for demo mode.
        <ReportView
            primaryData={primaryData}
            clicks={demoClicks}
            timeframe={timeframe}
            reportItemName={reportItemName ?? undefined}
        />
    )
}
