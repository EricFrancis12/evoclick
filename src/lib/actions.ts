"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRootUser } from "./auth";
import { JWT_EXPIRY, JWT_SECRET } from "./constants";
import * as data from "../data";
import {
    TUser, ECookieName, TClick,
    TAffiliateNetwork, TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest,
    TCampaign, TCampaign_createRequest, TCampaign_updateRequest,
    TFlow, TFlow_createRequest, TFlow_updateRequest,
    TLandingPage, TLandingPage_createRequest, TLandingPage_updateRequest,
    TOffer, TOffer_createRequest, TOffer_updateRequest,
    TTrafficSource, TTrafficSource_createRequest, TTrafficSource_updateRequest
} from "./types";

export async function loginAction(formData: FormData): Promise<TUser | null> {
    const username = getFormDataName(formData, "username");
    const password = getFormDataName(formData, "password");

    if (!username || !password) {
        throw new Error("Username and password are required");
    }

    try {
        if (username === process.env.ROOT_USERNAME && password === process.env.ROOT_PASSWORD) {
            const rootUser = generateRootUser();
            if (rootUser) {
                // Set JWT
                const token = jwt.sign({ isRootUser: true }, JWT_SECRET, {
                    expiresIn: JWT_EXPIRY,
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
            expiresIn: JWT_EXPIRY,
        });
        cookies().set(ECookieName.JWT, token);

        return user;
    } catch (err) {
        return null;
    }
}

export async function refreshAction(url: string) {
    revalidatePath(url);
}

export async function getClicksAction(args: Prisma.ClickFindManyArgs = {}, pathname?: string): Promise<TClick[]> {
    const prom = data.getClicks(args);
    refreshUrl(prom, pathname);
    return prom;
}

type CRUDOperations<CreationRequest, UpdateRequest, Result> = {
    readAll: () => Promise<Result[]>;
    readOne: (id: number) => Promise<Result | null>;
    create: (request: CreationRequest) => Promise<Result>;
    update: (id: number, request: UpdateRequest) => Promise<Result>;
    delete: (id: number) => Promise<Result>;
};

function createCUDActions<CreationRequest, UpdateRequest, Result>(
    operations: CRUDOperations<CreationRequest, UpdateRequest, Result>
) {
    return {
        readAllAction: async (pathname?: string): Promise<Result[]> => {
            const prom = operations.readAll();
            refreshUrl(prom, pathname);
            return prom;
        },
        readOneAction: async (id: number, pathname?: string): Promise<Result | null> => {
            const prom = operations.readOne(id);
            refreshUrl(prom, pathname);
            return prom;
        },
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

const affiliateNetworkOperations: CRUDOperations<TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest, TAffiliateNetwork> = {
    readAll: data.getAllAffiliateNetworks,
    readOne: data.getAffiliateNetworkById,
    create: data.createNewAffiliateNetwork,
    update: data.updateAffiliateNetworkById,
    delete: data.deleteAffiliateNetworkById,
};

const affiliateNetworkActions = createCUDActions(affiliateNetworkOperations);
export const getAllAffiliateNetworksAction = affiliateNetworkActions.readAllAction;
export const getOneAffiliateNetworkAction = affiliateNetworkActions.readOneAction;
export const createNewAffiliateNetworkAction = affiliateNetworkActions.createAction;
export const updateAffiliateNetworkAction = affiliateNetworkActions.updateAction;
export const deleteAffiliateNetworkAction = affiliateNetworkActions.deleteAction;

const campaignOperations: CRUDOperations<TCampaign_createRequest, TCampaign_updateRequest, TCampaign> = {
    readAll: data.getAllCampaigns,
    readOne: data.getCampaignById,
    create: data.createNewCampaign,
    update: data.updateCampaignById,
    delete: data.deleteCampaignById,
};

const campaignActions = createCUDActions(campaignOperations);
export const getAllCampaignsAction = campaignActions.readAllAction;
export const getOneCampaignAction = campaignActions.readOneAction;
export const createNewCampaignAction = campaignActions.createAction;
export const updateCampaignAction = campaignActions.updateAction;
export const deleteCampaignAction = campaignActions.deleteAction;

const flowOperations: CRUDOperations<TFlow_createRequest, TFlow_updateRequest, TFlow> = {
    readAll: data.getAllFlows,
    readOne: data.getFlowById,
    create: data.createNewFlow,
    update: data.updateFlowById,
    delete: data.deleteFlowById,
};

const flowActions = createCUDActions(flowOperations);
export const getAllFlowsAction = flowActions.readAllAction;
export const getOneFlowAction = flowActions.readOneAction;
export const createNewFlowAction = flowActions.createAction;
export const updateFlowAction = flowActions.updateAction;
export const deleteFlowAction = flowActions.deleteAction;

const landingPageOperations: CRUDOperations<TLandingPage_createRequest, TLandingPage_updateRequest, TLandingPage> = {
    readAll: data.getAllLandingPages,
    readOne: data.getLandingPageById,
    create: data.createNewLandingPage,
    update: data.updateLandingPageById,
    delete: data.deleteLandingPageById,
};

const landingPageActions = createCUDActions(landingPageOperations);
export const getAllLandingPagesAction = landingPageActions.readAllAction;
export const getOneLandingPageAction = landingPageActions.readOneAction;
export const createNewLandingPageAction = landingPageActions.createAction;
export const updateLandingPageAction = landingPageActions.updateAction;
export const deleteLandingPageAction = landingPageActions.deleteAction;

const offerOperations: CRUDOperations<TOffer_createRequest, TOffer_updateRequest, TOffer> = {
    readAll: data.getAllOffers,
    readOne: data.getOfferById,
    create: data.createNewOffer,
    update: data.updateOfferById,
    delete: data.deleteOfferById,
};

const offerActions = createCUDActions(offerOperations);
export const getAllOffersAction = offerActions.readAllAction;
export const getOneOfferAction = offerActions.readOneAction;
export const createNewOfferAction = offerActions.createAction;
export const updateOfferAction = offerActions.updateAction;
export const deleteOfferAction = offerActions.deleteAction;

const trafficSourceOperations: CRUDOperations<TTrafficSource_createRequest, TTrafficSource_updateRequest, TTrafficSource> = {
    readAll: data.getAllTrafficSources,
    readOne: data.geTTrafficSourceById,
    create: data.createNewTrafficSource,
    update: data.updateTrafficSourceById,
    delete: data.deleteTrafficSourceById,
};

const trafficSourceActions = createCUDActions(trafficSourceOperations);
export const getAllTrafficSourcesAction = trafficSourceActions.readAllAction;
export const getOneTrafficSourceAction = trafficSourceActions.readOneAction;
export const createNewTrafficSourceAction = trafficSourceActions.createAction;
export const updateTrafficSourceAction = trafficSourceActions.updateAction;
export const deleteTrafficSourceAction = trafficSourceActions.deleteAction;

function refreshUrl(prom: Promise<any>, pathname?: string): void {
    if (pathname) prom.then(() => revalidatePath(pathname));
}

function getFormDataName(formData: FormData, name: string): string {
    return formData.get(name)?.toString() || "";
}
