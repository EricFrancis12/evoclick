import { Prisma, Click } from "@prisma/client";
import db from "../lib/db";
import { parseTokens } from ".";
import { TClick } from "../lib/types";

export async function getAllClicks(args: Prisma.ClickFindManyArgs = {}): Promise<TClick[]> {
    const clicks: Click[] = await db.click.findMany(args);
    const proms: Promise<TClick>[] = clicks.map(makeClientClick);
    return Promise.all(proms);
}

async function makeClientClick(dbModel: Click): Promise<TClick> {
    const tokensProm = parseTokens(dbModel.tokens);
    return {
        ...dbModel,
        tokens: await tokensProm,
    };
}
