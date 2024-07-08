"use client";

import Row from "./Row";
import { TView } from "@/lib/store";
import { TRow, TColumn } from ".";

export default function Rows({ rows, setRows, columns, view, depth }: {
    rows: TRow[];
    setRows: (rows: TRow[]) => any;
    columns: TColumn[];
    view: TView;
    depth: number;
}) {
    return rows.map(row => (
        <Row
            key={row.id}
            row={row}
            onSelected={selected => setRows(rows.map(_row => _row.id === row.id ? { ..._row, selected } : _row))}
            columns={columns}
            view={view}
            depth={depth}
        />
    ));
}
