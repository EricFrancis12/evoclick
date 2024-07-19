"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faCircle, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
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

    useEffect(() => {
        if (open) setOpen(false);
    }, [view.reportChain]);

    function handleSelectionChange(selected: boolean) {
        if (view.type === "report" && view.reportChain[0]?.itemName) return;
        onSelected(selected);
    }

    return (
        <>
            <RowWrapper value={profit} selected={row.selected} onClick={handleSelectionChange}>
                <PosNegIndicator value={profit} />
                <CheckboxWrapper>
                    {view?.type === "report" && view.reportChain[depth]?.itemName
                        ? <FontAwesomeIcon
                            icon={open ? faChevronUp : faChevronDown}
                            onClick={() => setOpen(prev => !prev)}
                        />
                        : <>
                            {row.selected !== undefined &&
                                <input
                                    type="checkbox"
                                    checked={row.selected}
                                    onChange={() => handleSelectionChange(!row.selected)}
                                />
                            }
                        </>
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
