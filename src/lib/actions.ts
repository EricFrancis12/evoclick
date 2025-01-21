"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateRootUser from "./auth/generateRootUser";
import { JWT_EXPIRY, JWT_SECRET } from "./constants";
import * as data from "../data";
import {
    Env, TUser, ECookieName, TClick,
    TAffiliateNetwork, TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest,
    TCampaign, TCampaign_createRequest, TCampaign_updateRequest,
    TSavedFlow, TSavedFlow_createRequest, TSavedFlow_updateRequest,
    TLandingPage, TLandingPage_createRequest, TLandingPage_updateRequest,
    TOffer, TOffer_createRequest, TOffer_updateRequest,
    TTrafficSource, TTrafficSource_createRequest, TTrafficSource_updateRequest,
    TClick_createRequest,
    TClick_updateRequest
} from "./types";

export async function loginAction(formData: FormData): Promise<TUser | null> {
    const username = getFormDataName(formData, "username");
    const password = getFormDataName(formData, "password");

    if (!username || !password) {
        throw new Error("Username and password are required");
    }

    try {
        if (username === process.env[Env.ROOT_USERNAME] && password === process.env[Env.ROOT_PASSWORD]) {
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

export async function revalidatePathAction(url: string) {
    revalidatePath(url);
}

type CRUDOperations<CreationRequest, UpdateRequest, CA extends data.CountArg, Result> = {
    readAll: () => Promise<Result[]>;
    readOne: (id: number) => Promise<Result | null>;
    create: (request: CreationRequest) => Promise<Result>;
    update: (id: number, request: UpdateRequest) => Promise<Result>;
    delete: (id: number) => Promise<Result>;
    deleteMany: (arg: data.ManyArg) => Promise<Prisma.BatchPayload>;
    count: (arg?: CA) => Promise<number>;
};

function createCRUDActions<CreationRequest, UpdateRequest, CA extends data.CountArg, Result>(
    operations: CRUDOperations<CreationRequest, UpdateRequest, CA, Result>
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
        },
        deleteManyAction: async (arg: data.ManyArg = {}, pathname?: string): Promise<Prisma.BatchPayload> => {
            const prom = operations.deleteMany(arg);
            refreshUrl(prom, pathname);
            return prom;
        },
        countAction: async (arg: CA, pathname?: string): Promise<number> => {
            const prom = operations.count();
            refreshUrl(prom, pathname);
            return prom;
        },
    };
}

const affiliateNetworkOperations: CRUDOperations<TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest, Prisma.AffiliateNetworkCountArgs, TAffiliateNetwork> = {
    readAll: data.getAllAffiliateNetworks,
    readOne: data.getAffiliateNetworkById,
    create: data.createNewAffiliateNetwork,
    update: data.updateAffiliateNetworkById,
    delete: data.deleteAffiliateNetworkById,
    deleteMany: data.deleteManyAffiliateNetworks,
    count: data.countAffiliateNetworks,
};

const affiliateNetworkActions = createCRUDActions(affiliateNetworkOperations);
export const getAllAffiliateNetworksAction = affiliateNetworkActions.readAllAction;
export const getOneAffiliateNetworkAction = affiliateNetworkActions.readOneAction;
export const createNewAffiliateNetworkAction = affiliateNetworkActions.createAction;
export const updateAffiliateNetworkAction = affiliateNetworkActions.updateAction;
export const deleteAffiliateNetworkAction = affiliateNetworkActions.deleteAction;

const campaignOperations: CRUDOperations<TCampaign_createRequest, TCampaign_updateRequest, Prisma.CampaignCountArgs, TCampaign> = {
    readAll: data.getAllCampaigns,
    readOne: data.getCampaignById,
    create: data.createNewCampaign,
    update: data.updateCampaignById,
    delete: data.deleteCampaignById,
    deleteMany: data.deleteManyCampaigns,
    count: data.countCampaigns,
};

const campaignActions = createCRUDActions(campaignOperations);
export const getAllCampaignsAction = campaignActions.readAllAction;
export const getOneCampaignAction = campaignActions.readOneAction;
export const createNewCampaignAction = campaignActions.createAction;
export const updateCampaignAction = campaignActions.updateAction;
export const deleteCampaignAction = campaignActions.deleteAction;

const flowOperations: CRUDOperations<TSavedFlow_createRequest, TSavedFlow_updateRequest, Prisma.SavedFlowCountArgs, TSavedFlow> = {
    readAll: data.getAllFlows,
    readOne: data.getFlowById,
    create: data.createNewFlow,
    update: data.updateFlowById,
    delete: data.deleteFlowById,
    deleteMany: data.deleteManyFlows,
    count: data.countFlows,
};

const flowActions = createCRUDActions(flowOperations);
export const getAllFlowsAction = flowActions.readAllAction;
export const getOneFlowAction = flowActions.readOneAction;
export const createNewFlowAction = flowActions.createAction;
export const updateFlowAction = flowActions.updateAction;
export const deleteFlowAction = flowActions.deleteAction;

const landingPageOperations: CRUDOperations<TLandingPage_createRequest, TLandingPage_updateRequest, Prisma.LandingPageCountArgs, TLandingPage> = {
    readAll: data.getAllLandingPages,
    readOne: data.getLandingPageById,
    create: data.createNewLandingPage,
    update: data.updateLandingPageById,
    delete: data.deleteLandingPageById,
    deleteMany: data.deleteManyLandingPages,
    count: data.countLandingPages,
};

const landingPageActions = createCRUDActions(landingPageOperations);
export const getAllLandingPagesAction = landingPageActions.readAllAction;
export const getOneLandingPageAction = landingPageActions.readOneAction;
export const createNewLandingPageAction = landingPageActions.createAction;
export const updateLandingPageAction = landingPageActions.updateAction;
export const deleteLandingPageAction = landingPageActions.deleteAction;

const offerOperations: CRUDOperations<TOffer_createRequest, TOffer_updateRequest, Prisma.OfferCountArgs, TOffer> = {
    readAll: data.getAllOffers,
    readOne: data.getOfferById,
    create: data.createNewOffer,
    update: data.updateOfferById,
    delete: data.deleteOfferById,
    deleteMany: data.deleteManyOffers,
    count: data.countOffers,
};

const offerActions = createCRUDActions(offerOperations);
export const getAllOffersAction = offerActions.readAllAction;
export const getOneOfferAction = offerActions.readOneAction;
export const createNewOfferAction = offerActions.createAction;
export const updateOfferAction = offerActions.updateAction;
export const deleteOfferAction = offerActions.deleteAction;

const trafficSourceOperations: CRUDOperations<TTrafficSource_createRequest, TTrafficSource_updateRequest, Prisma.TrafficSourceCountArgs, TTrafficSource> = {
    readAll: data.getAllTrafficSources,
    readOne: data.getTrafficSourceById,
    create: data.createNewTrafficSource,
    update: data.updateTrafficSourceById,
    delete: data.deleteTrafficSourceById,
    deleteMany: data.deleteManyTrafficSources,
    count: data.countTrafficSources,
};

const trafficSourceActions = createCRUDActions(trafficSourceOperations);
export const getAllTrafficSourcesAction = trafficSourceActions.readAllAction;
export const getOneTrafficSourceAction = trafficSourceActions.readOneAction;
export const createNewTrafficSourceAction = trafficSourceActions.createAction;
export const updateTrafficSourceAction = trafficSourceActions.updateAction;
export const deleteTrafficSourceAction = trafficSourceActions.deleteAction;

const ClickOperations: CRUDOperations<TClick_createRequest, TClick_updateRequest, Prisma.ClickCountArgs, TClick> = {
    readAll: data.getAllClicks,
    readOne: data.getClickById,
    create: data.createNewClick,
    update: data.updateClickById,
    delete: data.deleteClickById,
    deleteMany: data.deleteManyClicks,
    count: data.countClicks,
};

const clickActions = createCRUDActions(ClickOperations);
export const getAllClicksAction = clickActions.readAllAction;
export const getOneClickAction = clickActions.readOneAction;
export const createNewClickAction = clickActions.createAction;
export const updateClickAction = clickActions.updateAction;
export const deleteClickAction = clickActions.deleteAction;
export const deleteManyClicksAction = clickActions.deleteManyAction;
export const countClicksAction = clickActions.countAction;

// export async function getClicksAction(args: Prisma.ClickFindManyArgs = {}, pathname?: string): Promise<TClick[]> {
//     const prom = data.getAllClicks(args);
//     refreshUrl(prom, pathname);
//     return prom;
// }

// export async function deleteManyClicksAction(args: Prisma.ClickDeleteManyArgs = {}, pathname?: string): Promise<Prisma.BatchPayload> {
//     const prom = data.deleteManyClicks(args);
//     refreshUrl(prom, pathname);
//     return prom;
// }

// export async function deleteClicksByIdsAction(ids: number[], pathname?: string): Promise<Prisma.BatchPayload> {
//     const prom = data.deleteClicksByIds(ids);
//     refreshUrl(prom, pathname);
//     return prom;
// }

function refreshUrl(prom: Promise<unknown>, pathname?: string): void {
    if (pathname) prom.then(() => revalidatePath(pathname));
}

function getFormDataName(formData: FormData, name: string): string {
    return formData.get(name)?.toString() || "";
}
