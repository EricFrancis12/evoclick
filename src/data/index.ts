import { z } from "zod";
import { tokenSchema, namedTokenSchema, routeSchema } from "../lib/schemas";
import { safeParseJson } from "@/lib/utils";
import { newRoute } from "@/app/dashboard/ReportView/FlowBuilder/Route";
import { newToken } from "@/app/dashboard/ReportView/TokenInput";
import { TToken, TNamedToken, TRoute } from "../lib/types";

export * from "./User";
export * from "./AffiliateNetwork";
export * from "./Campaign";
export * from "./Click";
export * from "./Flow";
export * from "./LandingPage";
export * from "./Offer";
export * from "./TrafficSource";

export async function parseRoute(jsonStr: string): Promise<TRoute> {
    const { success, data } = await routeSchema.spa(safeParseJson(jsonStr));
    return success ? data : newRoute();
}

export async function parseRoutes(jsonStr: string): Promise<TRoute[]> {
    const { success, data } = await z.array(routeSchema).spa(safeParseJson(jsonStr));
    return success ? data : [];
}

export async function parseToken(jsonStr: string): Promise<TToken> {
    const { success, data } = await tokenSchema.spa(safeParseJson(jsonStr));
    return success ? data : newToken();
}

export async function parseTokens(jsonStr: string): Promise<TToken[]> {
    const { success, data } = await z.array(tokenSchema).spa(safeParseJson(jsonStr));
    return success ? data : [];
}

export async function parseNamedTokens(jsonStr: string): Promise<TNamedToken[]> {
    const { success, data } = await z.array(namedTokenSchema).spa(safeParseJson(jsonStr));
    return success ? data : [];
}
