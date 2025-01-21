import { Prisma, Click } from "@prisma/client";
import db from "../lib/db";
import { clickSchema } from "../lib/schemas";
import { TClick, TClick_createRequest, TClick_updateRequest } from "../lib/types";
import { parseTokens, makeStorerFuncs } from ".";

// export async function getAllClicks(args: Prisma.ClickFindManyArgs = {}): Promise<TClick[]> {
//     const clicks: Click[] = await db.click.findMany(args);
//     const proms: Promise<TClick>[] = clicks.map(makeClientClick);
//     return Promise.all(proms);
// }

// export async function countAllClicks(args: Prisma.ClickCountArgs = {}): Promise<number> {
//     return db.click.count(args);
// }

// export async function deleteManyClicks(args: Prisma.ClickDeleteManyArgs = {}): Promise<number> {
//     const { count } = await db.click.deleteMany(args);
//     return count;
// }

// export async function deleteClicksByIds(ids: number[]): Promise<number> {
//     return deleteManyClicks({
//         where: {
//             id: {
//                 in: ids,
//             },
//         },
//     });
// }

const {
    getAllFunc: getAllClicks,
    getByIdFunc: getClickById,
    createNewFunc,
    updateByIdFunc,
    deleteByIdFunc: deleteClickById,
    deleteManyFunc: deleteManyClicks,
    countFunc: countClicks,
} = makeStorerFuncs<Click, TClick, Prisma.ClickUncheckedCreateInput, Prisma.ClickUpdateInput, Prisma.ClickCountArgs>(
    "Click",
    db.click,
    makeClientClick,
    clickSchema
);

const createNewClick = async (createReq: TClick_createRequest) => createNewFunc(
    toClickCreateInput(createReq)
);

const updateClickById = async (id: number, updateReq: TClick_updateRequest) => updateByIdFunc(
    id,
    toClickUpdateInput(updateReq)
);

export {
    getAllClicks,
    getClickById,
    createNewClick,
    updateClickById,
    deleteClickById,
    deleteManyClicks,
    countClicks,
};

async function makeClientClick(dbModel: Click): Promise<TClick> {
    return {
        ...dbModel,
        tokens: await parseTokens(dbModel.tokens),
    };
}

function toClickCreateInput(createReq: TClick_createRequest): Prisma.ClickUncheckedCreateInput {
    const { tokens } = createReq;
    return {
        ...createReq,
        publicId: crypto.randomUUID() as string,
        tokens: JSON.stringify(tokens),
    };
}

function toClickUpdateInput(updateReq: TClick_updateRequest): Prisma.ClickUpdateInput {
    const { tokens } = updateReq;
    return {
        ...updateReq,
        tokens: tokens ? JSON.stringify(tokens) : undefined,
    };
}
