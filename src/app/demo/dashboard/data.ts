import { FlowType, GeoName } from "@prisma/client";
import { ECustomTokenParam } from "../../../../prisma/seedData";
import { returnAtIndexOrThrow } from "../../../lib/utils";
import {
    EItemName, ELogicalRelation, ERuleName, TAffiliateNetwork, TCampaign,
    TClick, TLandingPage, TOffer, TSavedFlow, TTrafficSource
} from "../../../lib/types";

const date = new Date();

export const demoAffiliateNetworks: TAffiliateNetwork[] = [
    {
        id: 0,
        name: "Max Bounty",
        defaultNewOfferString: "",
        tags: ["CPA"],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.AFFILIATE_NETWORK,
    },
    {
        id: 1,
        name: "CPA Grip",
        defaultNewOfferString: "",
        tags: ["CPA"],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.AFFILIATE_NETWORK,
    },
    {
        id: 2,
        name: "ClickBank",
        defaultNewOfferString: "",
        tags: ["CPL", "Digital Products"],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.AFFILIATE_NETWORK,
    },
    {
        id: 3,
        name: "ShareASale",
        defaultNewOfferString: "",
        tags: ["CPL", "E-commerce"],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.AFFILIATE_NETWORK,
    },
];

export const demoOffers: TOffer[] = [
    {
        id: 0,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 0, "Affiliate Networks").id,
        name: "The Ultimate Keto Cookbook",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 1,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 0, "Affiliate Networks").id,
        name: "Learn Guitar with Easy Lessons",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 2,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 0, "Affiliate Networks").id,
        name: "Manifestation Mastery Course",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 3,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 1, "Affiliate Networks").id,
        name: "Learn French Online Monthly Membership",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 4,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 1, "Affiliate Networks").id,
        name: "Fitness Coaching Subscription Plan",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 5,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 1, "Affiliate Networks").id,
        name: "Amazon Prime Membership",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 6,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 2, "Affiliate Networks").id,
        name: "Walmart Weekly Savings Subscription",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 7,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 2, "Affiliate Networks").id,
        name: "Target Electronics Purchase Program",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 8,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 3, "Affiliate Networks").id,
        name: "ASOS Sale Offers on New Trends",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
    {
        id: 9,
        affiliateNetworkId: returnAtIndexOrThrow(demoAffiliateNetworks, 3, "Affiliate Networks").id,
        name: "Apply for Auto Insurance with Geico",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.OFFER,
    },
];

export const demoLandingPages: TLandingPage[] = [
    {
        id: 0,
        name: "Keto Landing Page - split test A",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.LANDING_PAGE,
    },
    {
        id: 1,
        name: "Keto Landing Page - split test B",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.LANDING_PAGE,
    },
    {
        id: 2,
        name: "Car Insurance Advertorial",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.LANDING_PAGE,
    },
    {
        id: 3,
        name: "Solar Panels Blog Post",
        url: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.LANDING_PAGE,
    },
];

export const demoSavedFlows: TSavedFlow[] = [
    {
        id: 0,
        name: "Saved Flow 1",
        mainRoute: {
            isActive: true,
            logicalRelation: ELogicalRelation.AND,
            rules: [],
            paths: [
                {
                    isActive: true,
                    weight: 100,
                    landingPageIds: [],
                    offerIds: [returnAtIndexOrThrow(demoOffers, 0, "Offers").id],
                    directLinkingEnabled: true,
                },
            ],
        },
        ruleRoutes: [
            {
                isActive: true,
                logicalRelation: ELogicalRelation.AND,
                rules: [
                    {
                        ruleName: ERuleName.USER_AGENT,
                        data: ["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"],
                        includes: true,
                    },
                ],
                paths: [
                    {
                        isActive: true,
                        weight: 100,
                        landingPageIds: [],
                        offerIds: [returnAtIndexOrThrow(demoOffers, 1, "Offers").id],
                        directLinkingEnabled: true,
                    },
                ],
            },
            {
                isActive: true,
                logicalRelation: ELogicalRelation.AND,
                rules: [
                    {
                        ruleName: `Custom-Rule-${ECustomTokenParam.ZONE_ID}`,
                        data: ["1234"],
                        includes: true,
                    },
                ],
                paths: [
                    {
                        isActive: true,
                        weight: 50,
                        landingPageIds: [returnAtIndexOrThrow(demoLandingPages, 0, "Landing Pages").id],
                        offerIds: [returnAtIndexOrThrow(demoOffers, 2, "Offers").id],
                        directLinkingEnabled: false,
                    },
                ],
            },
        ],
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.FLOW,
    },
    {
        id: 1,
        name: "Keto Weight Loss Flow",
        mainRoute: {
            isActive: true,
            logicalRelation: ELogicalRelation.AND,
            paths: [
                {
                    isActive: true,
                    weight: 100,
                    landingPageIds: [
                        returnAtIndexOrThrow(demoLandingPages, 0, "Landing Pages").id,
                        returnAtIndexOrThrow(demoLandingPages, 1, "Landing Pages").id,
                    ],
                    offerIds: [returnAtIndexOrThrow(demoOffers, 0, "Offers").id],
                    directLinkingEnabled: false,
                },
            ],
            rules: [],
        },
        ruleRoutes: [],
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.FLOW,
    },
];

export const demoTrafficSources: TTrafficSource[] = [
    {
        id: 0,
        name: "Propeller Ads",
        externalIdToken: {
            queryParam: "external_id",
            value: "{external_id}"
        },
        costToken: {
            queryParam: "cost",
            value: "{cost}"
        },
        customTokens: [
            {
                name: "Zone ID",
                queryParam: "zone_id",
                value: "{zone_id}",
            },
            {
                name: "Banner ID",
                queryParam: "banner_id",
                value: "{banner_id}",
            },
            {
                name: "Country",
                queryParam: "country",
                value: "{country}",
            },
            {
                name: "State",
                queryParam: "state",
                value: "{state}",
            },
            {
                name: "City",
                queryParam: "city",
                value: "{city}",
            },
        ],
        postbackUrl: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.TRAFFIC_SOURCE,
    },
    {
        id: 1,
        name: "Bing Ads",
        externalIdToken: {
            queryParam: "external_id",
            value: "{external_id}"
        },
        costToken: {
            queryParam: "cost",
            value: "{cost}"
        },
        customTokens: [],
        postbackUrl: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.TRAFFIC_SOURCE,
    },
    {
        id: 2,
        name: "Zeropark",
        externalIdToken: {
            queryParam: "external_id",
            value: "{external_id}"
        },
        costToken: {
            queryParam: "cost",
            value: "{cost}"
        },
        customTokens: [],
        postbackUrl: "",
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.TRAFFIC_SOURCE,
    },
];

export const demoCampaigns: TCampaign[] = [
    {
        id: 0,
        publicId: "abc",
        name: "Car Insurance Advertorial Campaign",
        landingPageRotationType: "RANDOM",
        offerRotationType: "RANDOM",
        flowType: FlowType.BUILT_IN,
        flowMainRoute: {
            isActive: true,
            logicalRelation: ELogicalRelation.AND,
            paths: [
                {
                    isActive: true,
                    weight: 100,
                    landingPageIds: [returnAtIndexOrThrow(demoLandingPages, 2, "Landing Pages").id],
                    offerIds: [returnAtIndexOrThrow(demoOffers, 9, "Offers").id],
                    directLinkingEnabled: false,
                },
            ],
            rules: [],
        },
        flowRuleRoutes: [],
        flowUrl: null,
        savedFlowId: null,
        trafficSourceId: returnAtIndexOrThrow(demoTrafficSources, 0, "Traffic Sources").id,
        geoName: GeoName.UNITED_STATES,
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.CAMPAIGN,
    },
    {
        id: 1,
        publicId: "def",
        name: "Keto Weight Loss Split Test",
        landingPageRotationType: "RANDOM",
        offerRotationType: "RANDOM",
        flowType: FlowType.SAVED,
        flowMainRoute: null,
        flowRuleRoutes: null,
        flowUrl: null,
        savedFlowId: returnAtIndexOrThrow(demoSavedFlows, 1, "Saved Flows").id,
        trafficSourceId: returnAtIndexOrThrow(demoTrafficSources, 2, "Traffic Sources").id,
        geoName: GeoName.CANADA,
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.CAMPAIGN,
    },
    {
        id: 2,
        publicId: "ghi",
        name: "Solar Panels California",
        landingPageRotationType: "RANDOM",
        offerRotationType: "RANDOM",
        flowType: FlowType.URL,
        flowMainRoute: null,
        flowRuleRoutes: null,
        flowUrl: "https://example.com/my-solar-panel-blog-post",
        savedFlowId: null,
        trafficSourceId: returnAtIndexOrThrow(demoTrafficSources, 1, "Traffic Sources").id,
        geoName: GeoName.UNITED_STATES,
        tags: [],
        createdAt: date,
        updatedAt: date,
        primaryItemName: EItemName.CAMPAIGN,
    },
];

export const demoClicks: TClick[] = [
    // TODO: ...
];
