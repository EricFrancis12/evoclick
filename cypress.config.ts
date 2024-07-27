import { defineConfig } from "cypress";
import { dotenvConfig } from "./src/lib/utils/env";

const [env, envLocal] = dotenvConfig();

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        // Non-sensitive env vars hard-coded here. Example:
        // LOGIN_URL: "/login",

        // Sensitive env vars read in above from external file
        ...env.parsed,
        ...envLocal.parsed,
    },
});
