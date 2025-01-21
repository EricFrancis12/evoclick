import {
    countClicks, getAllAffiliateNetworks, getAllCampaigns, getAllClicks,
    getAllFlows, getAllLandingPages, getAllOffers, getAllTrafficSources,
} from "@/data";
import { useProtectedRoute } from "@/lib/auth";
import { defaultTimeframe } from "@/lib/constants";
import { EItemName, TAffiliateNetwork } from "@/lib/types";
import { decodeSearchParams, timeframeFilter } from "@/lib/utils/server";
import ClicksView from "@/views/ClicksView";
import { getAllFilterActionNames } from "@/lib/utils";

export default async function ClicksPage({ searchParams }: {
    searchParams: {
        page?: string;
        itemsPerPage?: string;
        timeframe?: string;
        affiliateNetworkIncl?: string | string[];
        affiliateNetworkExcl?: string | string[];
        campaignIncl?: string | string[];
        campaignExcl?: string | string[];
        flowIncl?: string | string[];
        flowExcl?: string | string[];
        landingPageIncl?: string | string[];
        landingPageExcl?: string | string[];
        offerIncl?: string | string[];
        offerExcl?: string | string[];
        trafficSourceIncl?: string | string[];
        trafficSourceExcl?: string | string[];
    };
}) {
    await useProtectedRoute();

    const timeframe = decodeSearchParams(searchParams).timeframe ?? defaultTimeframe;
    const currentPage = Number(searchParams.page) || 1;
    const itemsPerPage = Number(searchParams.itemsPerPage) || 20;

    const {
        affiliateNetworkIncl,
        affiliateNetworkExcl,
        campaignIncl,
        campaignExcl,
        flowIncl,
        flowExcl,
        landingPageIncl,
        landingPageExcl,
        offerIncl,
        offerExcl,
        trafficSourceIncl,
        trafficSourceExcl,
    } = formatFilterActionParams(searchParams);

    try {
        const affilaiteNetworksProm = getAllAffiliateNetworks();
        const campaignsProm = getAllCampaigns();
        const flowsProm = getAllFlows();
        const landingPagesProm = getAllLandingPages();
        const offersProm = getAllOffers();
        const trafficSourcesProm = getAllTrafficSources();

        const clicksWhere = {
            ...timeframeFilter(timeframe),
            AND: {
                affiliateNetworkId: { in: affiliateNetworkIncl },
                campaignId: { in: campaignIncl },
                savedFlowId: { in: flowIncl },
                landingPageId: { in: landingPageIncl },
                offerId: { in: offerIncl },
                trafficSourceId: { in: trafficSourceIncl },
            },
            NOT: {
                affiliateNetworkId: { in: affiliateNetworkExcl },
                campaignId: { in: campaignExcl },
                savedFlowId: { in: flowExcl },
                landingPageId: { in: landingPageExcl },
                offerId: { in: offerExcl },
                trafficSourceId: { in: trafficSourceExcl },
            },
        };

        const clicksProm = getAllClicks({
            skip: currentPage * itemsPerPage,
            take: itemsPerPage,
            where: clicksWhere,
        });

        const numClicksProm = countClicks({
            where: clicksWhere,
        });

        const primaryData = {
            [EItemName.AFFILIATE_NETWORK]: await affilaiteNetworksProm as TAffiliateNetwork[],
            [EItemName.CAMPAIGN]: await campaignsProm,
            [EItemName.FLOW]: await flowsProm,
            [EItemName.LANDING_PAGE]: await landingPagesProm,
            [EItemName.OFFER]: await offersProm,
            [EItemName.TRAFFIC_SOURCE]: await trafficSourcesProm,
        };

        const clicks = await clicksProm;
        const numClicks = await numClicksProm;

        const totalPages = Math.ceil(numClicks / itemsPerPage);

        return (
            <ClicksView
                primaryData={primaryData}
                clicks={clicks}
                timeframe={timeframe}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        )
    } catch (err) {
        console.error(err);
        return "Error fetching clicks";
    }
}

function formatFilterActionParams(searchParams: { [key: string]: string | string[] }): { [key: string]: number[] } {
    const names = getAllFilterActionNames();

    const result: { [key: string]: number[] } = {};

    for (const name in names) {
        if (name in searchParams) {
            const val = searchParams[name];
            if (typeof val === "string") {
                const id = parseInt(val);
                if (!isNaN(id)) {
                    result[name] = [id];
                }
            } else if (Array.isArray(val)) {
                const ids = val.map(parseInt).filter(id => !isNaN(id));
                result[name] = ids;
            }
        }
    }

    return result;
}
