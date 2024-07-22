"use client";

import { useState, useEffect } from "react";
import { itemNameToClickProp } from "@/lib/utils/maps";
import { TPrimaryData, useReportView } from "@/app/dashboard/ReportView/ReportViewContext";
import { TRow } from "@/app/dashboard/ReportView/DataTable";
import { EItemName, TClick, TPrimaryItemName } from "@/lib/types";
import { getPrimaryItemById, isPrimary } from "@/lib/utils";

export function useRows(
    clicks: TClick[],
    itemName: EItemName
): [TRow[] | null, React.Dispatch<React.SetStateAction<TRow[] | null>>] {
    const { primaryData } = useReportView();

    const [rows, setRows] = useState<TRow[] | null>(null);

    useEffect(() => {
        const newRows = makeRows(primaryData, clicks, itemName, makeEnrichmentItems(itemName, primaryData));
        setRows(newRows);
    }, [clicks.length, primaryData, itemName]);

    return [rows, setRows];
}

type TEnrichmentItem = {
    id: number;
    name: string;
};

function makeRows(
    primaryData: TPrimaryData,
    clicks: TClick[],
    itemName: EItemName,
    enrichmentItems?: TEnrichmentItem[]
): TRow[] {
    const rows = new Map<number | string, TRow>();
    const { primaryItemName } = isPrimary(itemName);

    for (const click of clicks) {
        const clickProp = itemNameToClickProp(itemName);
        const value = click[clickProp];

        if (typeof value === "number" || typeof value === "string") {
            if (!rows.has(value)) {
                rows.set(value, {
                    id: value,
                    name: newRowName(primaryData, primaryItemName, value),
                    clicks: [],
                    selected: false,
                });
            }
            rows.get(value)!.clicks.push(click);
        }
    }

    if (enrichmentItems) {
        for (const { id, name } of enrichmentItems) {
            if (!rows.has(id)) {
                rows.set(id, {
                    id,
                    name,
                    clicks: [],
                    selected: false,
                });
            }
        }
    }

    return Array.from(rows.values());
}

function newRowName(primaryData: TPrimaryData, primaryItemName: TPrimaryItemName | null, value: string | number): string {
    if (typeof value === "number" && primaryItemName !== null) {
        const primaryItem = getPrimaryItemById(primaryData, primaryItemName, value);
        if (primaryItem) return primaryItem.name;
    }

    if (value && typeof value === "string") return value;

    return "unknown";
}


function makeEnrichmentItems(itemName: EItemName, primaryData: TPrimaryData): TEnrichmentItem[] | undefined {
    const { primaryItemName } = isPrimary(itemName);
    if (!primaryItemName) return undefined;
    return primaryData[primaryItemName]?.map(({ id, name }) => ({ id, name: name || "" }));
}
