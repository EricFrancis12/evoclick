import cache from "../lib/cache";
import db from "../lib/db";
import { affiliateNetworkSchema } from "../lib/schemas";
import { TAffiliateNetwork, TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest } from "../lib/types";
import { initMakeRedisKey, safeParseJson } from "../lib/utils";

const makeKey = initMakeRedisKey("affiliateNetwork");

export async function getAllAffiliateNetworks(): Promise<TAffiliateNetwork[]> {
    return db.affiliateNetwork.findMany();
}

export async function getAffiliateNetworkById(id: number): Promise<TAffiliateNetwork | null> {
    // Check redis cache for this affiliate network
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await affiliateNetworkSchema.spa(safeParseJson(cachedResult));
        if (success) return data;
    }

    // If not in cache, query db for it
    const affiliateNetworkProm = db.affiliateNetwork.findUnique({
        where: { id },
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

export async function createNewAffiliateNetwork(creationRequest: TAffiliateNetwork_createRequest): Promise<TAffiliateNetwork> {
    const affiliateNetworkProm = db.affiliateNetwork.create({
        data: { ...creationRequest },
    });

    // If the creation was successful, create a new key for this new affiliate network in the cache
    affiliateNetworkProm.then(affiliateNetwork => {
        if (affiliateNetwork && cache) {
            const key = makeKey(affiliateNetwork.id);
            cache.set(key, JSON.stringify(affiliateNetwork), {
                EX: 60, // Exipry time in seconds
            });
        }
    });

    return affiliateNetworkProm;
}

export async function updateAffiliateNetworkById(id: number, data: TAffiliateNetwork_updateRequest): Promise<TAffiliateNetwork> {
    const affiliateNetworkProm = db.affiliateNetwork.update({
        where: { id },
        data,
    });

    // If the update was successful, update the corresponding key for this affiliate network in the cache
    affiliateNetworkProm.then(affiliateNetwork => {
        if (affiliateNetwork && cache) {
            const key = makeKey(affiliateNetwork.id);
            cache.set(key, JSON.stringify(affiliateNetwork), {
                EX: 60, // Exipry time in seconds
            });
        }
    });

    return affiliateNetworkProm;
}

export async function deleteAffiliateNetworkById(id: number): Promise<TAffiliateNetwork> {
    // Delete the corresponding key for this affiliate network in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    return db.affiliateNetwork.delete({
        where: { id },
    });
}
