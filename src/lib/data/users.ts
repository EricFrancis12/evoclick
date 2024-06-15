import prisma from '../db';
import { IUser, IUser_createRequest, IUser_updateRequest } from '../types';

export async function getAllUsers(): Promise<IUser[]> {
    return prisma.user.findMany();
}

export async function getUserById(id: number): Promise<IUser | null> {
    return prisma.user.findUnique({
        where: { id }
    });
}

export async function getUserByName(name: string): Promise<IUser | null> {
    return prisma.user.findUnique({
        where: { name }
    });
}

export async function createNewUser(userRequest: IUser_createRequest): Promise<IUser> {
    return prisma.user.create({
        data: { ...userRequest }
    });
}

export async function updateUserById(id: number, data: IUser_updateRequest): Promise<IUser> {
    return prisma.user.update({
        where: { id },
        data
    });
}

export async function deleteUserById(id: number): Promise<IUser> {
    return prisma.user.delete({
        where: { id }
    });
}
