import { Flow } from '@prisma/client';
import { z } from 'zod';
import cache from '../cache';
import db from '../db';
import { flowSchema, routeSchema } from '../schemas';
import { ELogicalRelation, TFlow, TFlow_createRequest, TFlow_updateRequest, TRoute } from '../types';
import { initMakeRedisKey } from '../utils';

const makeKey = initMakeRedisKey('flow');

export async function getAllFlows(): Promise<TFlow[]> {
    const flows: Flow[] = await db.flow.findMany();
    const proms: Promise<TFlow>[] = flows.map(flow => makeClientFlow(flow));
    return Promise.all(proms);
}

export async function getFlowById(id: number): Promise<TFlow | null> {
    // Check redis cache for this flow
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await flowSchema.safeParseAsync(cachedResult);
        if (success) return data;
    }

    // If not in cache, query db for it
    const flowProm = db.flow.findUnique({
        where: { id }
    });

    // If we fetch from the db successfully, create a new key for this flow in the cache
    flowProm.then(flow => {
        if (flow && cache) {
            cache.set(key, JSON.stringify(flow), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return flowProm.then(flow => flow ? makeClientFlow(flow) : null);
}

export async function createNewFlow(creationRequest: TFlow_createRequest): Promise<TFlow> {
    const flowProm = db.flow.create({
        data: {
            ...creationRequest,
            // Changing mainRoute and ruleRoutes into strings because
            // they are saved as strings in the db
            mainRoute: JSON.stringify(creationRequest.mainRoute),
            ruleRoutes: JSON.stringify(creationRequest.ruleRoutes)
        }
    });

    // If the creation was successful, create a new key for this new flow in the cache
    flowProm.then(flow => {
        if (flow && cache) {
            const key = makeKey(flow.id);
            cache.set(key, JSON.stringify(flow), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return flowProm.then(flow => makeClientFlow(flow));
}

export async function updateFlowById(id: number, data: TFlow_updateRequest): Promise<TFlow> {
    const flowProm = db.flow.update({
        where: { id },
        data: {
            ...data,
            // Changing mainRoute and ruleRoutes into strings because
            // they are saved as strings in the db
            mainRoute: JSON.stringify(data.mainRoute),
            ruleRoutes: JSON.stringify(data.ruleRoutes)
        }
    });

    // If the update was successful, update the corresponding key for this flow in the cache
    flowProm.then(flow => {
        if (flow && cache) {
            const key = makeKey(flow.id);
            cache.set(key, JSON.stringify(flow), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return flowProm.then(flow => makeClientFlow(flow));
}

export async function deleteFlowById(id: number): Promise<TFlow> {
    // Delete the corresponding key for this flow in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    const flowProm = db.flow.delete({
        where: { id }
    });

    return flowProm.then(flow => makeClientFlow(flow));
}

async function makeClientFlow(dbModel: Flow): Promise<TFlow> {
    const mainRouteProm = parseRoute(dbModel.mainRoute);
    const ruleRoutesProm = parseRoutes(dbModel.ruleRoutes);
    return {
        ...dbModel,
        mainRoute: await mainRouteProm,
        ruleRoutes: await ruleRoutesProm
    };
}

async function parseRoute(jsonStr: string | null): Promise<TRoute | null> {
    const { success, data } = await routeSchema.safeParseAsync(jsonStr);
    return success ? data : null;
}

async function parseRoutes(jsonStr: string | null): Promise<TRoute[]> {
    const { success, data } = await z.array(routeSchema).safeParseAsync(jsonStr);
    return success ? data : [];
}
