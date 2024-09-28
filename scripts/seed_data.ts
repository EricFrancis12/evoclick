import crypto from "crypto";
import main from "../prisma/main";
import seedData, { returnFirstOrThrow } from "../prisma/seedData";

(async function () {
    try {
        console.log("Starting seed");

        const campaignSeed = returnFirstOrThrow(seedData.campaignSeeds, "Campaign seed");

        await main({
            ...seedData,
            campaignSeeds: [
                {
                    ...campaignSeed,
                    publicId: crypto.randomUUID(),
                },
            ],
        });
        console.log("Seed finished with no errors");
    } catch (err) {
        console.error(err);
    }
})();
