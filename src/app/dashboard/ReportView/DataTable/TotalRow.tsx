"use client";

import Cell from "./Cell";
import CheckboxWrapper from "./CheckboxWrapper";
import PosNegIndicator from "./PosNegIndicator";
import RowWrapper from "./RowWrapper";
import { safeGetProfit } from "./Row";
import { BASE_Z_INDEX, DEPTH_MARGIN, safeIndexCols, TColumn, TRow } from ".";
import columnsMap, { makeCells } from "./columnsMap";

const border = "solid grey 2px";

export default function TotalRow({ rows, columns, depth }: {
    rows: TRow[];
    columns: TColumn[];
    depth: number;
}) {
    const cells = makeCellsTotal(rows, columns);
    const profit = safeGetProfit(columnsMap, cells);

    return (
        <RowWrapper
            value={profit}
            selected={false}
            style={{
                position: depth === 0 ? "sticky" : "static",
                bottom: depth === 0 ? "0px" : undefined,
                borderTop: border,
                borderBottom: border,
                borderLeft: depth === 0 ? undefined : border,
                zIndex: depth === 0 ? BASE_Z_INDEX : undefined,
            }}
        >
            <PosNegIndicator value={profit} />
            <CheckboxWrapper />
            {cells.map((value, index) => {
                const { width, format } = safeIndexCols(columns, index);
                return (
                    <Cell
                        key={index}
                        value={typeof value === "number" ? format ? format(value) : value : "Total"}
                        width={index === 0 ? width - DEPTH_MARGIN * depth : width}
                        className="font-bold"
                    />
                )
            })}
        </RowWrapper>
    )
}

const indexesToBeAveraged: number[] = [6, 7, 8, 9, 10, 12, 13];

function makeCellsTotal(rows: TRow[], columns: TColumn[]): (string | number)[] {
    const sums: number[] = new Array(columns.length - 1).fill(0);

    rows.forEach(row => {
        const cells = makeCells(columnsMap, row.clicks, row.name);
        cells.slice(1).forEach((cell, index) => {
            if (typeof cell === "number" && sums[index] !== undefined) {
                sums[index] += cell;
            }
        });
    });

    return ["", ...sums.map((sum, index) => indexesToBeAveraged.includes(index) ? (sum / rows.length) || 0 : sum)];
}
