"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import RowWrapper from "./RowWrapper";
import CheckboxWrapper from "./CheckboxWrapper";
import Cell from "./Cell";
import HeadlessDataTable from "./HeadlessDataTable";
import PosNegIndicator from "./PosNegIndicator";
import { TClick } from "@/lib/types";
import { TView } from "@/lib/store";
import { DEPTH_MARGIN, TColumn, TRow } from ".";

export default function Row({ row, columns, onSelected, view, depth }: {
    row: TRow;
    columns: TColumn[];
    onSelected: (selected: boolean) => void;
    view: TView;
    depth: number;
}) {
    const [open, setOpen] = useState<boolean>(false);
    const cells = makeCells(row.clicks, row.name);
    const profit = typeof cells[6] === "number" ? cells[6] : 0;

    function handleSelectionChange(selected: boolean) {
        if (depth > 0) return;
        if (view.type === "report" && view.reportChain[0]?.itemName) return;
        onSelected(selected);
    }

    return (
        <>
            <RowWrapper value={profit} selected={row.selected} onClick={handleSelectionChange}>
                <PosNegIndicator value={profit} />
                <CheckboxWrapper>
                    {view?.type === "main"
                        ? <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={() => handleSelectionChange(!row.selected)}
                        />
                        : (view?.type === "report" && view.reportChain[depth]?.itemName) &&
                        < FontAwesomeIcon
                            icon={open ? faChevronUp : faChevronDown}
                            onClick={() => setOpen(prev => !prev)}
                        />
                    }
                </CheckboxWrapper>
                {cells.map((value, index) => {
                    const { width, format } = columns[index];
                    return (
                        <Cell
                            key={index}
                            value={format && typeof value === "number" ? format(value) : value}
                            width={index === 0 ? width - DEPTH_MARGIN * depth : width}
                        />
                    )
                })}
            </RowWrapper >
            {open && view?.type === "report" &&
                <HeadlessDataTable
                    clicks={row.clicks}
                    itemName={view?.reportChain?.[depth]?.itemName}
                    columns={columns}
                    view={view}
                    depth={depth}
                />
            }
        </>
    )
}

export function makeCells(clicks: TClick[], name: string): (string | number)[] {
    const numVisits = calcVisits(clicks);
    const numClicks = calcClicks(clicks);
    const numConversions = calcConversions(clicks);
    const revenue = calcTotalRevenue(clicks);
    const cost = calcTotalCost(clicks);
    const profit = calcProfit(revenue, cost);
    const cpv = calcCostPerVisit(cost, numVisits);
    const cpc = calcCostPerClick(cost, numClicks);
    const cpcv = calcCostPerConversion(cost, numConversions);
    const ctr = calcClickThroughRate(numClicks, numVisits);
    const cvr = calcConversionRate(numConversions, numVisits);
    const roi = calcROI(revenue, cost);
    const epv = calcEarningsPerVisit(revenue, numVisits);
    const epc = calcEarningsPerClick(revenue, numClicks);

    return [
        name,
        numVisits,
        numClicks,
        numConversions,
        revenue,
        cost,
        profit,
        cpv,
        cpc,
        cpcv,
        ctr,
        cvr,
        roi,
        epv,
        epc
    ];
}

function calcVisits(clicks: TClick[]): number {
    return clicks.length;
}

function calcClicks(clicks: TClick[]): number {
    return clicks.filter(click => !!click.clickTime).length;
}

function calcConversions(clicks: TClick[]): number {
    return clicks.filter(click => !!click.convTime).length;
}

function calcTotalRevenue(clicks: TClick[]): number {
    return clicks.reduce((total, click) => total + click.revenue, 0);
}

function calcTotalCost(clicks: TClick[]): number {
    return clicks.reduce((total, click) => total + click.cost, 0);
}

function calcProfit(revenue: number, cost: number): number {
    return revenue - cost;
}

function calcCostPerVisit(cost: number, numVisits: number): number {
    return numVisits ? cost / numVisits : 0;
}

function calcCostPerClick(cost: number, numClicks: number): number {
    return numClicks ? cost / numClicks : 0;
}

function calcCostPerConversion(cost: number, numConversions: number): number {
    return numConversions ? cost / numConversions : 0;
}

function calcClickThroughRate(numClicks: number, numVisits: number): number {
    return numVisits ? numClicks / numVisits : 0;
}

function calcConversionRate(numConversions: number, numVisits: number): number {
    return numVisits ? numConversions / numVisits : 0;
}

function calcROI(revenue: number, cost: number): number {
    return cost ? (revenue - cost) / cost : 0;
}

function calcEarningsPerVisit(revenue: number, numVisits: number): number {
    return numVisits ? revenue / numVisits : 0;
}

function calcEarningsPerClick(revenue: number, numClicks: number): number {
    return numClicks ? revenue / numClicks : 0;
}