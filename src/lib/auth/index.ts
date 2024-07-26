import { cookies } from "next/headers";
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/constants";
import { getUserById } from "@/data";
import generateRootUser, { isRootUser } from "./generateRootUser";
import { TUser, ECookieName } from "@/lib/types";

export async function useProtectedRoute(redirectUrl = "/login"): Promise<TUser> {
    const user = await getUserFromJWT();
    if (!user) {
        redirect(redirectUrl);
    }
    return user;
}

export async function getUserFromJWT(): Promise<TUser | null> {
    const token = cookies().get(ECookieName.JWT)?.value;
    if (!token) {
        return null;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (typeof payload === "string") {
            return null;
        }

        if ("isRootUser" in payload) {
            return generateRootUser();
        }

        if ("userId" in payload) {
            return getUserById(payload.userId);
        }
    } catch (err) {
        return null;
    }

    return null;
}

export async function useRootUserRoute(redirectUrl = "/login"): Promise<TUser> {
    const user = await getUserFromJWT();
    if (!user || !isRootUser(user)) {
        redirect(redirectUrl);
    }
    return user;
}
