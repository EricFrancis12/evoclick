import { AffiliateNetwork, LandingPage, User } from '@prisma/client';

// Extending User model
export type { User } from '@prisma/client';
export type User_createRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type User_updateRequest = Omit<Partial<User>, 'id' | 'createdAt' | 'updatedAt'>;

// Extending Affiliate Network model
export type { AffiliateNetwork } from '@prisma/client';
export type AffiliateNetwork_createRequest = Omit<AffiliateNetwork, 'id' | 'createdAt' | 'updatedAt'>;
export type AffiliateNetwork_updateRequest = Omit<Partial<AffiliateNetwork>, 'id' | 'createdAt' | 'updatedAt'>;

// Extending Landing Page model
export type { LandingPage } from '@prisma/client';
export type LandingPage_createRequest = Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt'>;
export type LandingPage_updateRequest = Omit<Partial<LandingPage>, 'id' | 'createdAt' | 'updatedAt'>;
