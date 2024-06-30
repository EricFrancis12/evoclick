// Do not use the "@/" syntax when importing anything into this file
// because the seed command that runs this file "npx prisma db seed"
// uses ts-node under the hood,
// and it's not able to recognize that syntax in the current tsconfig.
import prisma from "../src/lib/db";
import {
    affiliateNetworkSeedData, campaignSeedData, flowSeedData,
    landingPageSeedData, offerSeedData, trafficSourceData
} from "./seedData";

async function main() {
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

    const flow = await prisma.flow.create({
        data: {
            ...flowSeedData,
            mainRoute: JSON.stringify({
                ...flowSeedData.mainRoute,
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
            ruleRoutes: JSON.stringify(flowSeedData.ruleRoutes),
        },
    });

    const trafficSource = await prisma.trafficSource.create({
        data: {
            ...trafficSourceData,
            externalIdToken: JSON.stringify(trafficSourceData.externalIdToken),
            costToken: JSON.stringify(trafficSourceData.costToken),
            customTokens: JSON.stringify(trafficSourceData.customTokens),
        },
    });

    await prisma.campaign.create({
        data: {
            ...campaignSeedData,
            flowId: flow.id,
            trafficSourceId: trafficSource.id,
        },
    });
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
