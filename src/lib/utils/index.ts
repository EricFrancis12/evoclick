import { TPrimaryData } from "@/app/dashboard/ReportView/ReportViewContext";
import { EItemName, TPrimaryItemName, TToken } from "../types";

export * from "./maps"
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

export function numberWithCommas(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function randomIntInRange(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItemFromArray<T>(arr: T[]): T | null {
    return arr[randomIntInRange(0, arr.length - 1)] ?? null;
}

export function encodeTimeframe(timeframe: [Date, Date]): string {
    return timeframe.map(date => date.getTime()).join(",");
}

export function decodeTimeframe(str: string): [Date, Date] | null {
    const splitOnComma = decodeURIComponent(str).split(",");
    if (splitOnComma?.length !== 2) return null;

    const nums = splitOnComma.map(a => Number(a));
    if (nums.includes(NaN)) return null;

    return nums.map(num => new Date(num)) as [Date, Date];
}

export function getPrimaryItemById(
    primaryData: TPrimaryData,
    primaryItemName: TPrimaryItemName,
    id: number
): TPrimaryData[keyof TPrimaryData][number] | null {
    return primaryData[primaryItemName].find(item => item.id === id) ?? null;
}

export type isPrimaryResult = {
    ok: true;
    primaryItemName: TPrimaryItemName;
} | {
    ok: false;
    primaryItemName: null;
};

// Returns whether an EItemName is a TPrimaryItemName or not.
// Uses a discriminating union to transform EItemName into a TPrimaryItemName, switching on ok.
export function isPrimary(itemName: EItemName): isPrimaryResult {
    if (itemName === EItemName.AFFILIATE_NETWORK
        || itemName === EItemName.CAMPAIGN
        || itemName === EItemName.FLOW
        || itemName === EItemName.LANDING_PAGE
        || itemName === EItemName.OFFER
        || itemName === EItemName.TRAFFIC_SOURCE
    ) {
        return {
            ok: true,
            primaryItemName: itemName,
        };
    }
    return {
        ok: false,
        primaryItemName: null,
    };
}

export function makeCampaignUrl(
    protocol: string,
    hostname: string,
    port: string,
    campaignPublicId: string,
    tokens: TToken[]
): string {
    const queryStr = `g=${campaignPublicId}${tokens.length > 0 ? "&" + flattenTokens(tokens) : ""}`;
    return `${protocol}//${hostname}${port ? ":" + port : ""}/t?${queryStr}`;
}

export function makeClickUrl(protocol: string, hostname: string, port: string) {
    return `${protocol}//${hostname}${port ? ":" + port : ""}/click`;
}

export function iPInfoEndpoint(ipAddr: string, ipInfoToken: string): string {
    return "https://ipinfo.io/" + ipAddr + "?token=" + ipInfoToken;
}

function flattenTokens(tokens: TToken[]): string {
    return tokens.map(({ queryParam, value }) => `${queryParam}=${value}`).join("&");
}