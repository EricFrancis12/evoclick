import { argv } from "process";
import http from "http";
import { campaignSeedData } from "../prisma/seedData";
import { makeCampaignUrl } from "../src/lib/utils";
import { Env } from "../src/lib/types";

if (!process.env[Env.API_PORT]) throw new Error("Environment varaible API_PORT not set.");

const url = makeCampaignUrl("http:", "localhost", process.env[Env.API_PORT], campaignSeedData.publicId);
const duration = 30_000; // ms

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

    console.log(`Running load test with ${numRequestsPerMinute} requests per minute to ${url}`);

    let running = true;
    let count = 0;

    setTimeout(() => running = false, duration);

    const interval = setInterval(() => console.log(`Running total: ${count} http requests sent`), 2000);

    while (running) {
        const req = http.request(url);
        req.on('error', err => console.error(`Problem with request: ${err.message}`));
        count++;

        await new Promise(resolve => setTimeout(resolve, 60_000 / numRequestsPerMinute));
        req.end();
    }

    clearInterval(interval);

    console.log(`Load test finished.\nSent ${count} http requests accross ${duration} ms`);
})();
