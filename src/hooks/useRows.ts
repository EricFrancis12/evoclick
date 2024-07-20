"use client";

import { useState, useEffect } from "react";
import { itemNameToClickProp } from "@/lib/utils/maps";
import { TPrimaryData, useReportView } from "@/app/dashboard/ReportView/ReportViewContext";
import { TRow } from "@/app/dashboard/ReportView/DataTable";
import { EItemName, TClick } from "@/lib/types";

export function useRows(clicks: TClick[], itemName: EItemName) {
    const { primaryData } = useReportView();

    const [rows, setRows] = useState<TRow[] | null>(null);

    useEffect(() => {
        const newRows = makeRows(clicks, itemName, makeEnrichWith(itemName, primaryData));
        setRows(newRows);
    }, [clicks.length, primaryData, itemName]);

    const value: [TRow[] | null, React.Dispatch<React.SetStateAction<TRow[] | null>>] = [rows, setRows];
    return value;
}

type TEnrichWith = {
    id: number;
    name: string;
};

function makeRows(clicks: TClick[], itemName: EItemName, enrichWith?: TEnrichWith[]): TRow[] {
    const rows = clicks.reduce((rows: TRow[], click: TClick) => {
        const clickProp = itemNameToClickProp(itemName);
        const value = clickProp ? click[clickProp] : null;
        if (value && (typeof value === "number" || typeof value === "string")) {
            const index = rows.findIndex(row => row.id === value);
            if (index !== -1) {
                rows[index].clicks.push(click);
            } else {
                rows.push({
                    id: value,
                    name: typeof value === "string" ? value : "",
                    clicks: [click],
                    selected: false,
                });
            }
        }
        return rows;
    }, []);

    if (enrichWith) {
        for (let i = 0; i < enrichWith.length; i++) {
            const { id, name } = enrichWith[i];
            if (rows.some(row => row.id === id)) continue;
            rows.push({
                id,
                name,
                clicks: [],
                selected: false,
            });
        }
    }

    return rows;
}

function makeEnrichWith(itemName: EItemName, primaryData: TPrimaryData): TEnrichWith[] | undefined {
    return itemNameInPrimaryData(itemName, primaryData)?.map(({ id, name }) => ({ id, name: name || "" }));
}

function itemNameInPrimaryData(itemName: EItemName, primaryData: TPrimaryData) {
    switch (itemName) {
        case EItemName.AFFILIATE_NETWORK:
            return primaryData.affiliateNetworks;
        case EItemName.CAMPAIGN:
            return primaryData.campaigns;
        case EItemName.FLOW:
            return primaryData.flows;
        case EItemName.LANDING_PAGE:
            return primaryData.landingPages;
        case EItemName.OFFER:
            return primaryData.offers;
        case EItemName.TRAFFIC_SOURCE:
            return primaryData.trafficSources;
        default:
            return undefined;
    }
}
