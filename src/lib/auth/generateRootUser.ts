import { TUser, Env } from "../types";

export default function generateRootUser(): TUser | null {
    if (!process.env[Env.ROOT_USERNAME]) {
        console.log("Unable to genreate Root User because ROOT_USERNAME is not set");
        return null;
    }

    const date = new Date();
    return {
        id: -1,
        name: process.env[Env.ROOT_USERNAME],
        hashedPassword: "",
        createdAt: date,
        updatedAt: date,
    };
}

export function isRootUser(user: TUser): boolean {
    return user.name === process.env[Env.ROOT_USERNAME] && user.id === -1;
}
