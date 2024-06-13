import prisma from './db';
import { ILink, ILink_createRequest, ILink_updateRequest } from './types';

export async function getAllLinks(): Promise<ILink[]> {
    return prisma.link.findMany();
}

export async function getLinkById(id: number) {
    return prisma.link.findUnique({
        where: { id }
    });
}

export async function createNewLink(linkReqest: ILink_createRequest): Promise<ILink> {
    return prisma.link.create({
        data: { ...linkReqest }
    });
}

export async function updateLinkById(id: number, data: ILink_updateRequest) {
    return prisma.link.update({
        where: { id },
        data
    });
}

export async function deleteLinkById(id: number) {
    return prisma.link.delete({
        where: { id }
    });
}
