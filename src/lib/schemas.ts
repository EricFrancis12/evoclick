import { $Enums } from "@prisma/client";
import { z } from "zod";
import {
    TUser, TAffiliateNetwork, TCampaign, TSavedFlow, TLandingPage, TOffer, TTrafficSource, TToken, TNamedToken,
    TPath, TRoute, TRule, ERuleName, ELogicalRelation, IPInfoData, EItemName
} from "./types";

export const userSchema: z.ZodType<TUser> = z.object({
    id: z.number(),
    name: z.string(),
    hashedPassword: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const affiliateNetworkSchema: z.ZodType<TAffiliateNetwork> = z.object({
    primaryItemName: z.literal(EItemName.AFFILIATE_NETWORK),
    id: z.number(),
    name: z.string(),
    defaultNewOfferString: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const ruleSchema: z.ZodType<TRule> = z.object({
    ruleName: z.nativeEnum(ERuleName),
    includes: z.boolean(),
    data: z.array(z.string()),
});

export const pathSchema: z.ZodType<TPath> = z.object({
    isActive: z.boolean(),
    weight: z.number(),
    landingPageIds: z.array(z.number()),
    offerIds: z.array(z.number()),
    directLinkingEnabled: z.boolean(),
});

export const routeSchema: z.ZodType<TRoute> = z.object({
    isActive: z.boolean(),
    logicalRelation: z.nativeEnum(ELogicalRelation),
    paths: z.array(pathSchema),
    rules: z.array(ruleSchema),
});

export const savedFlowSchema: z.ZodType<TSavedFlow> = z.object({
    primaryItemName: z.literal(EItemName.FLOW),
    id: z.number(),
    name: z.string(),
    mainRoute: routeSchema,
    ruleRoutes: z.array(routeSchema),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const campaignSchema: z.ZodType<TCampaign> = z.object({
    primaryItemName: z.literal(EItemName.CAMPAIGN),
    id: z.number(),
    publicId: z.string(),
    name: z.string(),
    landingPageRotationType: z.nativeEnum($Enums.RotationType),
    offerRotationType: z.nativeEnum($Enums.RotationType),
    geoName: z.nativeEnum($Enums.GeoName),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
    trafficSourceId: z.number(),
    flowType: z.nativeEnum($Enums.FlowType),
    savedFlowId: z.number().nullable(),
    flowUrl: z.string().nullable(),
    flowMainRoute: routeSchema.nullable(),
    flowRuleRoutes: z.array(routeSchema).nullable(),
});

export const landingPageSchema: z.ZodType<TLandingPage> = z.object({
    primaryItemName: z.literal(EItemName.LANDING_PAGE),
    id: z.number(),
    name: z.string(),
    url: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const offersSchema: z.ZodType<TOffer> = z.object({
    primaryItemName: z.literal(EItemName.OFFER),
    id: z.number(),
    name: z.string(),
    url: z.string(),
    payout: z.number(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
    affiliateNetworkId: z.number(),
});

export const tokenSchema: z.ZodType<TToken> = z.object({
    queryParam: z.string(),
    value: z.string(),
});

export const namedTokenSchema: z.ZodType<TNamedToken> = z.object({
    queryParam: z.string(),
    value: z.string(),
    name: z.string(),
});

export const trafficSourceSchema: z.ZodType<TTrafficSource> = z.object({
    primaryItemName: z.literal(EItemName.TRAFFIC_SOURCE),
    id: z.number(),
    name: z.string(),
    postbackUrl: z.nullable(z.string()),
    externalIdToken: tokenSchema,
    costToken: tokenSchema,
    customTokens: z.array(namedTokenSchema),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const IPInfoDataSchema: z.ZodType<IPInfoData> = z.object({
    ip: z.string(),
    hostname: z.string().optional(),
    city: z.string(),
    region: z.string(),
    country: z.string(),
    loc: z.string(),
    org: z.string(),
    postal: z.string(),
    timezone: z.string(),
});
