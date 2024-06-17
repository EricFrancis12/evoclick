import { AffiliateNetwork, Campaign, Flow, LandingPage, Offer, TrafficSource, User } from '@prisma/client';

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
export type TCampaign_createRequest = Omit<TCampaign, omissions>;
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
export type TTrafficSource = Omit<TrafficSource, 'defaultTokens' | 'customTokens'> & {
    defaultTokens: TToken[];
    customTokens: TToken[];
};
export type TTrafficSource_createRequest = Omit<TTrafficSource, omissions>;
export type TTrafficSource_updateRequest = Omit<Partial<TTrafficSource>, omissions>;

export type TToken = {
    queryParam: string;
    value: string;
    name: string;
};

export type TRoute = {
    isActive: boolean;
    logicalRelation: ELogicalRelation;
    rules: TRule[];
    paths: TPath[];
};

export enum ELogicalRelation {
    AND = 'AND',
    OR = 'OR'
};

export type TRule = {
    itemName: EItemName;
    clickProp: EClickProp;
    doesEqual: boolean;
    data: string[];
};

export type TPath = {
    isActive: boolean;
    weight: number; // Ranges from 0 to 100
    landingPageIds: number[];
    offerIds: number[];
    directLinkingEnabled: boolean;
};

export enum EItemName {
    AFFILIATE_NETWORK = 'AFFILIATE_NETWORK',
    CAMPAIGN = 'CAMPAIGN',
    FLOW = 'FLOW',
    LANDING_PAGE = 'LANDING_PAGE',
    OFFER = 'OFFER',
    TRAFFIC_SOURCE = 'TRAFFIC_SOURCE'
};

export enum EClickProp {
    affiliateNetworkId = 'affiliateNetworkId',
    campaignId = 'campaignId',
    flowId = 'flowId',
    landingPageId = 'landingPageId',
    offerId = 'offerId',
    trafficSourceId = 'trafficSourceId'
};
