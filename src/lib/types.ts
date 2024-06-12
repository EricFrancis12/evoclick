

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

export interface ILink_request extends Omit<ILink, 'id' | 'createdAt' | 'updatedAt'> { }
