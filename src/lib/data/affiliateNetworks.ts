import { z } from 'zod';
import prisma from '../db';
import cache from '../cache';
import { IAffiliateNetwork, IAffiliateNetwork_createRequest, IAffiliateNetwork_updateRequest } from '../types';

const affiliateNetworkSchema = z.object({
    id: z.number(),
    name: z.string(),
    defaultNewOfferString: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date()
});

type TAffiliateNetwork = z.infer<typeof affiliateNetworkSchema>;

export async function getAllAffiliateNetworks(): Promise<IAffiliateNetwork[]> {
    return prisma.affiliateNetwork.findMany();
}

export async function getAffiliateNetworkById(id: number): Promise<IAffiliateNetwork | null> {
    // Check redis cache for this affiliate network
    const key = `affiliateNetwork:${id}`;
    const cachedResult = await cache?.get(key);
    console.log(typeof cachedResult === 'string' ? 'hit' : 'miss');

    // If found in the cache, parse and return it
    const { data, success } = affiliateNetworkSchema.safeParse(cachedResult);
    if (success) return data;

    // If not in cache, query db for it
    const affiliateNetworkProm = prisma.affiliateNetwork.findUnique({
        where: { id }
    });

    // If we fetch from the db successfully, create a new key for this affiliate network in the cache
    affiliateNetworkProm.then(affiliateNetwork => {
        if (affiliateNetwork && cache) {
            cache.set(key, JSON.stringify(affiliateNetwork), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return affiliateNetworkProm;
}

export async function createNewAffiliateNetwork(affNetReqest: IAffiliateNetwork_createRequest): Promise<IAffiliateNetwork> {
    return prisma.affiliateNetwork.create({
        data: { ...affNetReqest }
    });
    // if the creation was successful, create a new key for this new affiliate network in the cache
}

export async function updateAffiliateNetworkById(id: number, data: IAffiliateNetwork_updateRequest): Promise<IAffiliateNetwork> {
    return prisma.affiliateNetwork.update({
        where: { id },
        data
    });
    // if the update was successful, update the corresponding key for this affiliate network in the cache
}

export async function deleteAffiliateNetworkById(id: number): Promise<IAffiliateNetwork> {
    return prisma.affiliateNetwork.delete({
        where: { id }
    });
    // if the deletion was successful, delete the corresponding key for this affiliate network in the cache
}
