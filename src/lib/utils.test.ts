import { initMakeRedisKey } from "./utils";

describe("Testing Utils", () => {
    test("Generating redis makeKey functions", () => {
        const prefix = "prefix";
        const num = 1;
        const str = "str";
        const makeKey = initMakeRedisKey(prefix);
        expect(makeKey(num)).toEqual(`${prefix}:${num}`);
        expect(makeKey(str)).toEqual(`${prefix}:${str}`);
    });
});
