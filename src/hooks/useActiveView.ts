"use client";

import { useParams } from "next/navigation";
import { useViewsStore } from "@/lib/store";
import { TView } from "@/app/dashboard/ReportView/Tab";

export default function useActiveView(): TView | null {
    const params = useParams();
    const { mainView, reportViews } = useViewsStore();
    if (!params?.id) return mainView;
    for (const view of reportViews) {
        if (view.id === params?.id) return view;
    }
    return null;
}
