"use client";

import React, { useContext } from "react";
import { TPrimaryData, TClick } from "@/lib/types";

export type TDataContext = {
    primaryData: TPrimaryData;
    clicks: TClick[];
};

const DataContext = React.createContext<TDataContext | null>(null);

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataContext provider");
    }
    return context;
}

export function DataProvider({ primaryData, clicks, children }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    children: React.ReactNode;
}) {
    const value = {
        primaryData,
        clicks,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider >
    )
}
