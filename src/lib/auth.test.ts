import { generateRootUser, isRootUser } from "./auth";
import { Env } from "./types";

describe("Testing auth", () => {
    const OLD_ENV = process.env;
    const ADMIN = "ADMIN";

    beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    test("generateRootUser() should create a valid Root User", () => {
        process.env[Env.ROOT_USERNAME] = undefined;
        expect(generateRootUser()).toEqual(null);

        process.env[Env.ROOT_USERNAME] = "";
        expect(generateRootUser()).toEqual(null);

        process.env[Env.ROOT_USERNAME] = ADMIN;
        expect(generateRootUser()?.id).toEqual(-1);
        expect(generateRootUser()?.name).toEqual(ADMIN);
        expect(generateRootUser()?.hashedPassword).toEqual("");
    });

    test("isRootUser() should validate if a user is a Root User", () => {
        process.env[Env.ROOT_USERNAME] = ADMIN;

        const rootUser = generateRootUser();
        if (rootUser === null) {
            throw new Error("Root User is equal to null");
        }
        expect(isRootUser(rootUser)).toEqual(true);

        expect(isRootUser({
            id: -1,
            name: ADMIN,
            hashedPassword: "",
            createdAt: new Date,
            updatedAt: new Date,
        })).toEqual(true);

        expect(isRootUser({
            id: 20,
            name: ADMIN,
            hashedPassword: "",
            createdAt: new Date,
            updatedAt: new Date,
        })).toEqual(false);

        expect(isRootUser({
            id: -1,
            name: "Bob",
            hashedPassword: "",
            createdAt: new Date,
            updatedAt: new Date,
        })).toEqual(false);

        expect(isRootUser({
            id: 32,
            name: "Bob",
            hashedPassword: "",
            createdAt: new Date,
            updatedAt: new Date,
        })).toEqual(false);
    });
});
