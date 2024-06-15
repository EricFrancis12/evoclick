// Do not use the "@/" syntax when importing here
// because the seed command that runs this file "npx prisma db seed"
// uses ts-node under the hood,
// and it's not able to recognize that syntax in the current tsconfig.
import prisma from '../src/lib/db';
import bcrypt from 'bcrypt';
import { IAffiliateNetwork_createRequest } from '../src/lib/types';
import { SALT_ROUNDS } from '@/lib/constants';

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
    const hashedPassword = await bcrypt.hash('1234', SALT_ROUNDS);
    await prisma.user.create({
        data: {
            name: 'root',
            hashedPassword,
            role: 'ADMIN',
        }
    });

    await prisma.affiliateNetwork.createMany({
        data: affiliateNetworks,
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
