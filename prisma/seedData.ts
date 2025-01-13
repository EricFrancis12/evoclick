import { $Enums } from "@prisma/client";
import { ELogicalRelation, TNamedToken, TRoute, TToken } from "../src/lib/types";

export const testUserAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
export const testZoneId = "87654321";

export enum ECustomTokenParam {
    BANNER_ID = "banner_id",
    ZONE_ID = "zone_id",
};

export type TAffiliateNetworkSeed = {
    name: string;
    defaultNewOfferString: string;
    tags: string[];
};

export type TOfferSeed = {
    name: string;
    url: string;
    tags: string[];
};

export type TLandingPageSeed = {
    name: string;
    url: string;
    tags: string[];
};

export type TSavedFlowSeed = {
    name: string;
    mainRoute: TRoute;
    ruleRoutes: TRoute[];
    tags: string[];
};

export type TTrafficSourceSeed = {
    name: string;
    postbackUrl: string;
    externalIdToken: TToken;
    costToken: TToken;
    customTokens: TNamedToken[];
    tags: string[];
};

export type TCampaignSeed = {
    name: string;
    publicId: string;
    landingPageRotationType: $Enums.RotationType;
    offerRotationType: $Enums.RotationType;
    geoName: $Enums.GeoName;
    tags: string[];
};

export type TSeedData = {
    affiliateNetworkSeeds: TAffiliateNetworkSeed[],
    offerSeeds: TOfferSeed[],
    landingPageSeeds: TLandingPageSeed[],
    savedFlowSeeds: TSavedFlowSeed[],
    trafficSourceSeeds: TTrafficSourceSeed[],
    campaignSeeds: TCampaignSeed[],
};

const tags = ["placeholder", "example"];

const seedData: TSeedData = {
    affiliateNetworkSeeds: [
        {
            name: "My First Affiliate Network",
            defaultNewOfferString: "",
            tags,
        },
    ],
    offerSeeds: [
        {
            name: "My First Offer",
            url: "http://localhost:3001/public/sample-offer.html?src=my-first-offer",
            tags,
        },
        {
            name: "My Second Offer",
            url: "http://localhost:3001/public/sample-offer.html?src=my-second-offer",
            tags,
        },
        {
            name: "My Third Offer",
            url: "http://localhost:3001/public/sample-offer.html?src=my-third-offer",
            tags,
        },
    ],
    landingPageSeeds: [
        {
            name: "My First Landing Page",
            url: "http://localhost:3001/public/lp/sample-landing-page.html",
            tags,
        },
    ],
    savedFlowSeeds: [
        {
            name: "My First Saved Flow",
            mainRoute: <TRoute>{
                isActive: true,
                logicalRelation: ELogicalRelation.AND,
                rules: [],
                paths: [],
            },
            ruleRoutes: <TRoute[]>[],
            tags,
        },
    ],
    trafficSourceSeeds: [
        {
            name: "My First Traffic Source",
            postbackUrl: "http://localhost:3001/public/sample-postback-url.html",
            externalIdToken: <TToken>{
                queryParam: "external_id",
                value: "{external_id}",
            },
            costToken: <TToken>{
                queryParam: "cost",
                value: "{cost}",
            },
            customTokens: <TNamedToken[]>[
                {
                    name: "Zone ID",
                    queryParam: ECustomTokenParam.ZONE_ID,
                    value: "{zone_id}",
                },
                {
                    name: "Banner ID",
                    queryParam: ECustomTokenParam.BANNER_ID,
                    value: "{banner_id}",
                },
            ],
            tags,
        },
    ],
    campaignSeeds: [
        {
            name: "My First Campaign",
            publicId: "1234-abcd-5678-efgh",
            landingPageRotationType: $Enums.RotationType.RANDOM,
            offerRotationType: $Enums.RotationType.RANDOM,
            geoName: $Enums.GeoName.UNITED_STATES,
            tags,
        },
    ],
};
export default seedData;
