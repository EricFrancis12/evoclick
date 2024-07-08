import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IconDefinition, faTachometerAltFast } from "@fortawesome/free-solid-svg-icons";
import { EItemName } from "./types";
import { TReportChain } from "@/app/dashboard/ReportView/ReportChain";

export type TView = {
    type: "main";
    id: "0";
    itemName: EItemName;
    icon: IconDefinition;
    timeframe: [Date, Date];
    reportItemName: null;
    reportChain: null;
} | {
    type: "report";
    id: string;
    itemName: EItemName;
    icon: IconDefinition;
    timeframe: [Date, Date];
    reportItemName: EItemName;
    reportChain: TReportChain;
};

interface IViewsState {
    mainView: TView;
    reportViews: TView[];
    addReportView: (view: TView) => void;
    updateViewOnPageLoad: (id: string, opts: { timeframe: [Date, Date] }) => void;
    updateViewItemNameById: (id: string, itemName: EItemName) => void;
    updateViewReportChainById: (id: string, reportChain: TReportChain) => void;
    removeReportViewById: (id: string) => void;
    removeAllReportViews: () => void;
}

const initialMainView = newMainView(EItemName.CAMPAIGN, faTachometerAltFast);

export const useViewsStore = create<IViewsState>()(
    persist(
        (set) => ({
            mainView: initialMainView,
            reportViews: [],
            addReportView: (view) => set((state) => ({ reportViews: [...state.reportViews, view] })),
            updateViewItemNameById: (id, itemName) => set((state) => ({
                mainView: state.mainView.id === id
                    ? { ...state.mainView, itemName }
                    : state.mainView,
                reportViews: state.reportViews.map(view => view.id === id
                    ? { ...view, itemName }
                    : view),
            })),
            updateViewOnPageLoad: (id, opts) => set((state) => {
                return {
                    mainView: state.mainView.id === id
                        ? { ...state.mainView, ...opts }
                        : state.mainView,
                    reportViews: state.reportViews.map(view => view.id === id
                        ? { ...view, ...opts }
                        : view),
                };
            }),
            updateViewReportChainById: (id, reportChain) => set((state) => ({
                reportViews: state.reportViews.map(view => view.id === id && view.type === "report"
                    ? { ...view, reportChain }
                    : view),
            })),
            removeReportViewById: (id) => set((state) => ({
                reportViews: state.reportViews.filter(view => view.id !== id),
            })),
            removeAllReportViews: () => set({ reportViews: [] }),
        }),
        {
            name: "views-storage", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, "localStorage" is used
        },
    ),
);

export function newMainView(itemName: EItemName, icon: IconDefinition): TView {
    return {
        id: "0",
        itemName,
        type: "main",
        icon,
        timeframe: [new Date, new Date],
        reportItemName: null,
        reportChain: null,
    };
}

export function newReportView(itemName: EItemName, icon: IconDefinition, reportItemName: EItemName, reportItemId: string): TView {
    return {
        id: reportItemId,
        itemName,
        type: "report",
        icon,
        timeframe: [new Date, new Date],
        reportItemName,
        reportChain: [{}, null],
    };
}
