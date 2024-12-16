import { $Enums } from "@prisma/client";
import prisma from "../src/lib/db";
import { TSeedData, testUserAgent, testZoneId, ECustomTokenParam } from "./seedData";
import { ELogicalRelation, ERuleName, TRoute } from "../src/lib/types";
import { returnAtIndexOrThrow, returnFirstOrThrow } from "../src/lib/utils";

export default async function main(seedData: TSeedData) {
    const {
        affiliateNetworkSeeds, campaignSeeds, landingPageSeeds,
        offerSeeds, savedFlowSeeds, trafficSourceSeeds,
    } = seedData;

    // Seed Affiliate Networks
    const affiliateNetworkSeed = returnFirstOrThrow(affiliateNetworkSeeds, "Affiliate Network seed");

    const affiliateNetwork = await prisma.affiliateNetwork.create({
        data: affiliateNetworkSeed,
    });

    for (let i = 1; i < affiliateNetworkSeeds.length; i++) {
        const seed = affiliateNetworkSeeds[i];
        if (!seed) continue;
        await prisma.affiliateNetwork.create({
            data: seed,
        });
    }

    // Seed Offers
    const offerSeed1 = returnAtIndexOrThrow(offerSeeds, 0, "Offer seed");
    const offer1 = await prisma.offer.create({
        data: {
            ...offerSeed1,
            affiliateNetworkId: affiliateNetwork.id,
        },
    });

    const offerSeed2 = returnAtIndexOrThrow(offerSeeds, 1, "Offer seed");
    const offer2 = await prisma.offer.create({
        data: {
            ...offerSeed2,
            affiliateNetworkId: affiliateNetwork.id,
        },
    });

    const offerSeed3 = returnAtIndexOrThrow(offerSeeds, 2, "Offer seed");
    const offer3 = await prisma.offer.create({
        data: {
            ...offerSeed3,
            affiliateNetworkId: affiliateNetwork.id,
        },
    });

    for (let i = 2; i < offerSeeds.length; i++) {
        const seed = offerSeeds[i];
        if (!seed) continue;
        await prisma.offer.create({
            data: {
                ...seed,
                affiliateNetworkId: affiliateNetwork.id,
            },
        });
    }

    // Seed Landing Pages
    const landingPageSeed = returnFirstOrThrow(landingPageSeeds, "Landing Page seed");

    const landingPage = await prisma.landingPage.create({
        data: landingPageSeed,
    });

    for (let i = 1; i < landingPageSeeds.length; i++) {
        const seed = landingPageSeeds[i];
        if (!seed) continue;
        await prisma.landingPage.create({
            data: seed,
        });
    }

    // Seed Saved Flows
    const savedFlowSeed = returnFirstOrThrow(savedFlowSeeds, "Saved Flow seed");

    const mainRoute: TRoute = {
        ...savedFlowSeed.mainRoute,
        paths: [
            {
                directLinkingEnabled: false,
                isActive: true,
                landingPageIds: [landingPage.id],
                offerIds: [offer1.id],
                weight: 100,
            },
        ],
    };

    const ruleRoutes: TRoute[] = [
        {
            isActive: true,
            logicalRelation: ELogicalRelation.AND,
            rules: [
                {
                    ruleName: ERuleName.USER_AGENT,
                    data: [testUserAgent],
                    includes: true,
                },
            ],
            paths: [
                {
                    isActive: true,
                    weight: 100,
                    landingPageIds: [],
                    offerIds: [offer2.id],
                    directLinkingEnabled: true,
                },
            ],
        },
        {
            isActive: true,
            logicalRelation: ELogicalRelation.AND,
            rules: [
                {
                    ruleName: `Custom-Rule-${ECustomTokenParam.ZONE_ID}`,
                    data: [testZoneId],
                    includes: true,
                },
            ],
            paths: [
                {
                    isActive: true,
                    weight: 100,
                    landingPageIds: [],
                    offerIds: [offer3.id],
                    directLinkingEnabled: true,
                },
            ],
        },
    ];

    const flow = await prisma.savedFlow.create({
        data: {
            ...savedFlowSeed,
            mainRoute: JSON.stringify(mainRoute),
            ruleRoutes: JSON.stringify(ruleRoutes),
        },
    });

    for (let i = 1; i < savedFlowSeeds.length; i++) {
        const seed = savedFlowSeeds[i];
        if (!seed) continue;
        await prisma.savedFlow.create({
            data: {
                ...savedFlowSeed,
                mainRoute: JSON.stringify(mainRoute),
                ruleRoutes: JSON.stringify(ruleRoutes),
            },
        });
    }

    // Seed Traffic Sources
    const trafficSourceSeed = returnFirstOrThrow(trafficSourceSeeds, "Traffic Source seed");

    const trafficSource = await prisma.trafficSource.create({
        data: {
            ...trafficSourceSeed,
            externalIdToken: JSON.stringify(trafficSourceSeed.externalIdToken),
            costToken: JSON.stringify(trafficSourceSeed.costToken),
            customTokens: JSON.stringify(trafficSourceSeed.customTokens),
        },
    });

    for (let i = 1; i < trafficSourceSeeds.length; i++) {
        const seed = trafficSourceSeeds[i];
        if (!seed) continue;
        await prisma.trafficSource.create({
            data: {
                ...trafficSourceSeed,
                externalIdToken: JSON.stringify(trafficSourceSeed.externalIdToken),
                costToken: JSON.stringify(trafficSourceSeed.costToken),
                customTokens: JSON.stringify(trafficSourceSeed.customTokens),
            },
        });
    }

    // Seed Campaigns
    const campaignSeed = returnFirstOrThrow(campaignSeeds, "Campaign seed");

    const campaign = await prisma.campaign.create({
        data: {
            ...campaignSeed,
            flowType: $Enums.FlowType.SAVED,
            savedFlowId: flow.id,
            trafficSourceId: trafficSource.id,
            flowMainRoute: "",
            flowRuleRoutes: "",
            flowUrl: "",
        },
    });

    for (let i = 1; i < campaignSeeds.length; i++) {
        const seed = campaignSeeds[i];
        if (!seed) continue;
        await prisma.campaign.create({
            data: {
                ...campaignSeed,
                flowType: $Enums.FlowType.SAVED,
                savedFlowId: flow.id,
                trafficSourceId: trafficSource.id,
                flowMainRoute: "",
                flowRuleRoutes: "",
                flowUrl: "",
            },
        });
    }

    return {
        affiliateNetwork,
        campaign,
        flow,
        landingPage,
        offer: offer1,
        trafficSource,
    };
}
