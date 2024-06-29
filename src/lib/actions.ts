'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateRootUser } from './auth';
import { JWT_EXPIRY, JWT_SECRET } from './constants';
import * as data from './data';
import {
    TUser, ECookieName,
    TAffiliateNetwork, TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest,
    TCampaign, TCampaign_createRequest, TCampaign_updateRequest,
    TFlow, TFlow_createRequest, TFlow_updateRequest,
    TLandingPage, TLandingPage_createRequest, TLandingPage_updateRequest,
    TOffer, TOffer_createRequest, TOffer_updateRequest,
    TTrafficSource, TTrafficSource_createRequest, TTrafficSource_updateRequest
} from './types';

export async function loginAction(formData: FormData): Promise<TUser | null> {
    const username = getFormDataName(formData, 'username');
    const password = getFormDataName(formData, 'password');

    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    try {
        if (username === process.env.ROOT_USERNAME && password === process.env.ROOT_PASSWORD) {
            const rootUser = generateRootUser();
            if (rootUser) {
                // Set JWT
                const token = jwt.sign({ isRootUser: true }, JWT_SECRET, {
                    expiresIn: JWT_EXPIRY
                });
                cookies().set(ECookieName.JWT, token);

                return rootUser;
            }
        }

        const user = await data.getUserByName(username);
        if (!user) {
            return null;
        }

        if (!await bcrypt.compare(password, user.hashedPassword)) {
            return null;
        }

        // Set JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY
        });
        cookies().set(ECookieName.JWT, token);

        return user;
    } catch (err) {
        return null;
    }
}

type CUDOperations<CreationRequest, UpdateRequest, Result> = {
    create: (request: CreationRequest) => Promise<Result>;
    update: (id: number, request: UpdateRequest) => Promise<Result>;
    delete: (id: number) => Promise<Result>;
};

function createCUDActions<CreationRequest, UpdateRequest, Result>(
    operations: CUDOperations<CreationRequest, UpdateRequest, Result>
) {
    return {
        createAction: async (creationRequest: CreationRequest, pathname?: string): Promise<Result> => {
            const prom = operations.create(creationRequest);
            refreshUrl(prom, pathname);
            return prom;
        },
        updateAction: async (id: number, updateRequest: UpdateRequest, pathname?: string): Promise<Result> => {
            const prom = operations.update(id, updateRequest);
            refreshUrl(prom, pathname);
            return prom;
        },
        deleteAction: async (id: number, pathname?: string): Promise<Result> => {
            const prom = operations.delete(id);
            refreshUrl(prom, pathname);
            return prom;
        }
    };
}

const affiliateNetworkOperations: CUDOperations<TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest, TAffiliateNetwork> = {
    create: data.createNewAffiliateNetwork,
    update: data.updateAffiliateNetworkById,
    delete: data.deleteAffiliateNetworkById
};

export const {
    createAction: createNewAffiliateNetworkAction,
    updateAction: updateAffiliateNetworkAction,
    deleteAction: deleteAffiliateNetworkAction
} = createCUDActions(affiliateNetworkOperations);

const campaignOperations: CUDOperations<TCampaign_createRequest, TCampaign_updateRequest, TCampaign> = {
    create: data.createNewCampaign,
    update: data.updateCampaignById,
    delete: data.deleteCampaignById
};

export const {
    createAction: createNewCampaignAction,
    updateAction: updateCampaignAction,
    deleteAction: deleteCampaignAction
} = createCUDActions(campaignOperations);

const flowOperations: CUDOperations<TFlow_createRequest, TFlow_updateRequest, TFlow> = {
    create: data.createNewFlow,
    update: data.updateFlowById,
    delete: data.deleteFlowById
};

export const {
    createAction: createNewFlowAction,
    updateAction: updateFlowAction,
    deleteAction: deleteFlowAction
} = createCUDActions(flowOperations);

const landingPageOperations: CUDOperations<TLandingPage_createRequest, TLandingPage_updateRequest, TLandingPage> = {
    create: data.createNewLandingPage,
    update: data.updateLandingPageById,
    delete: data.deleteLandingPageById
};

export const {
    createAction: createNewLandingPageAction,
    updateAction: updateLandingPageAction,
    deleteAction: deleteLandingPageAction
} = createCUDActions(landingPageOperations);

const offerOperations: CUDOperations<TOffer_createRequest, TOffer_updateRequest, TOffer> = {
    create: data.createNewOffer,
    update: data.updateOfferById,
    delete: data.deleteOfferById
};

export const {
    createAction: createNewOfferAction,
    updateAction: updateOfferAction,
    deleteAction: deleteOfferAction
} = createCUDActions(offerOperations);

const trafficSourceOperations: CUDOperations<TTrafficSource_createRequest, TTrafficSource_updateRequest, TTrafficSource> = {
    create: data.createNewTrafficSource,
    update: data.updateTrafficSourceById,
    delete: data.deleteTrafficSourceById
};

export const {
    createAction: createNewTrafficSourceAction,
    updateAction: updateTrafficSourceAction,
    deleteAction: deleteTrafficSourceAction
} = createCUDActions(trafficSourceOperations);

function refreshUrl(prom: Promise<any>, pathname?: string): void {
    if (pathname) prom.then(() => revalidatePath(pathname));
}

function getFormDataName(formData: FormData, name: string): string {
    return formData.get(name)?.toString() || '';
}
