

export interface ILink {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    category: string;
};

// A request for creating a new link
export interface ILink_createRequest extends Omit<ILink, 'id' | 'createdAt' | 'updatedAt'> { }

// A request for updating one or more properties of an existing link
export interface ILink_updateRequest extends Omit<Partial<ILink>, 'id' | 'createdAt' | 'updatedAt'> { }
