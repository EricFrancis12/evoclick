import { $Enums, AffiliateNetwork, Campaign, LandingPage, Offer, TrafficSource, User } from '@prisma/client';

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
export type TCampaign_createRequest = Omit<Campaign, omissions>;
export type TCampaign_updateRequest = Omit<Partial<Campaign>, omissions>;

// Extending Landing Page model
export type TLandingPage = Omit<LandingPage, 'pathId'>;
export type TLandingPage_createRequest = Omit<TLandingPage, omissions>;
export type TLandingPage_updateRequest = Omit<Partial<TLandingPage>, omissions>;

// Extending Offer model
export type TOffer = Omit<Offer, 'pathId'>;
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