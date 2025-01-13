import { argv } from "process";
import http from "http";
import seedData from "../prisma/seedData";
import { makeCampaignUrl, returnFirstOrThrow } from "../src/lib/utils";
import { dotenvConfig } from "../src/lib/utils/env";
import { Env } from "../src/lib/types";

dotenvConfig();

if (!process.env[Env.API_PORT]) throw new Error(`Environment variable ${Env.API_PORT} not set.`);

const { publicId } = returnFirstOrThrow(seedData.campaignSeeds, "Campaign seed");

const URL = makeCampaignUrl("http:", "localhost", process.env[Env.API_PORT], publicId, []);
const DURATION = 30_000; // ms

(async function () {
    if (!argv?.[2]) {
        console.error("Please provide the number of clicks as an argument");
        return;
    }

    const numRequestsPerMinute = parseInt(argv[2]);
    if (!numRequestsPerMinute) {
        console.error("Argument must be a number");
        return;
    }

    console.log(`Running load test with ${numRequestsPerMinute} requests per minute to ${URL}`);

    let running = true;
    let count = 0;

    setTimeout(() => running = false, DURATION);

    const interval = setInterval(() => console.log(`Running total: ${count} http requests sent`), 2000);

    while (running) {
        const req = http.request(URL);
        req.on("error", err => console.error(`Problem with request: ${err.message}`));
        count++;

        await new Promise(resolve => setTimeout(resolve, 60_000 / numRequestsPerMinute));
        req.end();
    }

    clearInterval(interval);

    console.log(`Load test finished.\nSent ${count} http requests accross ${DURATION} ms`);
})();
