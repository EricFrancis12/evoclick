import { useProtectedRoute } from "@/lib/auth";
import {
    getAllAffiliateNetworks, getAllCampaigns, getAllClicks, getAllFlows,
    getAllLandingPages, getAllOffers, getAllTrafficSources
} from "@/data";
import ReportView from "@/views/ReportView";
import { defaultTimeframe } from "@/lib/constants";
import { decodeParams, decodeSearchParams, prismaArgs } from "@/lib/utils/server";
import { EItemName } from "@/lib/types";

export default async function DashboardPage({ params, searchParams }: {
    params: { itemName?: string, id?: string };
    searchParams: { timeframe?: string };
}) {
    await useProtectedRoute();

    const timeframe = decodeSearchParams(searchParams).timeframe ?? defaultTimeframe;
    const { reportItemName, reportItemId } = decodeParams(params);

    try {
        const clicksProm = getAllClicks(prismaArgs(timeframe, reportItemName, reportItemId));

        const affilaiteNetworksProm = getAllAffiliateNetworks();
        const campaignsProm = getAllCampaigns();
        const flowsProm = getAllFlows();
        const landingPagesProm = getAllLandingPages();
        const offersProm = getAllOffers();
        const trafficSourcesProm = getAllTrafficSources();

        const clicks = await clicksProm;

        const primaryData = {
            [EItemName.AFFILIATE_NETWORK]: await affilaiteNetworksProm,
            [EItemName.CAMPAIGN]: await campaignsProm,
            [EItemName.FLOW]: await flowsProm,
            [EItemName.LANDING_PAGE]: await landingPagesProm,
            [EItemName.OFFER]: await offersProm,
            [EItemName.TRAFFIC_SOURCE]: await trafficSourcesProm,
        };

        return (
            <ReportView
                primaryData={primaryData}
                clicks={clicks}
                timeframe={timeframe}
                reportItemName={reportItemName ?? undefined}
                reportItemId={reportItemId ?? undefined}
            />
        )
    } catch (err) {
        console.error(err);
        return "Server error";
    }
}
