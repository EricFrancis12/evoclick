import prisma from './db';
import { ILink, ILink_request } from './types';

export async function createNewLink(linkReqest: ILink_request): Promise<ILink> {
    return prisma.link.create({
        data: {
            ...linkReqest
        }
    });
}

export async function getAllLinks(): Promise<ILink[]> {
    return prisma.link.findMany();
}


