import { $Enums } from "@prisma/client";
import prisma from "../src/lib/db";
import { ELogicalRelation, TNamedToken, TRoute, TToken } from "../src/lib/types";

const tags = ["placeholder", "example"];

export const affiliateNetworkSeedData = {
    name: "My First Affiliate Network",
    defaultNewOfferString: "",
    tags,
};
export type TAffiliateNetworkSeedData = typeof affiliateNetworkSeedData;

export const offerSeedData = {
    name: "My First Offer",
    url: "http://localhost:3001/assets/sample-offer.html",
    payout: 80,
    tags,
};
export type TOfferSeedData = typeof offerSeedData;

export const landingPageSeedData = {
    name: "My First Landing Page",
    url: "http://localhost:3001/assets/sample-landing-page.html",
    tags,
};
export type TLandingPageSeedData = typeof landingPageSeedData;

export const savedFlowSeedData = {
    name: "My First Saved Flow",
    mainRoute: <TRoute>{
        isActive: true,
        logicalRelation: ELogicalRelation.AND,
        rules: [],
        paths: [],
    },
    ruleRoutes: <TRoute[]>[],
    tags,
};
export type TSavedFlowSeedData = typeof savedFlowSeedData;

export const trafficSourceSeedData = {
    externalIdToken: <TToken>{
        queryParam: "external_id",
        value: "{external_id}",
    },
    costToken: <TToken>{
        queryParam: "cost",
        value: "{cost}",
    },
    customTokens: <TNamedToken[]>[
        {
            name: "Zone ID",
            queryParam: "zone_id",
            value: "{zone_id}"
        },
        {
            name: "Banner ID",
            queryParam: "banner_id",
            value: "{banner_id}"
        },
    ],
    name: "My First Traffic Source",
    postbackUrl: "http://localhost:3001/postback/test",
    tags,
};
export type TTrafficSourceSeedData = typeof trafficSourceSeedData;

export const campaignSeedData = {
    name: "My First Campaign",
    publicId: "1234-abcd-5678-efgh",
    landingPageRotationType: $Enums.RotationType.RANDOM,
    offerRotationType: $Enums.RotationType.RANDOM,
    geoName: $Enums.GeoName.UNITED_STATES,
    tags,
};
export type TCampaignSeedData = typeof campaignSeedData;

const seedData = {
    affiliateNetworkSeedData,
    campaignSeedData,
    savedFlowSeedData,
    landingPageSeedData,
    offerSeedData,
    trafficSourceSeedData,
};
export type TSeedData = typeof seedData;
export default seedData;

export async function main(seedData: TSeedData) {
    const {
        affiliateNetworkSeedData, campaignSeedData, savedFlowSeedData,
        landingPageSeedData, offerSeedData, trafficSourceSeedData,
    } = seedData;

    const affiliateNetwork = await prisma.affiliateNetwork.create({
        data: affiliateNetworkSeedData,
    });

    const offer = await prisma.offer.create({
        data: {
            ...offerSeedData,
            affiliateNetworkId: affiliateNetwork.id,
        },
    });

    const landingPage = await prisma.landingPage.create({
        data: landingPageSeedData,
    });

    const flow = await prisma.savedFlow.create({
        data: {
            ...savedFlowSeedData,
            mainRoute: JSON.stringify({
                ...savedFlowSeedData.mainRoute,
                paths: [
                    {
                        directLinkingEnabled: false,
                        isActive: true,
                        landingPageIds: [landingPage.id],
                        offerIds: [offer.id],
                        weight: 100,
                    },
                ],
            }),
            ruleRoutes: JSON.stringify(savedFlowSeedData.ruleRoutes),
        },
    });

    const trafficSource = await prisma.trafficSource.create({
        data: {
            ...trafficSourceSeedData,
            externalIdToken: JSON.stringify(trafficSourceSeedData.externalIdToken),
            costToken: JSON.stringify(trafficSourceSeedData.costToken),
            customTokens: JSON.stringify(trafficSourceSeedData.customTokens),
        },
    });

    const campaign = await prisma.campaign.create({
        data: {
            ...campaignSeedData,
            flowType: $Enums.FlowType.SAVED,
            savedFlowId: flow.id,
            trafficSourceId: trafficSource.id,
            flowMainRoute: "",
            flowRuleRoutes: "",
            flowUrl: "",
        },
    });

    return {
        affiliateNetwork,
        campaign,
        flow,
        landingPage,
        offer,
        trafficSource,
    };
}
