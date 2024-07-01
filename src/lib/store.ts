import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { faTachometerAltFast } from "@fortawesome/free-solid-svg-icons";
import { EItemName } from "./types";
import { TTab } from "../components/Tab";
import { TReportChain } from "@/app/dashboard/ReportView";

interface ITabState {
    mainTab: TTab;
    reportTabs: TTab[];
    makeNewReportTab: (tab: TTab) => void;
    updateTabItemNameById: (id: string, itemName: EItemName) => void;
    updateTabTimeframeById: (id: string, timeframe: [Date, Date]) => void;
    updateTabReportChainById: (id: string, reportChain: TReportChain) => void;
    removeAllReportTabs: () => void;
    removeReportTabById: (id: string) => void;
}

const initialMainTab: TTab = {
    id: "0",
    icon: faTachometerAltFast,
    type: "main",
    itemName: EItemName.CAMPAIGN,
    timeframe: [new Date, new Date],
};

export const useTabsStore = create<ITabState>()(
    persist(
        (set) => ({
            mainTab: initialMainTab,
            reportTabs: [],
            makeNewReportTab: (tab) => set((state) => ({ reportTabs: [...state.reportTabs, tab] })),
            updateTabItemNameById: (id, itemName) => set((state) => ({ mainTab: state.mainTab.id === id ? { ...state.mainTab, itemName } : state.mainTab, reportTabs: state.reportTabs.map(tab => tab.id === id ? { ...tab, itemName } : tab) })),
            updateTabTimeframeById: (id, timeframe) => set((state) => ({ mainTab: state.mainTab.id === id ? { ...state.mainTab, timeframe } : state.mainTab, reportTabs: state.reportTabs.map(tab => tab.id === id ? { ...tab, timeframe } : tab) })),
            updateTabReportChainById: (id, reportChain) => set((state) => ({ reportTabs: state.reportTabs.map(tab => tab.id === id ? { ...tab, reportChain } : tab) })),
            removeAllReportTabs: () => set({ reportTabs: [] }),
            removeReportTabById: (id) => set((state) => ({ reportTabs: state.reportTabs.filter(tab => tab.id !== id) })),
        }),
        {
            name: "tabs-storage", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, "localStorage" is used
        },
    ),
);
