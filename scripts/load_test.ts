import dotenv from "dotenv";
import { argv } from "process";
import http from "http";
import path from "path";
import { campaignSeedData } from "../prisma/seedData";
import { makeCampaignUrl } from "../src/lib/utils";
import { Env } from "../src/lib/types";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env[Env.API_PORT]) throw new Error(`Environment variable ${Env.API_PORT} not set.`);

const URL = makeCampaignUrl("http:", "localhost", process.env[Env.API_PORT], campaignSeedData.publicId, []);
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
