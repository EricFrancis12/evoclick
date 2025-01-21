"use client";

import { useState } from "react";
import Rows from "./Rows";
import TitleRow from "./TitleRow";
import TotalRow from "./TotalRow";
import columnsMap, { TDataTableColumn, TColumnsMap } from "./columnsMap";
import { TView } from "@/lib/store";
import { TClick } from "@/lib/types";

export const ROW_HEIGHT = 30; // pixels
export const DEPTH_MARGIN = 20; // pixels
export const BASE_Z_INDEX = 50;

export type TRow = {
    id: number | string;
    name: string;
    clicks: TClick[];
    selected: boolean;
};

export type TColumn = TDataTableColumn & {
    width: number;
}

type SafeIndexColsResult = {
    width: number;
    format?: (value: number) => string;
};

export function safeIndexCols(columns: TColumn[], index: number): SafeIndexColsResult {
    return columns[index] ?? { width: 0 };
}

export default function DataTable({ view, rows, setRows, depth = 0 }: {
    view: TView;
    rows: TRow[];
    setRows: (newRows: TRow[]) => void;
    depth?: number;
}) {
    const [columns, setColumns] = useState<TColumn[]>(makeInitialColumns(columnsMap));

    return (
        <div className="relative flex flex-col flex-1 max-w-[100vw] overflow-x-scroll">
            <div className="absolute top-0 left-0">
                <TitleRow
                    name={view?.itemName}
                    columns={columns}
                    setColumns={setColumns}
                />
                <Rows
                    rows={rows}
                    setRows={setRows}
                    columns={columns}
                    view={view}
                    depth={depth}
                />
                <TotalRow
                    rows={rows}
                    columns={columns}
                    depth={depth}
                />
            </div>
        </div>
    )
}

function makeInitialColumns(columnsMap: TColumnsMap): TColumn[] {
    return Array.from(columnsMap).map(([title, value], index) => {
        const { calcValue, format } = value.dtc;
        return {
            title,
            calcValue,
            format,
            width: index === 0 ? 300 : 100,
        };
    })
}
