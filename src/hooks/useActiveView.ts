"use client";

import { useParams } from "next/navigation";
import { TView, useViewsStore } from "@/lib/store";

export default function useActiveView(): TView | null {
    const params = useParams();
    const { mainView, reportViews } = useViewsStore();
    if (!params?.id) return mainView;

    for (const view of reportViews) {
        if (typeof params.id === "string" && view.id === decodeURIComponent(params.id)) {
            return view;
        }
    }

    return null;
}
