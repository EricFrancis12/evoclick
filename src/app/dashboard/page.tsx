import { useProtectedRoute } from "@/lib/auth";
import { getAllAffiliateNetworks, getAllCampaigns, getAllClicks, getAllFlows, getAllLandingPages, getAllOffers, getAllTrafficSources } from "@/data";
import ReportView from "./ReportView";
import { EItemName } from "@/lib/types";
import { TPrimaryData } from "./ReportView/ReportViewContext";

export default async function DashboardPage({ params, searchParams }: {
    params: { itemName?: string, id?: string };
    searchParams: { page?: string, size?: string, timeframe?: string };
}) {
    await useProtectedRoute();

    // TODO: Validate all params and search params used here,
    // and create default values if not valid:
    const page = Number(searchParams?.page) || 1;
    const size = Number(searchParams?.size) || 20;
    const splitOnComma = searchParams.timeframe ? decodeURIComponent(searchParams.timeframe).split(",") : null;
    const timeframe: [Date, Date] = splitOnComma?.length === 2
        ? [new Date(splitOnComma[0]), new Date(splitOnComma[1])]
        : [new Date("2024-06-20"), new Date("2024-07-30")];

    const reportItemName = (params.itemName ? decodeURIComponent(params.itemName) : null) as EItemName | null;
    const reportItemId = (params.id ? decodeURIComponent(params.id) : null) as EItemName | null;

    const affilaiteNetworksProm = getAllAffiliateNetworks();
    const campaignsProm = getAllCampaigns();
    const flowsProm = getAllFlows();
    const landingPagesProm = getAllLandingPages();
    const offersProm = getAllOffers();
    const trafficSourcesProm = getAllTrafficSources();

    const clicksProm = getAllClicks({
        skip: getSkip(page, size),
        take: size,
        where: {
            AND: [
                {
                    viewTime: {
                        gte: timeframe[0],
                        lte: timeframe[1],
                    },
                },
                {
                    // TODO: Add ability to filter by reportItemName and reportItemId
                },
            ],
        },
    });

    try {
        const affiliateNetworks = await affilaiteNetworksProm;
        const campaigns = await campaignsProm;
        const flows = await flowsProm;
        const landingPages = await landingPagesProm;
        const offers = await offersProm;
        const trafficSources = await trafficSourcesProm;
        const clicks = await clicksProm;

        return (
            <ReportView
                primaryData={{
                    affiliateNetworks,
                    campaigns,
                    flows,
                    landingPages,
                    offers,
                    trafficSources,
                }}
                clicks={clicks}
                page={page}
                size={size}
                timeframe={timeframe}
                reportItemName={reportItemName ?? undefined}
            />
        )
    } catch (err) {
        console.error(err);
        return "Error fetching clicks from db :(";
    }
}

function getSkip(page: number, size: number): number {
    return page < 1 ? 0 : (page - 1) * size;
}
