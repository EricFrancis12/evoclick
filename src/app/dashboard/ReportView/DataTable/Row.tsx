"use client";

import RowWrapper from "./RowWrapper";
import Cell from "./Cell";
import { TClick } from "@/lib/types";
import { TColumn, TRow } from ".";

export default function Row({ row, columns, onSelected }: {
    row: TRow;
    columns: TColumn[];
    onSelected: (newSelected: boolean) => any;
}) {
    const cells = makeCells(row.clicks, row.name);

    return (
        <RowWrapper selected={row.selected} setSelected={onSelected}>
            {cells.map((value, index) => (
                <Cell key={index} value={value} width={columns[index].width} />
            ))}
        </RowWrapper>
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
