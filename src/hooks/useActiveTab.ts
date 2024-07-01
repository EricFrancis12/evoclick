"use client";

import { useParams } from "next/navigation";
import { useTabsStore } from "@/lib/store";
import { TTab } from "@/components/Tab";

export default function useActiveTab(): TTab | null {
    const params = useParams();
    const { mainTab, reportTabs } = useTabsStore();
    if (!params?.tabId) return mainTab;
    for (const tab of reportTabs) {
        if (tab.id === params?.tabId) return tab;
    }
    return null;
}
