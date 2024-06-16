import type { TAffiliateNetwork } from './schemas';

export type { TAffiliateNetwork } from './schemas';

export interface IUser {
    id: number;
    name: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
}

// A request for creating a new user
export interface IUser_createRequest extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> { }

// A request for updating one or more properties of an existing user
export interface IUser_updateRequest extends Omit<Partial<IUser>, 'id' | 'createdAt' | 'updatedAt'> { }

// Extending Affiliate Network model
export type TAffiliateNetwork_createRequest = Omit<TAffiliateNetwork, 'id' | 'createdAt' | 'updatedAt'>;
export type TAffiliateNetwork_updateRequest = Omit<Partial<TAffiliateNetwork>, 'id' | 'createdAt' | 'updatedAt'>;
