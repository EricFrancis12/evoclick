import { TPrimaryData } from "@/app/dashboard/ReportView/ReportViewContext";
import { EItemName, TPrimaryItemName } from "../types";

export * from "./new";

export function upperCaseFirstLetter(str: string): string {
    if (str === "") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string): string {
    return str.split(" ").map(upperCaseFirstLetter).join(" ");
}

export function safeParseJson(jsonStr: string, resultIfError: unknown = {}): unknown {
    let result: unknown;
    try {
        result = JSON.parse(jsonStr);
    } catch (err) {
        return resultIfError;
    }
    return result;
}

export function formatErr(err: unknown): string {
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    return "Unknown error";
}

export function randomIntInRange(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randItemFromArray<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error("Cannot select random item from an array of length 0");
    return arr[randomIntInRange(0, arr.length - 1)];
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

export function getPrimaryItemById<T extends keyof TPrimaryData>(
    primaryData: TPrimaryData,
    key: T,
    id: number
): TPrimaryData[T][number] | null {
    const items = primaryData[key];
    return items.find(item => item.id === id) ?? null;
}

export function primaryItemNameToKeyOfPrimaryData(primaryItemName: TPrimaryItemName): keyof TPrimaryData {
    switch (primaryItemName) {
        case EItemName.AFFILIATE_NETWORK:
            return "affiliateNetworks";
        case EItemName.CAMPAIGN:
            return "campaigns";
        case EItemName.FLOW:
            return "flows";
        case EItemName.LANDING_PAGE:
            return "landingPages";
        case EItemName.OFFER:
            return "offers";
        case EItemName.TRAFFIC_SOURCE:
            return "trafficSources";
    }
}

export type isPrimaryResult = {
    bool: true;
    primaryItemName: TPrimaryItemName;
} | {
    bool: false;
    primaryItemName: null;
};

// Returns whether an EItemName is a TPrimaryItemName or not.
// Uses a diverging union to transform EItemName into a TPrimaryItemName if bool is true
export function isPrimary(itemName: EItemName): isPrimaryResult {
    if (itemName === EItemName.AFFILIATE_NETWORK
        || itemName === EItemName.CAMPAIGN
        || itemName === EItemName.FLOW
        || itemName === EItemName.LANDING_PAGE
        || itemName === EItemName.OFFER
        || itemName === EItemName.TRAFFIC_SOURCE
    ) {
        return {
            bool: true,
            primaryItemName: itemName,
        };
    }
    return {
        bool: false,
        primaryItemName: null,
    };
}

export function makeCampaignUrl(protocol: string, hostname: string, port: string, campaignPublicId: string): string {
    return `${protocol}//${hostname}${port ? ":" + port : ""}/t?g=${campaignPublicId}`;
}

export function makeClickUrl(protocol: string, hostname: string, port: string) {
    return `${protocol}//${hostname}${port ? ":" + port : ""}/click`;
}
