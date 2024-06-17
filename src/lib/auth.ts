import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/constants';
import { getUserById } from '@/lib/data';
import { TUser } from '@/lib/types';

export async function useProtectedRoute(redirectUrl = '/login'): Promise<TUser> {
    const user = await getUserFromJWT();
    if (!user) {
        redirect(redirectUrl);
    }
    return user;
}

export async function getUserFromJWT(): Promise<TUser | null> {
    const token = cookies().get('jwt')?.value;
    if (!token) {
        return null;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (typeof payload === 'string') {
            return null;
        }

        if ('isRootUser' in payload) {
            return generateRootUser();
        }

        if ('userId' in payload) {
            return getUserById(payload.userId);
        }
    } catch (err) {
        return null;
    }

    return null;
}

export function generateRootUser(): TUser | null {
    if (!process.env.ROOT_USERNAME) {
        console.log('Unable to genreate Root User because ROOT_USERNAME is not set');
        return null;
    }

    const date = new Date();
    return {
        id: -1,
        name: process.env.ROOT_USERNAME,
        hashedPassword: '',
        createdAt: date,
        updatedAt: date
    };
}
