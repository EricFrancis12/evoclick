"use client";

import { useRouter } from "next/navigation";

export default function useViewRouter() {
    const router = useRouter();

    return {
        push: (pathname: string, query?: Record<string, string>) => {
            const url = new URL(pathname, window.location.origin);
            const queryParams = new URLSearchParams(query);
            url.search = queryParams.toString();
            router.push(url.toString());
        },
    };
}
