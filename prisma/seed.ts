// Do not use the "@/" syntax when importing anything into this file
// because the seed command that runs this file "npx prisma db seed"
// uses ts-node under the hood,
// and it's not able to recognize that syntax in the current tsconfig.
import prisma from '../src/lib/db';
import bcrypt from 'bcrypt';
import { IAffiliateNetwork_createRequest } from '../src/lib/types';
import { SALT_ROUNDS } from '../src/lib/constants';

const affiliateNetworks: IAffiliateNetwork_createRequest[] = [
    {
        name: 'Max Bounty',
        tags: [],
        defaultNewOfferString: ''
    },
    {
        name: 'CPA Grip',
        tags: [],
        defaultNewOfferString: ''
    },
    {
        name: 'Perform CB',
        tags: [],
        defaultNewOfferString: ''
    }
];

async function main() {
    if (!process.env.ROOT_USERNAME || !process.env.ROOT_PASSWORD) {
        throw new Error('ROOT_USERNAME and ROOT_PASSWORD are required');
    }

    const hashedPassword = await bcrypt.hash(process.env.ROOT_PASSWORD, SALT_ROUNDS);
    await prisma.user.create({
        data: {
            name: process.env.ROOT_USERNAME,
            hashedPassword
        }
    });

    await prisma.affiliateNetwork.createMany({
        data: affiliateNetworks
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
