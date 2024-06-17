import { AffiliateNetwork, LandingPage, Offer, TrafficSource, User } from '@prisma/client';

type omissions = 'id' | 'createdAt' | 'updatedAt';

// Extending User model for use in the app
export type TUser = User;
export type TUser_createRequest = Omit<TUser, omissions>;
export type TUser_updateRequest = Omit<Partial<TUser>, omissions>;

// Extending Affiliate Network model for use in the app
export type TAffiliateNetwork = AffiliateNetwork;
export type TAffiliateNetwork_createRequest = Omit<TAffiliateNetwork, omissions>;
export type TAffiliateNetwork_updateRequest = Omit<Partial<TAffiliateNetwork>, omissions>;

// Extending Landing Page model for use in the app
export type TLandingPage = LandingPage;
export type TLandingPage_createRequest = Omit<TLandingPage, omissions>;
export type TLandingPage_updateRequest = Omit<Partial<TLandingPage>, omissions>;

// Extending Offer model for use in the app
export type TOffer = Offer;
export type TOffer_createRequest = Omit<TOffer, omissions>;
export type TOffer_updateRequest = Omit<Partial<TOffer>, omissions>;

// Extending Traffic Source model for use in the app
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