import { Prisma } from "@prisma/client";
import { useProtectedRoute } from "@/lib/auth";
import {
    getAllAffiliateNetworks, getAllCampaigns, getAllClicks, getAllFlows,
    getAllLandingPages, getAllOffers, getAllTrafficSources
} from "@/data";
import ReportView from "./ReportView";
import { defaultTimeframe } from "@/lib/constants";
import { decodeTimeframe } from "@/lib/utils";
import { EItemName } from "@/lib/types";

export default async function DashboardPage({ params, searchParams }: {
    params: { itemName?: string, id?: string };
    searchParams: { timeframe?: string };
}) {
    console.log(1);

    await useProtectedRoute();

    console.log(2);

    const timeframe = decodeSearchParams(searchParams).timeframe ?? defaultTimeframe;

    console.log(3);

    const { reportItemName, reportItemId } = decodeParams(params);

    console.log(4);

    try {

        // const clicksProm = getAllClicks({
        //     where: {
        //         AND: [
        //             timeframeFilter(timeframe),
        //             reportItemFilter(reportItemName, reportItemId),
        //         ],
        //     },
        // });

        console.log(5);

        const affilaiteNetworksProm = getAllAffiliateNetworks();
        // const campaignsProm = getAllCampaigns();
        // const flowsProm = getAllFlows();
        const landingPagesProm = getAllLandingPages();
        const offersProm = getAllOffers();
        // const trafficSourcesProm = getAllTrafficSources();

        console.log(6);

        // const clicks = await clicksProm;
        console.log(7);
        const affiliateNetworks = await affilaiteNetworksProm;
        console.log(8);
        // const campaigns = await campaignsProm;
        // console.log(9);
        // const flows = await flowsProm;
        // console.log(10);
        const landingPages = await landingPagesProm;
        console.log(11);
        const offers = await offersProm;
        console.log(12);
        // const trafficSources = await trafficSourcesProm;
        // console.log(13);

        return (
            <ReportView
                primaryData={{
                    affiliateNetworks,
                    campaigns: [],
                    flows: [],
                    landingPages,
                    offers,
                    trafficSources: [],
                }}
                // primaryData={{
                //     affiliateNetworks,
                //     campaigns,
                //     flows,
                //     landingPages,
                //     offers,
                //     trafficSources,
                // }}
                clicks={[]}
                // clicks={clicks}
                timeframe={timeframe}
                reportItemName={reportItemName ?? undefined}
            />
        )
    } catch (err) {
        console.error(err);
        return "Error fetching clicks from db :(";
    }
}

function decodeParams(params: {
    itemName?: string;
    id?: string;
}): { reportItemName: EItemName | null, reportItemId: number | null } {
    const reportItemName = (params.itemName ? decodeURIComponent(params.itemName) as EItemName ?? null : null);
    const reportItemId = (params.id ? Number(decodeURIComponent(params.id)) ?? null : null);
    return { reportItemName, reportItemId };
}

function decodeSearchParams(searchParams: {
    timeframe?: string;
}): { timeframe: [Date, Date] | null } {
    const timeframe = searchParams.timeframe
        ? decodeTimeframe(searchParams.timeframe) ?? null
        : null;
    return { timeframe };
}

function timeframeFilter([start, end]: [Date, Date]): Prisma.ClickWhereInput {
    return {
        viewTime: {
            gte: start,
            lte: end,
        },
    };
}

function reportItemFilter(reportItemName: EItemName | null, reportItemId: number | null): Prisma.ClickWhereInput {
    if (reportItemName === null || reportItemId === null) return {};
    switch (reportItemName) {
        case EItemName.AFFILIATE_NETWORK:
            return { affiliateNetworkId: reportItemId };
        case EItemName.CAMPAIGN:
            return { campaignId: reportItemId };
        case EItemName.FLOW:
            return { savedFlowId: reportItemId };
        case EItemName.LANDING_PAGE:
            return { landingPageId: reportItemId };
        case EItemName.OFFER:
            return { offerId: reportItemId };
        case EItemName.TRAFFIC_SOURCE:
            return { trafficSourceId: reportItemId };
    }
    return {};
}
