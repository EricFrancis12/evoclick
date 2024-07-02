import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { faTachometerAltFast } from "@fortawesome/free-solid-svg-icons";
import { EItemName } from "./types";
import { TView } from "../app/dashboard/ReportView/Tab";
import { TReportChain } from "@/app/dashboard/ReportView/ReportChain";

interface IViewsState {
    mainView: TView;
    reportViews: TView[];
    makeNewReportView: (view: TView) => void;
    updateViewOnPageLoad: (id: string, opts: { page: number, size: number, timeframe: [Date, Date] }) => void;
    updateViewReportItemNameById: (id: string, reportItemName: EItemName) => void;
    updateViewItemNameById: (id: string, itemName: EItemName) => void;
    updateViewReportChainById: (id: string, reportChain: TReportChain) => void;
    removeReportViewById: (id: string) => void;
    removeAllReportViews: () => void;
}

const initialMainView: TView = {
    id: "0",
    icon: faTachometerAltFast,
    type: "main",
    itemName: EItemName.CAMPAIGN,
    timeframe: [new Date, new Date],
    reportItemName: null,
    page: 1,
    size: 50,
};

export const useViewsStore = create<IViewsState>()(
    persist(
        (set) => ({
            mainView: initialMainView,
            reportViews: [],
            makeNewReportView: (view) => set((state) => ({ reportViews: [...state.reportViews, view] })),
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
            updateViewReportItemNameById: (id, reportItemName) => set((state) => ({
                reportViews: state.reportViews.map(view => view.id === id && view.type === "report"
                    ? { ...view, reportItemName }
                    : view),
            })),
            updateViewReportChainById: (id, reportChain) => set((state) => ({
                reportViews: state.reportViews.map(view => view.id === id
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
