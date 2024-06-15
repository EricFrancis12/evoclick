import { $Enums } from '@prisma/client';

export interface IUser {
    id: number;
    name: string;
    hashedPassword: string;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date;
}

// A request for creating a new user
export interface IUser_createRequest extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> { }

// A request for updating one or more properties of an existing user
export interface IUser_updateRequest extends Omit<Partial<IUser>, 'id' | 'createdAt' | 'updatedAt'> { }

export interface IAffiliateNetwork {
    id: number;
    name: string;
    defaultNewOfferString: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

// A request for creating a new link
export interface IAffiliateNetwork_createRequest extends Omit<IAffiliateNetwork, 'id' | 'createdAt' | 'updatedAt'> { }

// A request for updating one or more properties of an existing link
export interface IAffiliateNetwork_updateRequest extends Omit<Partial<IAffiliateNetwork>, 'id' | 'createdAt' | 'updatedAt'> { }
