"use client";

import { useState, useEffect } from "react";
import { itemNameToClickProp } from "@/lib/utils/maps";
import { TPrimaryData, useReportView } from "@/app/dashboard/ReportView/ReportViewContext";
import { TRow } from "@/app/dashboard/ReportView/DataTable";
import { EItemName, TClick } from "@/lib/types";
import { isPrimary } from "@/lib/utils";

export function useRows(clicks: TClick[], itemName: EItemName) {
    const { primaryData } = useReportView();

    const [rows, setRows] = useState<TRow[] | null>(null);

    useEffect(() => {
        const newRows = makeRows(clicks, itemName, makeEnrichmentItems(itemName, primaryData));
        setRows(newRows);
    }, [clicks.length, primaryData, itemName]);

    const value: [TRow[] | null, React.Dispatch<React.SetStateAction<TRow[] | null>>] = [rows, setRows];
    return value;
}

type TEnrichmentItem = {
    id: number;
    name: string;
};

function makeRows(clicks: TClick[], itemName: EItemName, enrichmentItems?: TEnrichmentItem[]): TRow[] {
    const rows = clicks.reduce((rows: TRow[], click: TClick) => {
        const clickProp = itemNameToClickProp(itemName);
        const value = clickProp ? click[clickProp] : null;
        if (value && (typeof value === "number" || typeof value === "string")) {
            const row = rows.find(row => row.id === value);
            if (row) {
                row.clicks.push(click);
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

    if (enrichmentItems) {
        for (const { id, name } of enrichmentItems) {
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

function makeEnrichmentItems(itemName: EItemName, primaryData: TPrimaryData): TEnrichmentItem[] | undefined {
    const { primaryItemName } = isPrimary(itemName);
    if (!primaryItemName) return undefined;
    return primaryData[primaryItemName]?.map(({ id, name }) => ({ id, name: name || "" }));
}
