import { Prisma } from "@prisma/client";
import { decodeTimeframe, isPrimary } from "@/lib/utils";
import { clickPropsMap } from "@/lib/utils/maps";
import { EItemName } from "@/lib/types";
import { ManyArg } from "@/data";

export function decodeParams(params: {
    itemName?: string;
    id?: string;
}): { reportItemName: EItemName | null, reportItemId: string | null } {
    const { itemName, id } = params;
    return {
        reportItemName: itemName ? decodeURIComponent(itemName) as EItemName || null : null,
        reportItemId: id ? decodeURIComponent(id) || null : null,
    };
}

export function decodeSearchParams(searchParams: {
    timeframe?: string;
}): { timeframe: [Date, Date] | null } {
    const { timeframe } = searchParams;
    return {
        timeframe: timeframe ? decodeTimeframe(timeframe) : null,
    };
}

export function prismaArgs(timeframe: [Date, Date], reportItemName: EItemName | null, reportItemId: string | null): ManyArg {
    return {
        where: {
            AND: [
                timeframeFilter(timeframe),
                reportItemFilter(reportItemName, reportItemId),
            ],
        },
    };
}

export function timeframeFilter([start, end]: [Date, Date]): Prisma.ClickWhereInput {
    return {
        viewTime: {
            gte: start,
            lte: end,
        },
    };
}

export function reportItemFilter(reportItemName: EItemName | null, reportItemId: string | null): Prisma.ClickWhereInput {
    if (reportItemName === null || reportItemId === null) return {};

    if (isPrimary(reportItemName).ok) {
        const id = parseInt(reportItemId);
        if (!id) return {};

        return { [itemNameToKeyofPrismaInput(reportItemName)]: id };
    }

    return { [itemNameToKeyofPrismaInput(reportItemName)]: reportItemId };
}

export function itemNameToKeyofPrismaInput(itemName: EItemName): keyof Prisma.ClickWhereInput {
    return keyofPrismaInputsMap[itemName];
}

const keyofPrismaInputsMap: Record<EItemName, keyof Prisma.ClickWhereInput> = {
    ...clickPropsMap,
};
