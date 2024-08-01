import { useProtectedRoute } from "@/lib/auth";
import {
    getAllAffiliateNetworks, getAllCampaigns, getAllClicks, getAllFlows,
    getAllLandingPages, getAllOffers, getAllTrafficSources
} from "@/data";
import HomeView from "../views/HomeView";
import { defaultTimeframe } from "@/lib/constants";
import { decodeSearchParams, prismaArgs } from "@/lib/utils/server";
import { EItemName } from "@/lib/types";

export default async function HomePage({ searchParams }: {
    searchParams: { timeframe?: string };
}) {
    await useProtectedRoute();

    const timeframe = decodeSearchParams(searchParams).timeframe ?? defaultTimeframe;

    try {
        const clicksProm = getAllClicks(prismaArgs(timeframe, null, null));

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
            <HomeView
                primaryData={primaryData}
                clicks={clicks}
                timeframe={timeframe}
            />
        )
    } catch (err) {
        console.error(err);
        return "Server error";
    }
}
