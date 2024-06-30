
import cache from '../lib/cache';
import db from '../lib/db';
import { landingPageSchema } from '../lib/schemas';
import { TLandingPage, TLandingPage_createRequest, TLandingPage_updateRequest } from '../lib/types';
import { initMakeRedisKey } from '../lib/utils';

const makeKey = initMakeRedisKey('landingPage');

export async function getAllLandingPages(): Promise<TLandingPage[]> {
    return db.landingPage.findMany();
}

export async function getLandingPageById(id: number): Promise<TLandingPage | null> {
    // Check redis cache for this landing page
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await landingPageSchema.safeParseAsync(cachedResult);
        if (success) return data;
    }

    // If not in cache, query db for it
    const landingPageProm = db.landingPage.findUnique({
        where: { id }
    });

    // If we fetch from the db successfully, create a new key for this landing page in the cache
    landingPageProm.then(landingPage => {
        if (landingPage && cache) {
            cache.set(key, JSON.stringify(landingPage), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return landingPageProm;
}

export async function createNewLandingPage(creationRequest: TLandingPage_createRequest): Promise<TLandingPage> {
    const landingPageProm = db.landingPage.create({
        data: { ...creationRequest }
    });

    // If the creation was successful, create a new key for this new landing page in the cache
    landingPageProm.then(landingPage => {
        if (landingPage && cache) {
            const key = makeKey(landingPage.id);
            cache.set(key, JSON.stringify(landingPage), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return landingPageProm;
}

export async function updateLandingPageById(id: number, data: TLandingPage_updateRequest): Promise<TLandingPage> {
    const landingPageProm = db.landingPage.update({
        where: { id },
        data
    });

    // If the update was successful, update the corresponding key for this landing page in the cache
    landingPageProm.then(landingPage => {
        if (landingPage && cache) {
            const key = makeKey(landingPage.id);
            cache.set(key, JSON.stringify(landingPage), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return landingPageProm;
}

export async function deleteLandingPageById(id: number): Promise<TLandingPage> {
    // Delete the corresponding key for this landing page in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    return db.landingPage.delete({
        where: { id }
    });
}
