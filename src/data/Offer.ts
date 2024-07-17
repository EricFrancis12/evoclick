import cache, { makeRedisKeyFunc } from "../lib/cache";
import db from "../lib/db";
import { offersSchema } from "../lib/schemas";
import { REDIS_EXPIRY } from "../lib/constants";
import { safeParseJson } from "../lib/utils";
import { TOffer, TOffer_createRequest, TOffer_updateRequest } from "../lib/types";

const makeKey = makeRedisKeyFunc("offer");

export async function getAllOffers(): Promise<TOffer[]> {
    return db.offer.findMany();
}

export async function getOfferById(id: number): Promise<TOffer | null> {
    // Check redis cache for this offer
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await offersSchema.spa(safeParseJson(cachedResult));
        if (success) return data;
    }

    // If not in cache, query db for it
    const offerProm = db.offer.findUnique({
        where: { id },
    });

    // If we fetch from the db successfully, create a new key for this offer in the cache
    offerProm.then(offer => {
        if (offer && cache) {
            cache.set(key, JSON.stringify(offer), {
                EX: REDIS_EXPIRY,
            });
        }
    });

    return offerProm;
}

export async function createNewOffer(creationRequest: TOffer_createRequest): Promise<TOffer> {
    const offerProm = db.offer.create({
        data: { ...creationRequest },
    });

    // If the creation was successful, create a new key for this new offer in the cache
    offerProm.then(offer => {
        if (offer && cache) {
            const key = makeKey(offer.id);
            cache.set(key, JSON.stringify(offer), {
                EX: REDIS_EXPIRY,
            });
        }
    });

    return offerProm;
}

export async function updateOfferById(id: number, data: TOffer_updateRequest): Promise<TOffer> {
    const offerProm = db.offer.update({
        where: { id },
        data,
    });

    // If the update was successful, update the corresponding key for this offer in the cache
    offerProm.then(offer => {
        if (offer && cache) {
            const key = makeKey(offer.id);
            cache.set(key, JSON.stringify(offer), {
                EX: REDIS_EXPIRY,
            });
        }
    });

    return offerProm;
}

export async function deleteOfferById(id: number): Promise<TOffer> {
    // Delete the corresponding key for this offer in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    return db.offer.delete({
        where: { id },
    });
}
