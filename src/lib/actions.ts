'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateRootUser } from './auth';
import { JWT_EXPIRY, JWT_SECRET } from './constants';
import { createNewAffiliateNetwork, getUserByName } from './data';
import { TUser, TAffiliateNetwork, TAffiliateNetwork_createRequest } from './types';

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
                cookies().set('jwt', token);

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
        cookies().set('jwt', token);

        return user;
    } catch (err) {
        return null;
    }
}

export async function createNewAffiliateNetworkAction(formData: FormData, pathname?: string): Promise<TAffiliateNetwork> {
    const affNetReqest: TAffiliateNetwork_createRequest = {
        name: getFormDataName(formData, 'name'),
        defaultNewOfferString: getFormDataName(formData, 'defaultNewOfferString'),
        tags: []
    };
    const affiliateNetworkProm = createNewAffiliateNetwork(affNetReqest);

    // Optionally refresh URL after the new link is added
    if (pathname != null) {
        affiliateNetworkProm.then(() => revalidatePath(pathname));
    }

    return affiliateNetworkProm;
}

function getFormDataName(formData: FormData, name: string): string {
    return formData.get(name)?.toString() || '';
}
