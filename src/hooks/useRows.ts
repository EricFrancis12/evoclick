"use client";

import { useState, useEffect } from "react";
import { itemNameToClickProp } from "@/lib/utils/maps";
import { useDataContext } from "@/contexts/DataContext";
import { TRow } from "@/app/dashboard/ReportView/DataTable";
import { EItemName, TClick, TPrimaryItemName, TPrimaryData } from "@/lib/types";
import { getPrimaryItemById, isPrimary } from "@/lib/utils";

const INCLUDE_UNKNOWN_ROWS = false;

export function useRows(clicks: TClick[], itemName: EItemName): [TRow[] | null, React.Dispatch<React.SetStateAction<TRow[] | null>>] {
    const { primaryData } = useDataContext();

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
                const rowName = newRowName(primaryData, primaryItemName, value);
                if (!rowName && !INCLUDE_UNKNOWN_ROWS) continue;

                rows.set(value, {
                    id: value,
                    name: rowName,
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

    return "";
}


function makeEnrichmentItems(itemName: EItemName, primaryData: TPrimaryData): TEnrichmentItem[] | undefined {
    const { primaryItemName } = isPrimary(itemName);
    if (!primaryItemName) return undefined;
    return primaryData[primaryItemName]?.map(({ id, name }) => ({ id, name: name || "" }));
}
