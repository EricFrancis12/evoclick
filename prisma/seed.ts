// Do not use the "@/" syntax when importing anything into this file
// because the seed command that runs this file "npx prisma db seed"
// uses ts-node under the hood,
// and it's not able to recognize that syntax in the current tsconfig.
import { PrismaClient } from "@prisma/client";
import db from "../src/lib/db";
import main from "./main";
import seedData from "./seedData";

main(seedData)
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        if (db instanceof PrismaClient) {
            await db.$disconnect();
        }
    });
