"use client";

import Cell from "./Cell";
import CheckboxWrapper from "./CheckboxWrapper";
import PosNegIndicator from "./PosNegIndicator";
import RowWrapper from "./RowWrapper";
import { makeCells } from "./Row";
import { BASE_Z_INDEX, DEPTH_MARGIN, TColumn, TRow } from ".";

export default function TotalRow({ rows, columns, depth }: {
    rows: TRow[];
    columns: TColumn[];
    depth: number;
}) {
    const cells = makeCellsTotal(rows, columns);
    const profit = typeof cells[6] === "number" ? cells[6] : 0;

    return (
        <RowWrapper
            value={profit}
            selected={false}
            style={{
                position: depth === 0 ? "sticky" : "static",
                bottom: depth === 0 ? "0px" : undefined,
                borderTop: "solid grey 2px",
                borderBottom: "solid grey 2px",
                borderLeft: depth === 0 ? undefined : "solid grey 2px",
                zIndex: depth === 0 ? BASE_Z_INDEX : undefined,
            }}
        >
            <PosNegIndicator value={profit} />
            <CheckboxWrapper />
            {cells.map((value, index) => {
                const { width, format } = columns[index];
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
        const cells = makeCells(row.clicks, row.name);
        cells.slice(1).forEach((cell, index) => {
            if (typeof cell === "number") {
                sums[index] += cell;
            }
        });
    });

    return ["", ...sums.map((sum, index) => indexesToBeAveraged.includes(index) ? (sum / rows.length) || 0 : sum)];
}
