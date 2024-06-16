import prisma from '../db';
import { User, User_createRequest, User_updateRequest } from '../types';

export async function getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
}

export async function getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id }
    });
}

export async function getUserByName(name: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { name }
    });
}

export async function createNewUser(userRequest: User_createRequest): Promise<User> {
    return prisma.user.create({
        data: { ...userRequest }
    });
}

export async function updateUserById(id: number, data: User_updateRequest): Promise<User> {
    return prisma.user.update({
        where: { id },
        data
    });
}

export async function deleteUserById(id: number): Promise<User> {
    return prisma.user.delete({
        where: { id }
    });
}
