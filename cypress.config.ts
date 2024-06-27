import { defineConfig } from 'cypress';
import path from 'path';
import dotenv from 'dotenv';

const env = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const envLocal = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        // Non-sensitive env vars hard-coded here. Example:
        // LOGIN_URL: '/login',

        // Sensitive env vars read in above from external file
        ...env.parsed,
        ...envLocal.parsed,
    },
});
