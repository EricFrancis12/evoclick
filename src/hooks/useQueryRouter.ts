"use client";

import { useRouter } from "next/navigation";

export default function useQueryRouter() {
    const router = useRouter();

    return {
        push: (pathname: string, query: Record<string, string | string[]> = {}, preserveKeys?: string[]) => {
            const url = new URL(pathname, window.location.origin);

            const existingQuery: Record<string, string> = preserveKeys
                ? new URL(window.location.href).searchParams
                    .entries()
                    .reduce((acc, [key, val]) => (preserveKeys.includes(key) ? { ...acc, [key]: val } : acc), {})
                : {};

            const queryParams = new URLSearchParams(existingQuery);

            for (const [key, val] of Object.entries(query)) {
                if (typeof val === "string") {
                    queryParams.append(key, val);
                } else {
                    for (const v of val) {
                        queryParams.append(key, v);
                    }
                }
            }

            url.search = queryParams.toString();
            router.push(url.toString());
        },
    };
}
