"use client";

import { useParams } from "next/navigation";
import { useTabsStore } from "@/lib/store";
import { TTab } from "@/components/Tab";

export default function useActiveTab(): TTab {
    const params = useParams();
    const { mainTab, reportTabs } = useTabsStore();
    for (const tab of reportTabs) {
        if (tab.id === params?.tabId) return tab;
    }
    return mainTab;
}
