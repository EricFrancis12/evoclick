"use client";

import { useState, useRef, Fragment } from "react";
import useDragger from "@/hooks/useDragger";
import { EItemName, TClick } from "@/lib/types";

export default function DataTable({ itemName, rows, setRows }: {
    itemName: EItemName;
    rows: RowsHashMap;
    setRows: (rhm: RowsHashMap) => any;
}) {
    const [columns, setColumns] = useState<TColumn[]>(initialColumns);

    return (
        <div className="relative flex flex-col min-h-[400px] max-w-[100vw] overflow-x-scroll">
            <div className="absolute top-0 left-0 h-full">
                <TitleRow
                    name={itemName}
                    columns={columns}
                    setColumns={setColumns}
                />
                {Object.entries(rows).map(([name, row]) => (
                    <Row
                        key={name}
                        name={name}
                        row={row}
                        onSelected={bool => setRows({ ...rows, [name]: { ...rows[name], selected: bool } })}
                        columns={columns}
                    />
                ))}
            </div>
        </div>
    )
}

type TColumn = {
    title: string;
    width: string;
};

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

const initialColumns = columnTitles.map((title, i) => ({ title, width: i === 0 ? '300px' : '100px' }));

function TitleRow({ name, columns, setColumns }: {
    name: string;
    columns: TColumn[];
    setColumns: (cols: TColumn[]) => any;
}) {
    const mouseDownClientX = useRef<number>(0);

    const startDrag = useDragger((e, i) => {
        if (typeof i === "number") {
            const newWidth = `${parseFloat(columns[i].width) + e.clientX - mouseDownClientX.current}px`;
            setColumns(columns.map((col, index) => index === i ? { ...col, width: newWidth } : col));
        }
    });

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>, i: number) {
        mouseDownClientX.current = e.clientX;
        startDrag(e, i);
    }

    return (
        <RowWrapper>
            {columns.map(({ title, width }, index) => (
                <Fragment key={index}>
                    <Cell value={index === 0 ? name : title} width={width} />
                    <div className="relative h-auto w-[0px]">
                        <div
                            className="absolute top-0 left-0 h-full w-[1px] bg-blue-500 cursor-e-resize"
                            onMouseDown={e => handleMouseDown(e, index)}
                        />
                    </div>
                </Fragment>
            ))}
        </RowWrapper>
    )
}

export type TRow = {
    clicks: TClick[];
    selected: boolean;
};
export type RowsHashMap = Record<string, TRow>;

function Row({ name, row, columns, onSelected }: {
    name: keyof RowsHashMap;
    row: TRow;
    columns: TColumn[];
    onSelected: (newSelected: boolean) => any;
}) {
    const cells = makeCells(row.clicks, name);

    return (
        <RowWrapper selected={row.selected} setSelected={onSelected}>
            {cells.map((value, index) => (
                <Cell key={index} value={value} width={columns[index].width} />
            ))}
        </RowWrapper>
    )
}

function Cell({ value, width }: {
    value: string | number;
    width: string;
}) {
    return (
        <div className="px-1" style={{ width }}>
            {value}
        </div>
    )
}

function RowWrapper({ children, selected, setSelected = () => { } }: {
    children: React.ReactNode;
    selected?: boolean;
    setSelected?: (newSelected: boolean) => any;
}) {
    return (
        <div className="flex items-center w-full px-4">
            <div className="h-full w-[22px]">
                {selected !== undefined &&
                    <input
                        type="checkbox"
                        checked={selected === true}
                        onChange={() => setSelected(!selected)}
                    />
                }
            </div>
            {children}
        </div>
    )
}

function makeCells(clicks: TClick[], name: string): (string | number)[] {
    const numVisits = clicks.length;
    const numClicks = clicks.filter(click => !!click.clickTime).length;
    const numConversions = clicks.filter(click => !!click.convTime).length;
    const revenue = clicks.reduce((total, click) => total + click.revenue, 0);
    const cost = clicks.reduce((total, click) => total + click.cost, 0);
    const profit = revenue - cost;
    const cpv = (cost / numVisits) || 0;
    const cpc = (cost / numClicks) || 0;
    const cpcv = (cost / numConversions) || 0;
    const ctr = (numClicks / numVisits) || 0;
    const cvr = (numConversions / numVisits) || 0;
    const roi = ((revenue - cost) / cost) || 0;
    const epv = (revenue / numVisits) || 0;
    const epc = (revenue / numClicks) || 0;

    return [
        name,
        numVisits,
        numClicks,
        numConversions,
        revenue,
        cost,
        profit,
        cpv,              // cost per visit
        cpc,              // cost per click
        cpcv,             // cost per conversion
        ctr,              // clickthrough rate
        cvr,              // conversion rate
        roi,              // return on investment
        epv,              // earnings per visit
        epc,              // earnings per click    
    ];
}
