import crypto from 'crypto';
import cache from '../cache';
import db from '../db';
import { campaignSchema } from '../schemas';
import { TCampaign, TCampaign_createRequest, TCampaign_updateRequest } from '../types';
import { initMakeRedisKey } from '../utils';

const makeKey = initMakeRedisKey('campaign');

export async function getAllCampaigns(): Promise<TCampaign[]> {
    return db.campaign.findMany();
}

export async function getCampaignById(id: number): Promise<TCampaign | null> {
    // Check redis cache for this campaign
    const key = makeKey(id);
    const cachedResult = await cache?.get(key);

    // If found in the cache, parse and return it
    if (cachedResult != null) {
        const { data, success } = await campaignSchema.safeParseAsync(cachedResult);
        if (success) return data;
    }

    // If not in cache, query db for it
    const campaignProm = db.campaign.findUnique({
        where: { id }
    });

    // If we fetch from the db successfully, create a new key for this campaign in the cache
    campaignProm.then(campaign => {
        if (campaign && cache) {
            cache.set(key, JSON.stringify(campaign), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return campaignProm;
}

export async function createNewCampaign(creationRequest: TCampaign_createRequest): Promise<TCampaign> {
    const campaignProm = db.campaign.create({
        data: {
            ...creationRequest,
            publicId: crypto.randomUUID() as string
        }
    });

    // If the creation was successful, create a new key for this new campaign in the cache
    campaignProm.then(campaign => {
        if (campaign && cache) {
            const key = makeKey(campaign.id);
            cache.set(key, JSON.stringify(campaign), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return campaignProm;
}

export async function updateCampaignById(id: number, data: TCampaign_updateRequest): Promise<TCampaign> {
    const campaignProm = db.campaign.update({
        where: { id },
        data
    });

    // If the update was successful, update the corresponding key for this campaign in the cache
    campaignProm.then(campaign => {
        if (campaign && cache) {
            const key = makeKey(campaign.id);
            cache.set(key, JSON.stringify(campaign), {
                EX: 60 // Exipry time in seconds
            });
        }
    });

    return campaignProm;
}

export async function deleteCampaignById(id: number): Promise<TCampaign> {
    // Delete the corresponding key for this campaign in the cache
    if (cache) {
        const key = makeKey(id);
        cache.del(key);
    }

    return db.campaign.delete({
        where: { id }
    });
}
