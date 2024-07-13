import { TRoute, ELogicalRelation } from "./types";

export const initMakeRedisKey = (prefix: string) => (id: number | string) => `${prefix}:${id}`;

export function formatErr(err: unknown): string {
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    return "Unknown error";
}

// Determines whether an element contains overflowing nodes or not
export function isOverflown(ref: React.RefObject<HTMLElement>) {
    if (!ref?.current) return false;
    return ref.current.scrollHeight > ref.current.clientHeight || ref.current.scrollWidth > ref.current.clientWidth;
}

export function encodeTimeframe(timeframe: [Date, Date]): string {
    return timeframe.map(date => date.getTime()).join(",");
}

export function decodeTimeframe(str: string): [Date, Date] | null {
    const splitOnComma = decodeURIComponent(str).split(",");
    if (splitOnComma?.length !== 2) return null;

    const nums = splitOnComma.map(a => Number(a));
    if (nums.includes(NaN)) return null;

    return [new Date(nums[0]), new Date(nums[1])];
}

export function newRoute(): TRoute {
    return {
        isActive: true,
        logicalRelation: ELogicalRelation.AND,
        paths: [],
        rules: [],
    };
}
