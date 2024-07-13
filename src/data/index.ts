import { z } from "zod";
import { newRoute } from "@/app/dashboard/ReportView/FlowBuilder";
import { tokenSchema, namedTokenSchema, routeSchema } from "../lib/schemas";
import { TToken, TNamedToken, TRoute } from "../lib/types";

export * from "./User";
export * from "./AffiliateNetwork";
export * from "./Campaign";
export * from "./Click";
export * from "./Flow";
export * from "./LandingPage";
export * from "./Offer";
export * from "./TrafficSource";

export async function parseRoute(jsonStr: string | null): Promise<TRoute> {
    const { success, data } = await routeSchema.safeParseAsync(jsonStr);
    return success ? data : newRoute();
}

export async function parseRoutes(jsonStr: string | null): Promise<TRoute[]> {
    const { success, data } = await z.array(routeSchema).safeParseAsync(jsonStr);
    return success ? data : [];
}

export async function parseToken(jsonStr: string): Promise<TToken> {
    const { success, data } = await tokenSchema.safeParseAsync(jsonStr);
    return success ? data : makeBoilerplateToken();
}

export async function parseTokens(jsonStr: string): Promise<TToken[]> {
    const { success, data } = await z.array(tokenSchema).safeParseAsync(jsonStr);
    return success ? data : [];
}

export async function parseNamedTokens(jsonStr: string): Promise<TNamedToken[]> {
    const { success, data } = await z.array(namedTokenSchema).safeParseAsync(jsonStr);
    return success ? data : [];
}

export function makeBoilerplateToken(): TToken {
    return {
        queryParam: "",
        value: "",
    };
}
