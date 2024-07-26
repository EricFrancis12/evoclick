import { z } from "zod";
import cache, { makeRedisKeyFunc, RedisKeyFunc } from "../lib/cache";
import { tokenSchema, namedTokenSchema, routeSchema } from "../lib/schemas";
import { safeParseJson, newRoute, newToken } from "@/lib/utils";
import { REDIS_EXPIRY } from "@/lib/constants";
import { Prisma, AffiliateNetwork, Campaign, SavedFlow, LandingPage, Offer, TrafficSource } from "@prisma/client";
import { TPrimaryItem, TPrimaryItemName, TToken, TNamedToken, TRoute } from "../lib/types";

export * from "./User";
export * from "./AffiliateNetwork";
export * from "./Campaign";
export * from "./Click";
export * from "./Flow";
export * from "./LandingPage";
export * from "./Offer";
export * from "./TrafficSource";

type CreateInput =
    Prisma.XOR<Prisma.AffiliateNetworkCreateInput, Prisma.AffiliateNetworkUncheckedCreateInput>
    | Prisma.XOR<Prisma.CampaignCreateInput, Prisma.CampaignUncheckedCreateInput>
    | Prisma.XOR<Prisma.SavedFlowCreateInput, Prisma.SavedFlowUncheckedCreateInput>
    | Prisma.XOR<Prisma.LandingPageCreateInput, Prisma.LandingPageUncheckedCreateInput>
    | Prisma.XOR<Prisma.OfferCreateInput, Prisma.OfferUncheckedCreateInput>
    | Prisma.XOR<Prisma.TrafficSourceCreateInput, Prisma.TrafficSourceUncheckedCreateInput>;

type UpdateInput =
    Prisma.XOR<Prisma.AffiliateNetworkUpdateInput, Prisma.AffiliateNetworkUncheckedUpdateInput>
    | Prisma.XOR<Prisma.CampaignUpdateInput, Prisma.CampaignUncheckedUpdateInput>
    | Prisma.XOR<Prisma.SavedFlowUpdateInput, Prisma.SavedFlowUncheckedUpdateInput>
    | Prisma.XOR<Prisma.LandingPageUpdateInput, Prisma.LandingPageUncheckedUpdateInput>
    | Prisma.XOR<Prisma.OfferUpdateInput, Prisma.OfferUncheckedUpdateInput>
    | Prisma.XOR<Prisma.TrafficSourceUpdateInput, Prisma.TrafficSourceUncheckedUpdateInput>;

interface IStorer<M extends PrismaModel, CI extends CreateInput, UI extends UpdateInput> {
    findMany: () => Promise<M[]>;
    findUnique: (arg: { where: { id: number } }) => Promise<M | null>;
    create: (arg: { data: CI }) => Promise<M>;
    update: (arg: { where: { id: number }, data: UI }) => Promise<M>;
    delete: (arg: { where: { id: number } }) => Promise<M>;
}

interface PISchema<PI extends TPrimaryItem> {
    spa: (data: unknown, params?: Partial<Zod.ParseParams> | undefined) => Promise<Zod.SafeParseReturnType<PI, PI>>;
}

type PrismaModel = AffiliateNetwork | Campaign | SavedFlow | LandingPage | Offer | TrafficSource;

type MakeClientFunc<PI extends TPrimaryItem, M extends PrismaModel> = (m: M) => Promise<PI>;

export function makeStorerFuncs<
    M extends PrismaModel,
    PI extends TPrimaryItem,
    CI extends CreateInput,
    UI extends UpdateInput
>(
    primaryItemName: TPrimaryItemName,
    storer: IStorer<M, CI, UI>,
    makeClient: MakeClientFunc<PI, M>,
    schema: PISchema<PI>
): {
    getAllFunc: () => Promise<PI[]>;
    getByIdFunc: (id: number) => Promise<PI | null>;
    createNewFunc: (ci: CI) => Promise<PI>;
    updateByIdFunc: (id: number, ui: UI) => Promise<PI>;
    deleteByIdFunc: (id: number) => Promise<PI>;
} {
    const makeKey = makeRedisKeyFunc(primaryItemName);

    const getAllFunc = makeGetAllFunc(storer, makeClient);
    const getByIdFunc = makeGetByIdFunc(storer, makeClient, makeKey, schema);
    const createNewFunc = makeCreateNewFunc(storer, makeClient, makeKey);
    const updateByIdFunc = makeUpdateByIdFunc(storer, makeClient, makeKey);
    const deleteByIdFunc = makeDeleteByIdFunc(storer, makeClient, makeKey);

    return {
        getAllFunc,
        getByIdFunc,
        createNewFunc,
        updateByIdFunc,
        deleteByIdFunc,
    };
}

function makeGetAllFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    PI extends TPrimaryItem
>(storer: IStorer<M, CI, UI>, makeClient: MakeClientFunc<PI, M>): () => Promise<PI[]> {
    return async function () {
        const models: M[] = await storer.findMany();
        const proms: Promise<PI>[] = models.map(makeClient);
        return Promise.all(proms);
    }
}

function makeGetByIdFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    PI extends TPrimaryItem
>(
    storer: IStorer<M, CI, UI>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc, schema: PISchema<PI>
): (id: number) => Promise<PI | null> {
    return async function (id: number) {
        const key = makeKey(id);

        if (cache) {
            // Check redis cache
            const cachedResult = await cache?.get(key);

            // If found in the cache, parse and return it
            if (cachedResult != null) {
                const { data, success } = await schema.spa(safeParseJson(cachedResult));
                if (success) return data;
            }
        }

        // If not in cache, query db for it
        const prom = storer.findUnique({
            where: { id },
        });

        // If we fetch from the db successfully, create a new key for this item in the cache
        prom.then(item => {
            if (item && cache) {
                cache.set(key, JSON.stringify(item), {
                    EX: REDIS_EXPIRY,
                });
            }
        });

        return prom.then(item => item ? makeClient(item) : null);
    }
}

function makeCreateNewFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    PI extends TPrimaryItem
>(storer: IStorer<M, CI, UI>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc): (ci: CI) => Promise<PI> {
    return async function (data: CI) {
        const prom = storer.create({ data });

        // If the creation was successful, create a new key for this new item in the cache
        prom.then(item => {
            if (item && cache) {
                const key = makeKey(item.id);
                cache.set(key, JSON.stringify(item), {
                    EX: REDIS_EXPIRY,
                });
            }
        });

        return prom.then(makeClient);
    }
}

function makeUpdateByIdFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    PI extends TPrimaryItem
>(storer: IStorer<M, CI, UI>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc): (id: number, data: UI) => Promise<PI> {
    return async function (id: number, data: UI) {
        const prom = storer.update({
            where: { id },
            data,
        });

        // If the update was successful, update the corresponding key for this item in the cache
        prom.then(item => {
            if (item && cache) {
                const key = makeKey(item.id);
                cache.set(key, JSON.stringify(item), {
                    EX: REDIS_EXPIRY,
                });
            }
        });

        return prom.then(makeClient);
    }
}

function makeDeleteByIdFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    PI extends TPrimaryItem
>(storer: IStorer<M, CI, UI>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc): (id: number) => Promise<PI> {
    return async function (id: number) {
        // Delete the corresponding key for this item in the cache
        if (cache) {
            const key = makeKey(id);
            cache.del(key);
        }

        const prom = storer.delete({
            where: { id },
        });

        return prom.then(makeClient);
    }
}

export async function parseRoute(jsonStr: string): Promise<TRoute> {
    const { success, data } = await routeSchema.spa(safeParseJson(jsonStr));
    return success ? data : newRoute();
}

export async function parseRoutes(jsonStr: string): Promise<TRoute[]> {
    const { success, data } = await z.array(routeSchema).spa(safeParseJson(jsonStr));
    return success ? data : [];
}

export async function parseToken(jsonStr: string): Promise<TToken> {
    const { success, data } = await tokenSchema.spa(safeParseJson(jsonStr));
    return success ? data : newToken();
}

export async function parseTokens(jsonStr: string): Promise<TToken[]> {
    const { success, data } = await z.array(tokenSchema).spa(safeParseJson(jsonStr));
    return success ? data : [];
}

export async function parseNamedTokens(jsonStr: string): Promise<TNamedToken[]> {
    const { success, data } = await z.array(namedTokenSchema).spa(safeParseJson(jsonStr));
    return success ? data : [];
}
