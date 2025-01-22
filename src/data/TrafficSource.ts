import { Prisma, TrafficSource } from "@prisma/client";
import db from "../lib/db";
import { parseToken, parseNamedTokens, makeStorerFuncs } from ".";
import { trafficSourceSchema } from "../lib/schemas";
import { EItemName, TTrafficSource, TTrafficSource_createRequest, TTrafficSource_updateRequest } from "../lib/types";

const {
    getAllFunc: getAllTrafficSources,
    getByIdFunc: getTrafficSourceById,
    createNewFunc,
    updateByIdFunc,
    deleteByIdFunc: deleteTrafficSourceById,
    deleteManyFunc: deleteManyTrafficSources,
    countFunc: countTrafficSources,
} = makeStorerFuncs<TrafficSource, TTrafficSource, Prisma.TrafficSourceUncheckedCreateInput, Prisma.TrafficSourceUpdateInput, Prisma.TrafficSourceCountArgs>(
    EItemName.TRAFFIC_SOURCE,
    db.trafficSource,
    makeClientTrafficSource,
    trafficSourceSchema
);

const createNewTrafficSource = async (createReq: TTrafficSource_createRequest) => createNewFunc(
    toTrafficSourceCreateInput(createReq)
);

const updateTrafficSourceById = async (id: number, updateReq: TTrafficSource_updateRequest) => updateByIdFunc(
    id,
    toTrafficSourceUpdateInput(updateReq)
);

export {
    getAllTrafficSources,
    getTrafficSourceById,
    createNewTrafficSource,
    updateTrafficSourceById,
    deleteTrafficSourceById,
    deleteManyTrafficSources,
    countTrafficSources,
};

async function makeClientTrafficSource(dbModel: TrafficSource): Promise<TTrafficSource> {
    const externalIdTokenProm = parseToken(dbModel.externalIdToken);
    const costTokenProm = parseToken(dbModel.costToken);
    const customTokensProm = parseNamedTokens(dbModel.customTokens);
    return {
        ...dbModel,
        primaryItemName: EItemName.TRAFFIC_SOURCE,
        externalIdToken: await externalIdTokenProm,
        costToken: await costTokenProm,
        customTokens: await customTokensProm,
    };
}

function toTrafficSourceCreateInput(createReq: TTrafficSource_createRequest): Prisma.TrafficSourceUncheckedCreateInput {
    const { externalIdToken, costToken, customTokens } = createReq;
    return {
        ...createReq,
        externalIdToken: JSON.stringify(externalIdToken),
        costToken: JSON.stringify(costToken),
        customTokens: JSON.stringify(customTokens),
    };
}

function toTrafficSourceUpdateInput(updateReq: TTrafficSource_updateRequest): Prisma.TrafficSourceUpdateInput {
    const { externalIdToken, costToken, customTokens } = updateReq;
    return {
        ...updateReq,
        externalIdToken: externalIdToken ? JSON.stringify(externalIdToken) : undefined,
        costToken: costToken ? JSON.stringify(costToken) : undefined,
        customTokens: customTokens ? JSON.stringify(customTokens) : undefined,
    };
}
