import prisma from '../db';
import { IAffiliateNetwork, IAffiliateNetwork_createRequest, IAffiliateNetwork_updateRequest } from '../types';

export async function getAllAffiliateNetworks(): Promise<IAffiliateNetwork[]> {
    return prisma.affiliateNetwork.findMany();
}

export async function getAffiliateNetworkById(id: number): Promise<IAffiliateNetwork | null> {
    return prisma.affiliateNetwork.findUnique({
        where: { id }
    });
}

export async function createNewAffiliateNetwork(affNetReqest: IAffiliateNetwork_createRequest): Promise<IAffiliateNetwork> {
    return prisma.affiliateNetwork.create({
        data: { ...affNetReqest }
    });
}

export async function updateAffiliateNetworkById(id: number, data: IAffiliateNetwork_updateRequest): Promise<IAffiliateNetwork> {
    return prisma.affiliateNetwork.update({
        where: { id },
        data
    });
}

export async function deleteAffiliateNetworkById(id: number): Promise<IAffiliateNetwork> {
    return prisma.affiliateNetwork.delete({
        where: { id }
    });
}
