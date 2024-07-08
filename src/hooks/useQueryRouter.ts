"use client";

import { useRouter } from "next/navigation";
import useActiveView from "./useActiveView";
import { encodeTimeframe } from "@/lib/utils";

export default function useViewRouter() {
    const router = useRouter();
    const view = useActiveView();

    return {
        push: (pathname: string, query?: Record<string, string>, preserve?: boolean) => {
            const url = new URL(pathname, window.location.origin);
            const params = new URLSearchParams(
                preserve && view
                    ? { timeframe: encodeTimeframe(view.timeframe), ...query } // new query overrides current query
                    : query
            );
            url.search = params.toString();
            router.push(url.toString());
        },
    };
}
