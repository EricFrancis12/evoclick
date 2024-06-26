import { create } from "zustand";
import { EItemName } from "./types";

type TTab = {
    itemName: EItemName;
};

interface ITabsState {
    tabs: TTab[];
    makeNew: (itemName: EItemName) => void;
}

export const useTabsStore = create<ITabsState>()((set) => ({
    tabs: [],
    makeNew: (itemName) => set((state) => ({ tabs: [...state.tabs, { itemName, yes: () => 1 }] })),
}));
