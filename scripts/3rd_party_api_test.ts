import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import { IPInfoDataSchema } from "../src/lib/schemas";
import { iPInfoEndpoint, safeParseJson } from "../src/lib/utils";
import { Env } from "../src/lib/types";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const TEST_IP_ADDR = "104.47.216.167";

(async function () {
    if (!process.env[Env.IP_INFO_TOKEN]) throw new Error(`Environment varaible ${Env.IP_INFO_TOKEN} not set.`);

    try {
        console.log("Starting request");

        const { data } = await axios.get(iPInfoEndpoint(TEST_IP_ADDR, process.env[Env.IP_INFO_TOKEN]));

        console.log(data);

        const { success } = await IPInfoDataSchema.spa(data);

        if (success) {
            console.log("[PASS] Received the expected data from ipinfo.io");
        } else {
            console.error("[FAIL] IP Info Data does not adhere to the known schema");
        }
    } catch (err) {
        console.error(err);
    }
})();
