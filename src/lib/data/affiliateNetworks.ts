import cache from '../cache';
import db from '../db';
import { affiliateNetworkSchema } from '../schemas';
import { AffiliateNetwork, AffiliateNetwork_createRequest, AffiliateNetwork_updateRequest } from '../types';
import { initMakeRedisKey } from '../utils';

const makeKey = initMakeRedisKey('affiliateNetwork');

export async function getAllAffiliateNetworks(): Promise<AffiliateNetwork[]> {
    return db.affiliateNetwork.findMany();
}

export async function getAffiliateNetworkById(id: number): Promise<AffiliateNetwork | null> {
    // Check redis cache for this affiliate network
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await affiliateNetworkSchema.safeParseAsync(cachedResult);
        if (success) return data;
    }

    // If not in cache, query db for it
    const affiliateNetworkProm = db.affiliateNetwork.findUnique({
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

export async function createNewAffiliateNetwork(affNetReqest: AffiliateNetwork_createRequest): Promise<AffiliateNetwork> {
    const affiliateNetworkProm = db.affiliateNetwork.create({
        data: { ...affNetReqest }
    });

    // If the creation was successful, create a new key for this new affiliate network in the cache
    affiliateNetworkProm.then(affiliateNetwork => {
        if (affiliateNetwork && cache) {
            const key = makeKey(affiliateNetwork.id);
            cache.set(key, JSON.stringify(affiliateNetwork), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return affiliateNetworkProm;
}

export async function updateAffiliateNetworkById(id: number, data: AffiliateNetwork_updateRequest): Promise<AffiliateNetwork> {
    const affiliateNetworkProm = db.affiliateNetwork.update({
        where: { id },
        data
    });

    // If the update was successful, update the corresponding key for this affiliate network in the cache
    affiliateNetworkProm.then(affiliateNetwork => {
        if (affiliateNetwork && cache) {
            const key = makeKey(affiliateNetwork.id);
            cache.set(key, JSON.stringify(affiliateNetwork), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return affiliateNetworkProm;
}

export async function deleteAffiliateNetworkById(id: number): Promise<AffiliateNetwork> {
    // Delete the corresponding key for this affiliate network in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    return db.affiliateNetwork.delete({
        where: { id }
    });
}
