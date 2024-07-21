"use client";

import React, { useState, useContext } from "react";
import { PopoverLayer } from "@/components/popover";
import ActionMenu from "./ActionMenu";
import { TActionMenu } from "./ActionMenu/types";
import { TAffiliateNetwork, TCampaign, TClick, TSavedFlow, TLandingPage, TOffer, TTrafficSource, EItemName } from "@/lib/types";

export type TPrimaryData = {
    [EItemName.AFFILIATE_NETWORK]: TAffiliateNetwork[];
    [EItemName.CAMPAIGN]: TCampaign[];
    [EItemName.FLOW]: TSavedFlow[];
    [EItemName.LANDING_PAGE]: TLandingPage[];
    [EItemName.OFFER]: TOffer[];
    [EItemName.TRAFFIC_SOURCE]: TTrafficSource[];
};

export type TReportViewContext = {
    primaryData: TPrimaryData;
    clicks: TClick[];
    actionMenu: TActionMenu | null;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
};

const ReportViewContext = React.createContext<TReportViewContext | null>(null);

export function useReportView() {
    const context = useContext(ReportViewContext);
    if (!context) {
        throw new Error("useReportView must be used within a ReportViewContext provider");
    }
    return context;
}

export function ReportViewProvider({ primaryData, clicks, children }: {
    primaryData: TPrimaryData;
    clicks: TClick[];
    children: React.ReactNode;
}) {
    const [actionMenu, setActionMenu] = useState<TActionMenu | null>(null);

    const value = {
        primaryData,
        clicks,
        actionMenu,
        setActionMenu,
    };

    return (
        <ReportViewContext.Provider value={value}>
            {actionMenu &&
                <PopoverLayer layer={1}>
                    <ActionMenu actionMenu={actionMenu} setActionMenu={setActionMenu} />
                </PopoverLayer>
            }
            {children}
        </ReportViewContext.Provider >
    )
}
