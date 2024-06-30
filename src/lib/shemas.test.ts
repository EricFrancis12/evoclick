import { $Enums } from "@prisma/client";
import {
    affiliateNetworkSchema, campaignSchema, flowSchema, landingPageSchema,
    offersSchema, routeSchema, ruleSchema
} from "./schemas";
import {
    ELogicalRelation, ERuleName, TAffiliateNetwork, TCampaign, TFlow, TLandingPage,
    TOffer, TPath, TRoute, TRule
} from "./types";

describe("Testing Schemas", () => {
    test("Campaign Schema aligns with type", () => {
        expect(campaignSchema.safeParse({}).success).toEqual(false);

        const boilerplateCampaign: TCampaign = {
            id: 1,
            publicId: "e83htr892ujhoo3hnfksl04utynh23873towow",
            name: "My Campaign",
            landingPageRotationType: $Enums.RotationType.RANDOM,
            offerRotationType: $Enums.RotationType.RANDOM,
            geoName: $Enums.GeoName.UNITED_STATES,
            tags: ["my", "campaign"],
            createdAt: new Date(),
            updatedAt: new Date(),
            flowId: 2,
            trafficSourceId: 3,
        };
        expect(campaignSchema.safeParse(boilerplateCampaign).success).toEqual(true);
    });

    const boilerplatePath1: TPath = {
        isActive: true,
        weight: 50,
        landingPageIds: [1, 2, 3],
        offerIds: [4, 5, 6],
        directLinkingEnabled: true,
    };

    const boilerplatePath2: TPath = {
        isActive: false,
        weight: 100,
        landingPageIds: [1, 2, 3],
        offerIds: [4, 5, 6],
        directLinkingEnabled: false,
    };

    const boilerplateRule1: TRule = {
        ruleName: ERuleName.IP,
        includes: true,
        data: ["1", "4", "7"],
    };

    const boilerplateRule2: TRule = {
        ruleName: ERuleName.ISP,
        includes: false,
        data: [],
    };

    const boilerplateRoute1: TRoute = {
        isActive: true,
        logicalRelation: ELogicalRelation.AND,
        paths: [boilerplatePath1],
        rules: [boilerplateRule1],
    };

    const boilerplateRoute2: TRoute = {
        isActive: false,
        logicalRelation: ELogicalRelation.OR,
        paths: [boilerplatePath2],
        rules: [boilerplateRule2],
    };

    test("Route Schema aligns with type", () => {
        expect(routeSchema.safeParse({}).success).toEqual(false);
        expect(routeSchema.safeParse(boilerplateRoute1).success).toEqual(true);
        expect(routeSchema.safeParse(boilerplateRoute2).success).toEqual(true);
    });

    test("Rule Schema aligns with type", () => {
        expect(ruleSchema.safeParse({}).success).toEqual(false);
        expect(ruleSchema.safeParse(boilerplateRule1).success).toEqual(true);
        expect(ruleSchema.safeParse(boilerplateRule2).success).toEqual(true);
    });

    test("Flow Schema aligns with type", () => {
        expect(flowSchema.safeParse({}).success).toEqual(false);

        const boilerplateBuiltInFlow: TFlow = {
            id: 2,
            type: $Enums.FlowType.BUILT_IN,
            name: null, // Built In Flows do not have a name
            url: null, // Built In Flows do not have a url
            mainRoute: boilerplateRoute1,
            ruleRoutes: [boilerplateRoute2],
            tags: ["built", "in", "flow"],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        expect(flowSchema.safeParse(boilerplateBuiltInFlow).success).toEqual(true);

        const boilerplateSavedFlow: TFlow = {
            id: 3,
            type: $Enums.FlowType.SAVED,
            name: "My Saved Flow",
            url: null, // Saved Flows do not have a url
            mainRoute: boilerplateRoute1,
            ruleRoutes: [boilerplateRoute2],
            tags: ["saved", "flow"],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        expect(flowSchema.safeParse(boilerplateSavedFlow).success).toEqual(true);

        const boilerplateUrlFlow: TFlow = {
            id: 4,
            type: $Enums.FlowType.URL,
            name: null, // URL Flows do not have a name
            url: "https://example.com",
            mainRoute: null, // URL Flows do not have a main route
            ruleRoutes: null, // URL Flows do not have ruleRoutes
            tags: ["url", "flow"],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        expect(flowSchema.safeParse(boilerplateUrlFlow).success).toEqual(true);
    });

    const boilerplateAffiliateNetwork: TAffiliateNetwork = {
        id: 5,
        name: "My Affiliate Network",
        defaultNewOfferString: "?click_id=",
        tags: ["my", "affiliate", "network"],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    test("Affiliate Network Schema aligns with type", () => {
        expect(affiliateNetworkSchema.safeParse({}).success).toEqual(false);
        expect(affiliateNetworkSchema.safeParse(boilerplateAffiliateNetwork).success).toEqual(true);
    });

    test("Landing Page Schema aligns with type", () => {
        expect(landingPageSchema.safeParse({}).success).toEqual(false);

        const boilerplateLandingPage: TLandingPage = {
            id: 6,
            name: "My Landing Page",
            url: "https://example.com/lp",
            tags: ["my", "landing", "page"],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        expect(landingPageSchema.safeParse(boilerplateLandingPage).success).toEqual(true);
    });

    test("Offer Schema aligns with type", () => {
        expect(offersSchema.safeParse({}).success).toEqual(false);

        const boilerplateOffer: TOffer = {
            id: 7,
            name: "My Offer",
            url: "https://example.com/offer",
            payout: 120,
            tags: ["my", "offer"],
            createdAt: new Date(),
            updatedAt: new Date(),
            affiliateNetworkId: boilerplateAffiliateNetwork.id,
        };
        expect(offersSchema.safeParse(boilerplateOffer).success).toEqual(true);
    });
});
