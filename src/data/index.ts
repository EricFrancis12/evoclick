import { z } from "zod";
import { Prisma, AffiliateNetwork, Campaign, SavedFlow, LandingPage, Offer, TrafficSource, Click } from "@prisma/client";
import cache, { makeRedisKeyFunc, RedisKeyFunc } from "../lib/cache";
import { tokenSchema, namedTokenSchema, routeSchema } from "../lib/schemas";
import { safeParseJson, newRoute, newToken } from "@/lib/utils";
import { REDIS_EXPIRY } from "@/lib/constants";
import { TPrimaryItem, TToken, TNamedToken, TRoute, TClick } from "../lib/types";

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
    | Prisma.XOR<Prisma.TrafficSourceCreateInput, Prisma.TrafficSourceUncheckedCreateInput>
    | Prisma.XOR<Prisma.ClickCreateInput, Prisma.ClickUncheckedCreateInput>;

type UpdateInput =
    Prisma.XOR<Prisma.AffiliateNetworkUpdateInput, Prisma.AffiliateNetworkUncheckedUpdateInput>
    | Prisma.XOR<Prisma.CampaignUpdateInput, Prisma.CampaignUncheckedUpdateInput>
    | Prisma.XOR<Prisma.SavedFlowUpdateInput, Prisma.SavedFlowUncheckedUpdateInput>
    | Prisma.XOR<Prisma.LandingPageUpdateInput, Prisma.LandingPageUncheckedUpdateInput>
    | Prisma.XOR<Prisma.OfferUpdateInput, Prisma.OfferUncheckedUpdateInput>
    | Prisma.XOR<Prisma.TrafficSourceUpdateInput, Prisma.TrafficSourceUncheckedUpdateInput>
    | Prisma.XOR<Prisma.ClickUpdateInput, Prisma.ClickUncheckedUpdateInput>;

type WhereInput =
    Prisma.AffiliateNetworkWhereInput
    | Prisma.CampaignWhereInput
    | Prisma.SavedFlowWhereInput
    | Prisma.LandingPageWhereInput
    | Prisma.OfferWhereInput
    | Prisma.TrafficSourceWhereInput
    | Prisma.ClickWhereInput;

export type ManyArg = {
    skip?: number;
    take?: number;
    where?: {
        id?: {
            in?: number[];
        };
        NOT?: WhereInput;
        AND?: WhereInput[];
    } | WhereInput;
};

export type CountArg =
    Prisma.AffiliateNetworkCountArgs
    | Prisma.CampaignCountArgs
    | Prisma.SavedFlowCountArgs
    | Prisma.LandingPageCountArgs
    | Prisma.OfferCountArgs
    | Prisma.TrafficSourceCountArgs
    | Prisma.ClickCountArgs;

class DemoStorer<M extends PrismaModel, CI extends CreateInput, UI extends UpdateInput, CA extends CountArg> {
    async findMany(arg: ManyArg): Promise<M[]> {
        // TODO: ...
    }

    async findUnique(arg: { where: { id: number } }): Promise<M | null> {
        // TODO: ...
    }

    async create(arg: { data: CI }): Promise<M> {
        // TODO: ...
    }

    async update(arg: { where: { id: number }, data: UI }): Promise<M> {
        // TODO: ...
    }

    async delete(arg: { where: { id: number } }): Promise<M> {
        // TODO: ...
    }

    async deleteMany(arg: ManyArg): Promise<Prisma.BatchPayload> {
        // TODO: ...
    }

    async count(arg?: CA): Promise<number> {
        // TODO: ...
    }
}

export class DemoDB {
    affiliateNetwork: IStorer<AffiliateNetwork, Prisma.AffiliateNetworkUncheckedCreateInput, Prisma.AffiliateNetworkUpdateInput, Prisma.AffiliateNetworkCountArgs>;
    campaign: IStorer<Campaign, Prisma.CampaignUncheckedCreateInput, Prisma.CampaignUpdateInput, Prisma.CampaignCountArgs>;
    savedFlow: IStorer<SavedFlow, Prisma.SavedFlowUncheckedCreateInput, Prisma.SavedFlowUpdateInput, Prisma.SavedFlowCountArgs>;
    landingPage: IStorer<LandingPage, Prisma.LandingPageUncheckedCreateInput, Prisma.LandingPageUpdateInput, Prisma.LandingPageCountArgs>;
    offer: IStorer<Offer, Prisma.OfferUncheckedCreateInput, Prisma.OfferUpdateInput, Prisma.OfferCountArgs>;
    trafficSource: IStorer<TrafficSource, Prisma.TrafficSourceUncheckedCreateInput, Prisma.TrafficSourceUpdateInput, Prisma.TrafficSourceCountArgs>;
    click: IStorer<Click, Prisma.ClickUncheckedCreateInput, Prisma.ClickUpdateInput, Prisma.ClickCountArgs>;

    constructor() {
        this.affiliateNetwork = new DemoStorer<AffiliateNetwork, Prisma.AffiliateNetworkUncheckedCreateInput, Prisma.AffiliateNetworkUpdateInput, Prisma.AffiliateNetworkCountArgs>();
        this.campaign = new DemoStorer<Campaign, Prisma.CampaignUncheckedCreateInput, Prisma.CampaignUpdateInput, Prisma.CampaignCountArgs>();
        this.savedFlow = new DemoStorer<SavedFlow, Prisma.SavedFlowUncheckedCreateInput, Prisma.SavedFlowUpdateInput, Prisma.SavedFlowCountArgs>();
        this.landingPage = new DemoStorer<LandingPage, Prisma.LandingPageUncheckedCreateInput, Prisma.LandingPageUpdateInput, Prisma.LandingPageCountArgs>();
        this.offer = new DemoStorer<Offer, Prisma.OfferUncheckedCreateInput, Prisma.OfferUpdateInput, Prisma.OfferCountArgs>();
        this.trafficSource = new DemoStorer<TrafficSource, Prisma.TrafficSourceUncheckedCreateInput, Prisma.TrafficSourceUpdateInput, Prisma.TrafficSourceCountArgs>();
        this.click = new DemoStorer<Click, Prisma.ClickUncheckedCreateInput, Prisma.ClickUpdateInput, Prisma.ClickCountArgs>();
    }
}

interface IStorer<M extends PrismaModel, CI extends CreateInput, UI extends UpdateInput, CA extends CountArg> {
    findMany: (arg: ManyArg) => Promise<M[]>;
    findUnique: (arg: { where: { id: number } }) => Promise<M | null>;
    create: (arg: { data: CI }) => Promise<M>;
    update: (arg: { where: { id: number }, data: UI }) => Promise<M>;
    delete: (arg: { where: { id: number } }) => Promise<M>;
    deleteMany: (arg: ManyArg) => Promise<Prisma.BatchPayload>;
    count: (arg?: CA) => Promise<number>;
}

interface PISchema<PI extends (TPrimaryItem | TClick)> {
    spa: (data: unknown, params?: Partial<Zod.ParseParams> | undefined) => Promise<Zod.SafeParseReturnType<PI, PI>>;
}

type PrismaModel = AffiliateNetwork | Campaign | SavedFlow | LandingPage | Offer | TrafficSource | Click;

type MakeClientFunc<PI extends (TPrimaryItem | TClick), M extends PrismaModel> = (m: M) => Promise<PI>;

export function makeStorerFuncs<
    M extends PrismaModel,
    PI extends (TPrimaryItem | TClick),
    CI extends CreateInput,
    UI extends UpdateInput,
    CA extends CountArg
>(
    name: string,
    storer: IStorer<M, CI, UI, CA>,
    makeClient: MakeClientFunc<PI, M>,
    schema: PISchema<PI>
): {
    getAllFunc: (arg?: ManyArg) => Promise<PI[]>;
    getByIdFunc: (id: number) => Promise<PI | null>;
    createNewFunc: (ci: CI) => Promise<PI>;
    updateByIdFunc: (id: number, ui: UI) => Promise<PI>;
    deleteByIdFunc: (id: number) => Promise<PI>;
    deleteManyFunc: (arg?: ManyArg) => Promise<Prisma.BatchPayload>;
    countFunc: (arg?: CA) => Promise<number>;
} {
    const makeKey = makeRedisKeyFunc(name);

    const getAllFunc = makeGetAllFunc(storer, makeClient);
    const getByIdFunc = makeGetByIdFunc(storer, makeClient, makeKey, schema);
    const createNewFunc = makeCreateNewFunc(storer, makeClient, makeKey);
    const updateByIdFunc = makeUpdateByIdFunc(storer, makeClient, makeKey);
    const deleteByIdFunc = makeDeleteByIdFunc(storer, makeClient, makeKey);
    const deleteManyFunc = makeDeleteManyFunc(storer, makeKey);
    const countFunc = makeCountFunc(storer);

    return {
        getAllFunc,
        getByIdFunc,
        createNewFunc,
        updateByIdFunc,
        deleteByIdFunc,
        deleteManyFunc,
        countFunc,
    };
}

function makeGetAllFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    PI extends (TPrimaryItem | TClick),
    CA extends CountArg
>(storer: IStorer<M, CI, UI, CA>, makeClient: MakeClientFunc<PI, M>): (arg?: ManyArg) => Promise<PI[]> {
    return async function (arg = {}) {
        const models: M[] = await storer.findMany(arg);
        const proms: Promise<PI>[] = models.map(makeClient);
        return Promise.all(proms);
    }
}

function makeGetByIdFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    PI extends (TPrimaryItem | TClick),
    CA extends CountArg
>(
    storer: IStorer<M, CI, UI, CA>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc, schema: PISchema<PI>
): (id: number) => Promise<PI | null> {
    return async function (id: number) {
        const key = makeKey(id);

        if (cache) {
            // Check redis cache
            const cachedResult = await cache.get(key);

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
    PI extends (TPrimaryItem | TClick),
    CA extends CountArg
>(storer: IStorer<M, CI, UI, CA>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc): (ci: CI) => Promise<PI> {
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
    PI extends (TPrimaryItem | TClick),
    CA extends CountArg
>(storer: IStorer<M, CI, UI, CA>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc): (id: number, data: UI) => Promise<PI> {
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
    PI extends (TPrimaryItem | TClick),
    CA extends CountArg
>(storer: IStorer<M, CI, UI, CA>, makeClient: MakeClientFunc<PI, M>, makeKey: RedisKeyFunc): (id: number) => Promise<PI> {
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

function makeDeleteManyFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    CA extends CountArg
>(storer: IStorer<M, CI, UI, CA>, makeKey: RedisKeyFunc): (arg?: ManyArg) => Promise<Prisma.BatchPayload> {
    return async function (arg = {}) {
        // Delete all matching keys for this item in the cache
        if (cache && typeof arg?.where?.id === "object" && Array.isArray(arg?.where?.id?.in)) {
            for (const id of arg.where.id.in) {
                const key = makeKey(id);
                cache.del(key);
            }
        }

        return storer.deleteMany(arg);
    }
}

function makeCountFunc<
    M extends PrismaModel,
    CI extends CreateInput,
    UI extends UpdateInput,
    CA extends CountArg
>(storer: IStorer<M, CI, UI, CA>): (arg?: CA) => Promise<number> {
    return async function (arg) {
        return storer.count(arg);
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
