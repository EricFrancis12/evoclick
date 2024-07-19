import crypto from "crypto";
import { main } from "../prisma/seedData";
import seedData from "../prisma/seedData";

(async function () {
    try {
        console.log("Starting seed");
        await main({
            ...seedData,
            campaignSeedData: {
                ...seedData.campaignSeedData,
                publicId: crypto.randomUUID(),
            }
        });
        console.log("Seed finished with no errors");
    } catch (err) {
        console.error(err);
    }
})();
