import { makeRedisKeyFunc } from "../lib/cache";

describe("Testing Cache", () => {
    test("Generating RedisKeyFuncs", () => {
        const prefix = "prefix";
        const num = 1;
        const str = "str";
        const makeKey = makeRedisKeyFunc(prefix);
        expect(makeKey(num)).toEqual(`${prefix}:${num}`);
        expect(makeKey(str)).toEqual(`${prefix}:${str}`);
    });
});
