import { generateRootUser } from "./auth";

describe("Testing auth", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules() // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    test("Root User properties", () => {
        process.env.ROOT_USERNAME = undefined;
        expect(generateRootUser()).toEqual(null);

        process.env.ROOT_USERNAME = "";
        expect(generateRootUser()).toEqual(null);

        const ADMIN = "ADMIN";
        process.env.ROOT_USERNAME = ADMIN;
        expect(generateRootUser()?.id).toEqual(-1);
        expect(generateRootUser()?.name).toEqual(ADMIN);
        expect(generateRootUser()?.hashedPassword).toEqual("");
    });
});
