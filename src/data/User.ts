import prisma from '../lib/db';
import { TUser, TUser_createRequest, TUser_updateRequest } from '../lib/types';

export async function getAllUsers(): Promise<TUser[]> {
    return prisma.user.findMany();
}

export async function getUserById(id: number): Promise<TUser | null> {
    return prisma.user.findUnique({
        where: { id }
    });
}

export async function getUserByName(name: string): Promise<TUser | null> {
    return prisma.user.findUnique({
        where: { name }
    });
}

export async function createNewUser(creationRequest: TUser_createRequest): Promise<TUser> {
    return prisma.user.create({
        data: { ...creationRequest }
    });
}

export async function updateUserById(id: number, data: TUser_updateRequest): Promise<TUser> {
    return prisma.user.update({
        where: { id },
        data
    });
}

export async function deleteUserById(id: number): Promise<TUser> {
    return prisma.user.delete({
        where: { id }
    });
}
