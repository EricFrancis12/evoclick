import crypto from "crypto";
import { Prisma, Campaign } from "@prisma/client";
import db from "../lib/db";
import { makeStorerFuncs, parseRoute, parseRoutes } from ".";
import { campaignSchema } from "../lib/schemas";
import { newRoute } from "../lib/utils";
import { EItemName, TCampaign, TCampaign_createRequest, TCampaign_updateRequest } from "../lib/types";

const {
    getAllFunc: getAllCampaigns,
    getByIdFunc: getCampaignById,
    createNewFunc,
    updateByIdFunc,
    deleteByIdFunc: deleteCampaignById,
    deleteManyFunc: deleteManyCampaigns,
    countFunc: countCampaigns,
} = makeStorerFuncs<Campaign, TCampaign, Prisma.CampaignUncheckedCreateInput, Prisma.CampaignUpdateInput, Prisma.CampaignCountArgs>(
    EItemName.TRAFFIC_SOURCE,
    db.campaign,
    makeClientCampaign,
    campaignSchema
);

const createNewCampaign = async (createReq: TCampaign_createRequest) => createNewFunc(
    toCampaignCreateInput(createReq)
);

const updateCampaignById = async (id: number, updateReq: TCampaign_updateRequest) => updateByIdFunc(
    id,
    toCampaignUpdateInput(updateReq)
);

export {
    getAllCampaigns,
    getCampaignById,
    createNewCampaign,
    updateCampaignById,
    deleteCampaignById,
    deleteManyCampaigns,
    countCampaigns,
};


async function makeClientCampaign(dbModel: Campaign): Promise<TCampaign> {
    const flowMainRouteProm = dbModel.flowMainRoute ? parseRoute(dbModel.flowMainRoute) : newRoute();
    const flowRuleRoutesProm = dbModel.flowRuleRoutes ? parseRoutes(dbModel.flowRuleRoutes) : [];
    return {
        ...dbModel,
        primaryItemName: EItemName.CAMPAIGN,
        flowMainRoute: await flowMainRouteProm,
        flowRuleRoutes: await flowRuleRoutesProm,
    };
}

function toCampaignCreateInput(createReq: TCampaign_createRequest): Prisma.CampaignUncheckedCreateInput {
    const flowMainRoute = createReq.flowMainRoute ?? newRoute();
    const flowRuleRoutes = createReq.flowRuleRoutes ?? [];
    return {
        ...createReq,
        publicId: crypto.randomUUID() as string,
        flowMainRoute: JSON.stringify(flowMainRoute),
        flowRuleRoutes: JSON.stringify(flowRuleRoutes),
    };
}

function toCampaignUpdateInput(updateReq: TCampaign_updateRequest): Prisma.CampaignUpdateInput {
    const { flowMainRoute, flowRuleRoutes } = updateReq;
    return {
        ...updateReq,
        flowMainRoute: flowMainRoute ? JSON.stringify(flowMainRoute) : undefined,
        flowRuleRoutes: flowRuleRoutes ? JSON.stringify(flowRuleRoutes) : undefined,
    };
}
