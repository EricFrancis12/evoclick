import { TrafficSource } from "@prisma/client";
import cache from "../lib/cache";
import db from "../lib/db";
import { parseToken, parseNamedTokens, makeBoilerplateToken } from ".";
import { trafficSourceSchema } from "../lib/schemas";
import { TTrafficSource, TTrafficSource_createRequest, TTrafficSource_updateRequest } from "../lib/types";
import { initMakeRedisKey } from "../lib/utils";

const makeKey = initMakeRedisKey("trafficSource");

export async function getAllTrafficSources(): Promise<TTrafficSource[]> {
    const trafficSources: TrafficSource[] = await db.trafficSource.findMany();
    const proms: Promise<TTrafficSource>[] = trafficSources.map(ts => makeClientTrafficSource(ts));
    return Promise.all(proms);
}

export async function geTTrafficSourceById(id: number): Promise<TTrafficSource | null> {
    // Check redis cache for this traffic source
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await trafficSourceSchema.safeParseAsync(cachedResult);
        if (success) return data;
    }

    // If not in cache, query db for it
    const trafficSourceProm = db.trafficSource.findUnique({
        where: { id },
    });

    // If we fetch from the db successfully, create a new key for this traffic source in the cache
    trafficSourceProm.then(trafficSource => {
        if (trafficSource && cache) {
            cache.set(key, JSON.stringify(trafficSource), {
                EX: 60, // Exipry time in seconds
            });
        }
    });

    return trafficSourceProm.then(ts => ts ? makeClientTrafficSource(ts) : null);
}

export async function createNewTrafficSource(creationRequest: TTrafficSource_createRequest): Promise<TTrafficSource> {
    const trafficSourceProm = db.trafficSource.create({
        data: {
            ...creationRequest,
            // Changing defaultTokens and customTokens into strings because
            // they are saved as strings in the db
            externalIdToken: JSON.stringify(creationRequest.externalIdToken),
            costToken: JSON.stringify(creationRequest.costToken),
            customTokens: JSON.stringify(creationRequest.customTokens),
        }
    });

    // If the creation was successful, create a new key for this new traffic source in the cache
    trafficSourceProm.then(trafficSource => {
        if (trafficSource && cache) {
            const key = makeKey(trafficSource.id);
            cache.set(key, JSON.stringify(trafficSource), {
                EX: 60, // Exipry time in seconds
            });
        }
    });

    return trafficSourceProm.then(ts => makeClientTrafficSource(ts));
}

export async function updateTrafficSourceById(id: number, data: TTrafficSource_updateRequest): Promise<TTrafficSource> {
    const trafficSourceProm = db.trafficSource.update({
        where: { id },
        data: {
            ...data,
            // Changing defaultTokens and customTokens into strings (if defined) because
            // they are saved as strings in the db
            externalIdToken: data.externalIdToken ? JSON.stringify(data.externalIdToken) : undefined,
            costToken: data.costToken ? JSON.stringify(data.costToken) : undefined,
            customTokens: data.customTokens ? JSON.stringify(data.customTokens) : undefined,
        }
    });

    // If the update was successful, update the corresponding key for this traffic source in the cache
    trafficSourceProm.then(trafficSource => {
        if (trafficSource && cache) {
            const key = makeKey(trafficSource.id);
            cache.set(key, JSON.stringify(trafficSource), {
                EX: 60, // Exipry time in seconds
            });
        }
    });

    return trafficSourceProm.then(ts => makeClientTrafficSource(ts));
}

export async function deleteTrafficSourceById(id: number): Promise<TTrafficSource> {
    // Delete the corresponding key for this traffic source in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    const trafficSourceProm = db.trafficSource.delete({
        where: { id },
    });

    return trafficSourceProm.then(ts => makeClientTrafficSource(ts));
}

async function makeClientTrafficSource(dbModel: TrafficSource): Promise<TTrafficSource> {
    const externalIdTokenProm = parseToken(dbModel.externalIdToken);
    const costTokenProm = parseToken(dbModel.costToken);
    const customTokensProm = parseNamedTokens(dbModel.customTokens);
    return {
        ...dbModel,
        externalIdToken: await externalIdTokenProm,
        costToken: await costTokenProm,
        customTokens: await customTokensProm,
    };
}
