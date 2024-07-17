import crypto from "crypto";
import { Campaign } from "@prisma/client";
import { newRoute } from "@/app/dashboard/ReportView/FlowBuilder/Route";
import cache, { makeRedisKeyFunc } from "../lib/cache";
import db from "../lib/db";
import { parseRoute, parseRoutes } from ".";
import { campaignSchema } from "../lib/schemas";
import { safeParseJson } from "../lib/utils";
import { REDIS_EXPIRY } from "../lib/constants";
import { TCampaign, TCampaign_createRequest, TCampaign_updateRequest } from "../lib/types";

const makeKey = makeRedisKeyFunc("campaign");

export async function getAllCampaigns(): Promise<TCampaign[]> {
    const campaigns: Campaign[] = await db.campaign.findMany();
    const proms: Promise<TCampaign>[] = campaigns.map(campaign => makeClientCampaign(campaign));
    return Promise.all(proms);
}

export async function getCampaignById(id: number): Promise<TCampaign | null> {
    // Check redis cache for this campaign
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await campaignSchema.spa(safeParseJson(cachedResult));
        if (success) return data;
    }

    // If not in cache, query db for it
    const campaignProm = db.campaign.findUnique({
        where: { id },
    });

    // If we fetch from the db successfully, create a new key for this campaign in the cache
    campaignProm.then(campaign => {
        if (campaign && cache) {
            cache.set(key, JSON.stringify(campaign), {
                EX: REDIS_EXPIRY,
            });
        }
    });

    return campaignProm.then(campaign => campaign ? makeClientCampaign(campaign) : null);
}

export async function createNewCampaign(creationRequest: TCampaign_createRequest): Promise<TCampaign> {
    const campaignProm = db.campaign.create({
        data: {
            ...creationRequest,
            publicId: crypto.randomUUID() as string,
            // Changing flowMainRoute and flowRuleRoutes into strings because
            // they are saved as strings in the db
            flowMainRoute: JSON.stringify(creationRequest.flowMainRoute),
            flowRuleRoutes: JSON.stringify(creationRequest.flowRuleRoutes),
        }
    });

    // If the creation was successful, create a new key for this new campaign in the cache
    campaignProm.then(campaign => {
        if (campaign && cache) {
            const key = makeKey(campaign.id);
            cache.set(key, JSON.stringify(campaign), {
                EX: REDIS_EXPIRY,
            });
        }
    });

    return campaignProm.then(campaign => makeClientCampaign(campaign));
}

export async function updateCampaignById(id: number, data: TCampaign_updateRequest): Promise<TCampaign> {
    const campaignProm = db.campaign.update({
        where: { id },
        data: {
            ...data,
            // Changing flowMainRoute and flowRuleRoutes into strings because
            // they are saved as strings in the db
            flowMainRoute: JSON.stringify(data.flowMainRoute),
            flowRuleRoutes: JSON.stringify(data.flowRuleRoutes),
        }
    });

    // If the update was successful, update the corresponding key for this campaign in the cache
    campaignProm.then(campaign => {
        if (campaign && cache) {
            const key = makeKey(campaign.id);
            cache.set(key, JSON.stringify(campaign), {
                EX: REDIS_EXPIRY,
            });
        }
    });

    return campaignProm.then(campaign => makeClientCampaign(campaign));
}

export async function deleteCampaignById(id: number): Promise<TCampaign> {
    // Delete the corresponding key for this campaign in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    const campaignProm = db.campaign.delete({
        where: { id },
    });

    return campaignProm.then(campaign => makeClientCampaign(campaign));
}

async function makeClientCampaign(dbModel: Campaign): Promise<TCampaign> {
    const { flowMainRoute, flowRuleRoutes } = dbModel;
    return {
        ...dbModel,
        flowMainRoute: flowMainRoute ? await parseRoute(flowMainRoute) : newRoute(),
        flowRuleRoutes: flowRuleRoutes ? await parseRoutes(flowRuleRoutes) : [],
    };
}
