

export const initMakeRedisKey = (prefix: string) => (id: number | string) => `${prefix}:${id}`;

export function formatErr(err: unknown): string {
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    return "Unknown error";
}

// Determines whether an element contains overflowing nodes or not
export function isOverflown(ref: React.RefObject<HTMLElement>) {
    if (!ref?.current) return false;
    return ref.current.scrollHeight > ref.current.clientHeight || ref.current.scrollWidth > ref.current.clientWidth;
}

export function arrayOf<T>(any: T, length: number = 1): T[] {
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(structuredClone(any));
    }
    return result;
}
