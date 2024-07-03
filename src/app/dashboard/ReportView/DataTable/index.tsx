"use client";

import { useState } from "react";
import { EItemName, TClick } from "@/lib/types";
import Row from "./Row";
import TitleRow from "./TitleRow";

export type TColumn = {
    title: string;
    width: string;
};

export type TRow = {
    name: string;
    clicks: TClick[];
    selected: boolean;
};

export default function DataTable({ itemName, rows, setRows }: {
    itemName: EItemName;
    rows: TRow[];
    setRows: (newRows: TRow[]) => any;
}) {
    const [columns, setColumns] = useState<TColumn[]>(columnTitles.map((title, i) => ({
        title, width: i === 0
            ? '300px'
            : '100px'
    })));

    return (
        <div className="relative flex flex-col min-h-[400px] max-w-[100vw] overflow-x-scroll">
            <div className="absolute top-0 left-0 h-full">
                <TitleRow
                    name={itemName}
                    columns={columns}
                    setColumns={setColumns}
                />
                {rows.map(row => (
                    <Row
                        key={row.name}
                        row={row}
                        onSelected={selected => setRows(rows.map(_row => _row.name === row.name ? { ..._row, selected } : _row))}
                        columns={columns}
                    />
                ))}
            </div>
        </div>
    )
}

const columnTitles = [
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
