import { Prisma, SavedFlow } from "@prisma/client";
import db from "../lib/db";
import { makeStorerFuncs, parseRoute, parseRoutes } from ".";
import { savedFlowSchema } from "../lib/schemas";
import { EItemName, TSavedFlow, TSavedFlow_createRequest, TSavedFlow_updateRequest } from "../lib/types";

const {
    getAllFunc: getAllFlows,
    getByIdFunc: getFlowById,
    createNewFunc,
    updateByIdFunc,
    deleteByIdFunc: deleteFlowById,
} = makeStorerFuncs<SavedFlow, TSavedFlow, Prisma.SavedFlowUncheckedCreateInput, Prisma.SavedFlowUpdateInput>(
    EItemName.FLOW,
    db.savedFlow,
    makeClientFlow,
    savedFlowSchema
);

const createNewFlow = async (createReq: TSavedFlow_createRequest) => createNewFunc(
    toSavedFlowCreateInput(createReq)
);

const updateFlowById = async (id: number, updateReq: TSavedFlow_updateRequest) => updateByIdFunc(
    id,
    toSavedFlowUpdateInput(updateReq)
);

export {
    getAllFlows,
    getFlowById,
    createNewFlow,
    updateFlowById,
    deleteFlowById,
};

async function makeClientFlow(dbModel: SavedFlow): Promise<TSavedFlow> {
    const { mainRoute, ruleRoutes } = dbModel;
    const mainRouteProm = parseRoute(mainRoute);
    const ruleRoutesProm = parseRoutes(ruleRoutes);
    return {
        ...dbModel,
        primaryItemName: EItemName.FLOW,
        mainRoute: await mainRouteProm,
        ruleRoutes: await ruleRoutesProm,
    };
}

function toSavedFlowCreateInput(createReq: TSavedFlow_createRequest): Prisma.SavedFlowUncheckedCreateInput {
    const { mainRoute, ruleRoutes } = createReq;
    return {
        ...createReq,
        mainRoute: JSON.stringify(mainRoute),
        ruleRoutes: JSON.stringify(ruleRoutes),
    };
}

function toSavedFlowUpdateInput(updateReq: TSavedFlow_updateRequest): Prisma.SavedFlowUpdateInput {
    const { mainRoute, ruleRoutes } = updateReq;
    return {
        ...updateReq,
        mainRoute: mainRoute ? JSON.stringify(mainRoute) : undefined,
        ruleRoutes: ruleRoutes ? JSON.stringify(ruleRoutes) : undefined,
    };
}
