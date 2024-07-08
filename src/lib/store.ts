import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IconDefinition, faTachometerAltFast } from "@fortawesome/free-solid-svg-icons";
import { TReportChain } from "@/app/dashboard/ReportView/ReportChain";
import { defaultTimeframe } from "./constants";
import { EItemName } from "./types";
import { parseISO } from "date-fns";

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

export function newMainView(itemName: EItemName, icon: IconDefinition): TView {
    return {
        id: "0",
        itemName,
        type: "main",
        icon,
        timeframe: defaultTimeframe,
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
        timeframe: defaultTimeframe,
        reportItemName,
        reportChain: [{}, null],
    };
}

const initialMainView = newMainView(EItemName.CAMPAIGN, faTachometerAltFast);

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
            name: "views-storage",
            storage: createJSONStorage(() => sessionStorage, {
                replacer: (_, value) => {
                    const val = replacerTypeCheck(value);
                    if (val) {
                        return { type: "ZUSTAND_TIMEFRAME_REPLACER", value: datesToISO(val) };
                    }
                    return value;
                },
                reviver: (_, value) => {
                    const val = reviverTypeCheck(value);
                    if (val) {
                        return datesParseISO(val);
                    }
                    return value;
                },
            }),
        },
    ),
);

function replacerTypeCheck(value: unknown): Date[] | null {
    if (Array.isArray(value)
        && value.length === 2
        && value[0] instanceof Date
        && value[1] instanceof Date
    ) {
        return value as Date[];
    }
    return null;
}

function reviverTypeCheck(value: unknown): string[] | null {
    if (!!value
        && typeof value === "object"
        && "type" in value
        && value.type === "ZUSTAND_TIMEFRAME_REPLACER"
        && "value" in value
        && Array.isArray(value.value)
        && value.value.length === 2
        && typeof value.value[0] === "string"
        && typeof value.value[1] === "string"
    ) {
        return value.value as string[];
    }
    return null;
}

function datesToISO(dates: Date[]): string[] {
    return dates.map(date => date.toISOString());
}

function datesParseISO(strings: string[]): Date[] {
    return strings.map(str => parseISO(str));
}
