import { argv } from "process";
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import db from "../src/lib/db";
import { randItemFromArray, randomIntInRange } from "../src/lib/utils";

(async function () {
    if (argv.length < 2) {
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
    return {
        affiliateNetworkId: randItemFromArray(arg.affiliateNetworkIds),
        campaignId: randItemFromArray(arg.campaignIds),
        savedFlowId: randItemFromArray(arg.savedFlowIds),
        landingPageId: randItemFromArray(arg.landingPageIds),
        offerId: randItemFromArray(arg.offerIds),
        trafficSourceId: randItemFromArray(arg.trafficSourceIds),
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
