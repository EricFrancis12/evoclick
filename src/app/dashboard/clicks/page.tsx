import {
    countAllClicks, getAllAffiliateNetworks, getAllCampaigns, getAllClicks,
    getAllFlows, getAllLandingPages, getAllOffers, getAllTrafficSources,
} from "@/data";
import { useProtectedRoute } from "@/lib/auth";
import { defaultTimeframe } from "@/lib/constants";
import db from "@/lib/db";
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
        // TODO: clean up the below fetch method, and above code, and impliment the same idea fo the other primary items
        const affilaiteNetworksProm = db.affiliateNetwork.findMany({
            where: {
                id: {
                    in: affiliateNetworkIncl,
                },
                NOT: {
                    id: {
                        in: affiliateNetworkExcl,
                    },
                },
            },
        });

        const campaignsProm = getAllCampaigns();
        const flowsProm = getAllFlows();
        const landingPagesProm = getAllLandingPages();
        const offersProm = getAllOffers();
        const trafficSourcesProm = getAllTrafficSources();

        const clicksProm = getAllClicks({
            skip: currentPage * itemsPerPage,
            take: itemsPerPage,
            where: {
                ...timeframeFilter(timeframe),
                AND: {
                    affiliateNetworkId: {
                        in: affiliateNetworkIncl,
                    },
                },
                NOT: {
                    affiliateNetworkId: {
                        in: affiliateNetworkExcl,
                    },
                },
            },
        });

        const numClicksProm = countAllClicks({
            where: timeframeFilter(timeframe),
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
                const ids = val.filter(v => !isNaN(parseInt(v))).map(parseInt);
                result[name] = ids;
            }
        }
    }

    return result;
}
