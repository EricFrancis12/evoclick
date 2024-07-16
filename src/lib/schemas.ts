import { $Enums } from "@prisma/client";
import { z } from "zod";
import { toZod } from "tozod";
import {
    TAffiliateNetwork, TLandingPage, TOffer, TToken, TNamedToken, TTrafficSource, TUser,
    TPath, ELogicalRelation, ERuleName,
    TSavedFlow,
    TCampaign
} from "./types";

export const userSchema: toZod<TUser> = z.object({
    id: z.number(),
    name: z.string(),
    hashedPassword: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const affiliateNetworkSchema: toZod<TAffiliateNetwork> = z.object({
    id: z.number(),
    name: z.string(),
    defaultNewOfferString: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const ruleSchema = z.object({
    ruleName: z.nativeEnum(ERuleName),
    includes: z.boolean(),
    data: z.array(z.string()),
});

export const pathSchema: toZod<TPath> = z.object({
    isActive: z.boolean(),
    weight: z.number(),
    landingPageIds: z.array(z.number()),
    offerIds: z.array(z.number()),
    directLinkingEnabled: z.boolean(),
});

export const routeSchema = z.object({
    isActive: z.boolean(),
    logicalRelation: z.nativeEnum(ELogicalRelation),
    paths: z.array(pathSchema),
    rules: z.array(ruleSchema),
});

export const savedFlowSchema = z.object({
    id: z.number(),
    name: z.string(),
    mainRoute: routeSchema,
    ruleRoutes: z.array(routeSchema),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const campaignSchema = z.object({
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

export const landingPageSchema: toZod<TLandingPage> = z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const offersSchema: toZod<TOffer> = z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    payout: z.number(),
    tags: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
    affiliateNetworkId: z.number(),
});

export const tokenSchema: toZod<TToken> = z.object({
    queryParam: z.string(),
    value: z.string(),
});

export const namedTokenSchema: toZod<TNamedToken> = z.object({
    queryParam: z.string(),
    value: z.string(),
    name: z.string(),
});

export const trafficSourceSchema: toZod<TTrafficSource> = z.object({
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
