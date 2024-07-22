import { makeRedisKeyFunc } from "../lib/cache";

describe("Testing cache", () => {
    test(`The functions created by makeRedisKeyFunc() should return -> [prefix] + ":" + [input]`, () => {
        const prefix = "prefix";
        const num = 1;
        const str = "str";
        const makeKey = makeRedisKeyFunc(prefix);
        expect(makeKey(num)).toEqual(`${prefix}:${num}`);
        expect(makeKey(str)).toEqual(`${prefix}:${str}`);
    });
});
