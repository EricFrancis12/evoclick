import { Prisma, Click } from "@prisma/client";
import db from "../lib/db";
import { parseTokens } from ".";
import { TClick } from "../lib/types";

export async function getAllClicks(args: Prisma.ClickFindManyArgs = {}): Promise<TClick[]> {
    const clicks: Click[] = await db.click.findMany(args);
    const proms: Promise<TClick>[] = clicks.map(makeClientClick);
    return Promise.all(proms);
}

export async function countAllClicks(args: Prisma.ClickCountArgs = {}): Promise<number> {
    return db.click.count(args);
}

export async function deleteAllClicks(args: Prisma.ClickDeleteManyArgs = {}): Promise<number> {
    const { count } = await db.click.deleteMany(args);
    return count;
}

export async function deleteClicksByIds(ids: number[]): Promise<number> {
    return deleteAllClicks({
        where: {
            id: {
                in: ids,
            },
        },
    });
}

async function makeClientClick(dbModel: Click): Promise<TClick> {
    return {
        ...dbModel,
        tokens: await parseTokens(dbModel.tokens),
    };
}
