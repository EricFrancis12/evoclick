'use client';

import { useRouter } from 'next/navigation';

export default function useQueryRouter() {
    const router = useRouter();
    return {
        push: (pathname: string, query?: Record<string, string>, preserve?: boolean) => {
            const url = new URL(pathname, window.location.origin);
            const params = new URLSearchParams(
                preserve
                    ? { ...getCurrentQuery(), ...query } // new query overrides current query
                    : query
            );
            url.search = params.toString();
            router.push(url.toString());
        }
    };
}

function getCurrentQuery() {
    const currentQuery: Record<string, string> = {};
    if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.forEach((value, key) => {
            currentQuery[key] = value;
        });
    }
    return currentQuery;
};
