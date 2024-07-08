"use client";

import { useState } from "react";
import { TClick } from "@/lib/types";
import Rows from "./Rows";
import TitleRow from "./TitleRow";
import { TView } from "@/lib/store";

export type TColumn = {
    title: string;
    width: string;
};

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
    const [columns, setColumns] = useState<TColumn[]>(columnTitles.map((title, index) => ({
        title,
        width: index === 0 ? "300px" : "100px",
    })));

    return (
        <div className="relative flex flex-col min-h-[400px] max-w-[100vw] overflow-x-scroll">
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
            </div>
        </div>
    )
}

export const columnTitles = [
    "Name",
    "Visits",
    "Clicks",
    "Conversions",
    "Revenue",
    "Cost",
    "Profit",
    "CPV",
    "CPC",
    "CPCV",
    "CTR",
    "CVR",
    "ROI",
    "EPV",
    "EPC",
];
