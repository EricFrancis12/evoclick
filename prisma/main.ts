import { $Enums } from "@prisma/client";
import prisma from "../src/lib/db";
import { TSeedData } from "./seedData";

export default async function main(seedData: TSeedData) {
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
