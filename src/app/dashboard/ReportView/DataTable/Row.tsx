"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import RowWrapper from "./RowWrapper";
import CheckboxWrapper from "./CheckboxWrapper";
import Cell from "./Cell";
import HeadlessDataTable from "./HeadlessDataTable";
import { TClick } from "@/lib/types";
import { TView } from "@/lib/store";
import { TColumn, TRow } from ".";

export default function Row({ row, columns, onSelected, view, depth }: {
    row: TRow;
    columns: TColumn[];
    onSelected: (selected: boolean) => void;
    view: TView;
    depth: number;
}) {
    const [open, setOpen] = useState<boolean>(false);
    const cells = makeCells(row.clicks, row.name);

    useEffect(() => {
        if (open) setOpen(false);
    }, [view.reportChain]);

    function handleSelectionChange(selected: boolean) {
        if (view.type === "report" && view.reportChain[0]?.itemName) return;
        onSelected(selected);
    }

    return (
        <>
            <RowWrapper selected={row.selected} onClick={handleSelectionChange}>
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
                {cells.map((value, index) => (
                    <Cell
                        key={index}
                        value={value}
                        width={columns[index].width}
                    />
                ))}
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

function makeCells(clicks: TClick[], name: string): (number | string)[] {
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
