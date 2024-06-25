'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateRootUser } from './auth';
import { JWT_EXPIRY, JWT_SECRET } from './constants';
import {
    createNewAffiliateNetwork, deleteAffiliateNetworkById, updateAffiliateNetworkById,
    getUserByName
} from './data';
import { TUser, TAffiliateNetwork, TAffiliateNetwork_createRequest, TAffiliateNetwork_updateRequest, ECookieName } from './types';

export async function loginAction(formData: FormData): Promise<TUser | null> {
    const username = getFormDataName(formData, 'username');
    const password = getFormDataName(formData, 'password');

    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    try {
        if (username === process.env.ROOT_USERNAME && password === process.env.ROOT_PASSWORD) {
            const rootUser = generateRootUser();
            if (rootUser) {
                // Set JWT
                const token = jwt.sign({ isRootUser: true }, JWT_SECRET, {
                    expiresIn: JWT_EXPIRY
                });
                cookies().set(ECookieName.JWT, token);

                return rootUser;
            }
        }

        const user = await getUserByName(username);
        if (!user) {
            return null;
        }

        if (!await bcrypt.compare(password, user.hashedPassword)) {
            return null;
        }

        // Set JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY
        });
        cookies().set(ECookieName.JWT, token);

        return user;
    } catch (err) {
        return null;
    }
}

export async function createNewAffiliateNetworkAction(creationRequest: TAffiliateNetwork_createRequest, pathname?: string): Promise<TAffiliateNetwork> {
    const prom = createNewAffiliateNetwork(creationRequest);
    refreshUrl(prom, pathname);
    return prom;
}

export async function updateAffiliateNetworkAction(id: number, updateRequest: TAffiliateNetwork_updateRequest, pathname?: string): Promise<TAffiliateNetwork> {
    const prom = updateAffiliateNetworkById(id, updateRequest);
    refreshUrl(prom, pathname);
    return prom;
}

export async function deleteAffiliateNetworkAction(id: number, pathname?: string) {
    const prom = deleteAffiliateNetworkById(id);
    refreshUrl(prom, pathname);
    return prom;
}

function refreshUrl(prom: Promise<any>, pathname?: string): void {
    // Optionally refresh URL after the new link is added
    if (pathname) prom.then(() => revalidatePath(pathname));
}

function getFormDataName(formData: FormData, name: string): string {
    return formData.get(name)?.toString() || '';
}
