import { Prisma } from "@prisma/client";
import { useProtectedRoute } from "@/lib/auth";
import {
    getAllAffiliateNetworks, getAllCampaigns, getAllClicks, getAllFlows,
    getAllLandingPages, getAllOffers, getAllTrafficSources
} from "@/data";
import ReportView from "./ReportView";
import { defaultTimeframe } from "@/lib/constants";
import { decodeTimeframe, itemNameIsPrimary } from "@/lib/utils";
import { clickPropsMap } from "@/lib/utils/maps";
import { EItemName } from "@/lib/types";

export default async function DashboardPage({ params, searchParams }: {
    params: { itemName?: string, id?: string };
    searchParams: { timeframe?: string };
}) {
    await useProtectedRoute();

    const timeframe = decodeSearchParams(searchParams).timeframe ?? defaultTimeframe;
    const { reportItemName, reportItemId } = decodeParams(params);

    try {
        const clicksProm = getAllClicks({
            where: {
                AND: [
                    timeframeFilter(timeframe),
                    reportItemFilter(reportItemName, reportItemId),
                ],
            },
        });

        const affilaiteNetworksProm = getAllAffiliateNetworks();
        const campaignsProm = getAllCampaigns();
        const flowsProm = getAllFlows();
        const landingPagesProm = getAllLandingPages();
        const offersProm = getAllOffers();
        const trafficSourcesProm = getAllTrafficSources();

        const clicks = await clicksProm;

        const primaryData = {
            affiliateNetworks: await affilaiteNetworksProm,
            campaigns: await campaignsProm,
            flows: await flowsProm,
            landingPages: await landingPagesProm,
            offers: await offersProm,
            trafficSources: await trafficSourcesProm,
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
        return "Error fetching data from db :(";
    }
}

function decodeParams(params: {
    itemName?: string;
    id?: string;
}): { reportItemName: EItemName | null, reportItemId: string | null } {
    const { itemName, id } = params;
    return {
        reportItemName: itemName ? decodeURIComponent(itemName) as EItemName || null : null,
        reportItemId: id ? decodeURIComponent(id) || null : null,
    };
}

function decodeSearchParams(searchParams: {
    timeframe?: string;
}): { timeframe: [Date, Date] | null } {
    const { timeframe } = searchParams;
    return {
        timeframe: timeframe ? decodeTimeframe(timeframe) : null,
    };
}

function timeframeFilter([start, end]: [Date, Date]): Prisma.ClickWhereInput {
    return {
        viewTime: {
            gte: start,
            lte: end,
        },
    };
}

function reportItemFilter(reportItemName: EItemName | null, reportItemId: string | null): Prisma.ClickWhereInput {
    if (reportItemName === null || reportItemId === null) return {};

    const { isPrimary } = itemNameIsPrimary(reportItemName);
    if (isPrimary) {
        const id = parseInt(reportItemId);
        if (!id) return {};

        return { [itemNameToKeyofPrismaInput(reportItemName)]: id };
    }

    return { [itemNameToKeyofPrismaInput(reportItemName)]: reportItemId };
}

function itemNameToKeyofPrismaInput(itemName: EItemName): keyof Prisma.ClickWhereInput {
    return keyofPrismaInputsMap[itemName];
}

const keyofPrismaInputsMap: Record<EItemName, keyof Prisma.ClickWhereInput> = {
    ...clickPropsMap,
};
