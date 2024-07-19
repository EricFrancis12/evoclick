// Do not use the "@/" syntax when importing anything into this file
// because the seed command that runs this file "npx prisma db seed"
// uses ts-node under the hood,
// and it's not able to recognize that syntax in the current tsconfig.
import prisma from "../src/lib/db";
import seedData, { main } from "./seedData";

main(seedData)
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
