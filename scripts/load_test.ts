import { argv } from "process";
import http from "http";
import { campaignSeedData } from "../prisma/seedData";
import { makeCampaignUrl } from "../src/lib/utils";

const url = makeCampaignUrl("http:", "localhost", "3001", campaignSeedData.publicId);
const duration = 30_000; // ms

(async function () {
    if (argv.length < 2) {
        console.error("Please provide the number of requests per minute as an argument");
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
