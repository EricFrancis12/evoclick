"use client";

import { useState, useEffect } from "react";
import { itemNameToClickProp } from "@/lib/utils/maps";
import { useDataContext } from "@/contexts/DataContext";
import { TRow } from "@/views/ReportView/DataTable";
import { EItemName, TClick, TPrimaryItemName, TPrimaryData, TToken } from "@/lib/types";
import { getPrimaryItemById, isPrimary } from "@/lib/utils";
import { reportChainValueToItemName, TReportChainValue } from "@/views/ReportView/ReportChain";

const INCLUDE_UNKNOWN_ROWS = false;

export function useRows(
    clicks: TClick[],
    reportChainValue: TReportChainValue,
): [TRow[] | null, React.Dispatch<React.SetStateAction<TRow[] | null>>] {
    const { primaryData } = useDataContext();

    const [rows, setRows] = useState<TRow[] | null>(null);

    useEffect(() => {
        const newRows = makeRows(primaryData, clicks, reportChainValue, makeEnrichmentItems(reportChainValue, primaryData));
        setRows(newRows);
    }, [clicks.length, primaryData, reportChainValue]);

    return [rows, setRows];
}

type TEnrichmentItem = {
    id: number;
    name: string;
};

export function makeRows(
    primaryData: TPrimaryData,
    clicks: TClick[],
    reportChainValue: TReportChainValue,
    enrichmentItems?: TEnrichmentItem[],
): TRow[] {
    const rows = new Map<number | string, TRow>();

    const { itemName } = reportChainValueToItemName(reportChainValue);

    let primaryItemName: TPrimaryItemName | null = null;
    if (itemName) {
        primaryItemName = isPrimary(itemName).primaryItemName;
    }

    for (const click of clicks) {
        let value: string | number | Date | TToken[] | null;
        if (itemName) {
            const clickProp = itemNameToClickProp(itemName);
            value = click[clickProp];
        } else {
            // Traverse click.tokens to find token that matches reportChainValue
            value = click.tokens.find(token => token.queryParam === reportChainValue)?.value ?? null;
        }

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

function newRowName(
    primaryData: TPrimaryData,
    primaryItemName: TPrimaryItemName | null,
    value: string | number,
): string {
    if (typeof value === "number" && primaryItemName !== null) {
        const primaryItem = getPrimaryItemById(primaryData, primaryItemName, value);
        if (primaryItem) return primaryItem.name;
    }

    if (value && typeof value === "string") return value;

    return "";
}

function makeEnrichmentItems(
    reportChainValue: TReportChainValue,
    primaryData: TPrimaryData,
): TEnrichmentItem[] | undefined {
    const { itemName, success } = reportChainValueToItemName(reportChainValue);
    if (!success) return undefined;

    const { primaryItemName } = isPrimary(itemName);
    if (!primaryItemName) return undefined;

    return primaryData[primaryItemName]?.map(({ id, name }) => ({ id, name: name || "" }));
}
