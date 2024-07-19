"use client";

import { useState } from "react";
import Rows from "./Rows";
import TitleRow from "./TitleRow";
import TotalRow from "./TotalRow";
import dataTableColumns, { TDataTableColumn } from "./dataTableColumns";
import { TView } from "@/lib/store";
import { TClick } from "@/lib/types";

export const ROW_HEIGHT = 30; // pixels
export const DEPTH_MARGIN = 20; // pixels
export const BASE_Z_INDEX = 100;

export type TColumn = TDataTableColumn & {
    width: number;
}

export type TRow = {
    id: number | string;
    name: string;
    clicks: TClick[];
    selected: boolean;
};

export default function DataTable({ view, rows, setRows, depth = 0 }: {
    view: TView;
    rows: TRow[];
    setRows: (newRows: TRow[]) => void;
    depth?: number;
}) {
    const [columns, setColumns] = useState<TColumn[]>(dataTableColumns.map((col, index) => ({
        ...col,
        width: index === 0 ? 300 : 100,
    })));

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
