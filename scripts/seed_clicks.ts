import dotenv from "dotenv";
import { argv } from "process";
import crypto from "crypto";
import path from "path";
import { Prisma } from "@prisma/client";
import db from "../src/lib/db";
import { randomItemFromArray, randomIntInRange } from "../src/lib/utils";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

(async function () {
    if (!argv?.[2]) {
        console.error("Please provide the number of clicks as an argument");
        return;
    }

    const numClicks = parseInt(argv[2]);
    if (!numClicks) {
        console.error("Argument must be a number");
        return;
    }

    try {
        console.log("Fetching complementary data");

        const affiliateNetworkIds = await extractIds(db.affiliateNetwork);
        const campaignIds = await extractIds(db.campaign);
        const savedFlowIds = await extractIds(db.savedFlow);
        const landingPageIds = await extractIds(db.landingPage);
        const offerIds = await extractIds(db.offer);
        const trafficSourceIds = await extractIds(db.trafficSource);

        console.log("Successfully fetched complementary data with no errors");

        const data: Prisma.ClickCreateManyInput[] = new Array(numClicks)
            .fill(null)
            .map(_ => smartMakeClickInput({
                affiliateNetworkIds,
                campaignIds,
                savedFlowIds,
                landingPageIds,
                offerIds,
                trafficSourceIds,
            }));



        console.log(`Inserting ${numClicks} clicks into the database`);

        const { count } = await db.click.createMany({
            data,
        });

        console.log(`Successfully seeded ${count} clicks`);
    } catch (err) {
        console.error(err);
    }
})();

interface IdFinder {
    findMany: () => Promise<{ id: number }[]>
}

async function extractIds(finder: IdFinder): Promise<number[]> {
    const records = await finder.findMany();
    return records.map(({ id }) => id);
}

function smartMakeClickInput(arg: {
    affiliateNetworkIds: number[];
    campaignIds: number[];
    savedFlowIds: number[];
    landingPageIds: number[];
    offerIds: number[];
    trafficSourceIds: number[];
}): Prisma.ClickCreateManyInput {
    const affiliateNetworkId = randomItemFromArray(arg.affiliateNetworkIds);
    const campaignId = randomItemFromArray(arg.campaignIds);
    const savedFlowId = randomItemFromArray(arg.savedFlowIds);
    const landingPageId = randomItemFromArray(arg.landingPageIds);
    const offerId = randomItemFromArray(arg.offerIds);
    const trafficSourceId = randomItemFromArray(arg.trafficSourceIds);

    if (affiliateNetworkId !== null
        && campaignId !== null
        && savedFlowId !== null
        && landingPageId !== null
        && offerId !== null
        && trafficSourceId !== null
    ) {
        return {
            affiliateNetworkId,
            campaignId,
            savedFlowId,
            landingPageId,
            offerId,
            trafficSourceId,
            publicId: crypto.randomUUID(),
            externalId: crypto.randomUUID(),
            cost: randomIntInRange(4, 500),
            revenue: randomIntInRange(4, 500),
            viewTime: new Date,
            clickTime: new Date,
            convTime: new Date,
            viewOutputUrl: "",
            clickOutputUrl: "",
            tokens: "[]",
            ip: "",
            isp: "",
            userAgent: "",
            language: "",
            country: "",
            region: "",
            city: "",
            deviceType: "",
            device: "",
            screenResolution: "",
            os: "",
            osVersion: "",
            browserName: "",
            browserVersion: "",
        };
    }
    throw new Error("Null value present");
}
