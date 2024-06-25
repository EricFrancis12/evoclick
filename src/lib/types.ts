import { AffiliateNetwork, Campaign, Click, Flow, LandingPage, Offer, TrafficSource, User } from '@prisma/client';

type omissions = 'id' | 'createdAt' | 'updatedAt';

// Extending User model
export type TUser = User;
export type TUser_createRequest = Omit<TUser, omissions>;
export type TUser_updateRequest = Omit<Partial<TUser>, omissions>;

// Extending Affiliate Network model
export type TAffiliateNetwork = AffiliateNetwork;
export type TAffiliateNetwork_createRequest = Omit<TAffiliateNetwork, omissions>;
export type TAffiliateNetwork_updateRequest = Omit<Partial<TAffiliateNetwork>, omissions>;

// Extending Campaign model
export type TCampaign = Campaign;
export type TCampaign_createRequest = Omit<TCampaign, omissions | 'publicId'>;
export type TCampaign_updateRequest = Omit<Partial<TCampaign>, omissions>;

// Extending Flow model
export type TFlow = Omit<Flow, 'mainRoute' | 'ruleRoutes'> & {
    mainRoute: TRoute | null;
    ruleRoutes: TRoute[] | null;
};
export type TFlow_createRequest = Omit<TFlow, omissions>;
export type TFlow_updateRequest = Omit<Partial<TFlow>, omissions>;

// Extending Landing Page model
export type TLandingPage = LandingPage;
export type TLandingPage_createRequest = Omit<TLandingPage, omissions>;
export type TLandingPage_updateRequest = Omit<Partial<TLandingPage>, omissions>;

// Extending Offer model
export type TOffer = Offer;
export type TOffer_createRequest = Omit<TOffer, omissions>;
export type TOffer_updateRequest = Omit<Partial<TOffer>, omissions>;

// Extending Traffic Source model
export type TTrafficSource = Omit<TrafficSource, 'externalIdToken' | 'costToken' | 'customTokens'> & {
    externalIdToken: TToken;
    costToken: TToken;
    customTokens: TNamedToken[];
};
export type TTrafficSource_createRequest = Omit<TTrafficSource, omissions>;
export type TTrafficSource_updateRequest = Omit<Partial<TTrafficSource>, omissions>;

export type TToken = {
    queryParam: string;
    value: string;
};
export type TNamedToken = TToken & {
    name: string;
};

// Extending Click model
export type TClick = Omit<Click, 'tokens'> & {
    tokens: TToken[]
};

export type TRoute = {
    isActive: boolean;
    logicalRelation: ELogicalRelation;
    rules: TRule[];
    paths: TPath[];
};

export enum ELogicalRelation {
    AND = 'and',
    OR = 'or'
};

export type TRule = {
    ruleName: ERuleName;
    data: string[];
    includes: boolean;
};

export type TPath = {
    isActive: boolean;
    weight: number; // Ranges from 0 to 100
    landingPageIds: number[];
    offerIds: number[];
    directLinkingEnabled: boolean;
};

export enum ERuleName {
    IP = 'IP',
    ISP = 'ISP',
    USER_AGENT = 'userAgent',
    LANGUAGE = 'language',
    COUNTRY = 'country',
    REGION = 'region',
    City = 'city',
    DEVICE_TYPE = 'deviceType',
    DEVICE = 'device',
    SCREEN_RESOLUTION = 'screenResolution',
    OS = 'OS',
    OS_VERSION = 'OSVersion',
    BROWSER_NAME = 'browserName',
    BROWSER_VERSION = 'browserVersion'
};

export enum ECookieName {
    JWT = 'jwt'
}
