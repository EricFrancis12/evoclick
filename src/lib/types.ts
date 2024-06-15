

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
