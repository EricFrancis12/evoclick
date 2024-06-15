import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/constants';
import { getUserById } from '@/lib/data';
import { IUser } from '@/lib/types';

export async function useProtectedRoute(redirectUrl = '/login'): Promise<IUser> {
    const user = await getUserFromJWT();
    if (!user) {
        redirect(redirectUrl);
    }
    return user;
}

export async function getUserFromJWT(): Promise<IUser | null> {
    const token = cookies().get('jwt')?.value;
    if (!token) {
        return null;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (typeof payload !== 'string' && 'userId' in payload) {
            return getUserById(payload.userId);
        }
    } catch (err) {
        return null;
    }

    return null;
}
