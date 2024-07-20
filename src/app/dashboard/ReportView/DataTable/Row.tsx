"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronUp, faChevronDown, faShuffle, faPencil,
    faTrash, faCopy, faLink, faExternalLink
} from "@fortawesome/free-solid-svg-icons";
import { TDialogueMenuItem } from "../contexts/DialogueMenuContext";
import useNewReport from "@/hooks/useNewReport";
import RowWrapper from "./RowWrapper";
import CheckboxWrapper from "./CheckboxWrapper";
import Cell from "./Cell";
import HeadlessDataTable from "./HeadlessDataTable";
import PosNegIndicator from "./PosNegIndicator";
import { makeActionMenu } from "../LowerControlPanel";
import { TView } from "@/lib/store";
import { DEPTH_MARGIN, TColumn, TRow } from ".";
import { EItemName, TClick } from "@/lib/types";
import { useReportView } from "../ReportViewContext";
import { getPrimaryItemById, itemNameIsPrimary } from "@/lib/utils";
import { copyToClipboard } from "@/lib/utils/client";

export default function Row({ row, columns, onSelected, view, depth }: {
    row: TRow;
    columns: TColumn[];
    onSelected: (selected: boolean) => void;
    view: TView;
    depth: number;
}) {
    const { primaryData, setActionMenu } = useReportView();

    const [open, setOpen] = useState<boolean>(false);
    const cells = makeCells(row.clicks, row.name);
    const profit = typeof cells[6] === "number" ? cells[6] : 0;

    const { primaryItemName } = itemNameIsPrimary(view.itemName);

    const newReport = useNewReport();

    function handleSelectionChange(selected: boolean) {
        if (depth > 0) return;
        if (view.type === "report" && view.reportChain[0]?.itemName) return;
        onSelected(selected);
    }

    const dialogueMenuItems: TDialogueMenuItem[] = [
        {
            text: "Report",
            icon: faShuffle,
            onClick: () => newReport(view.itemName, row.id.toString(), view.timeframe),
        },
        {
            text: "Edit",
            icon: faPencil,
            onClick: () => {
                if (typeof row.id !== "number") return;
                setActionMenu(makeActionMenu(primaryData, view.itemName, row.id));
            },
        },
        {
            text: "Delete",
            icon: faTrash,
            onClick: () => {
                if (!primaryItemName || typeof row.id !== "number") return;
                setActionMenu({ type: "delete item", primaryItemName, ids: [row.id] });
            },
        },
        {
            text: "Copy URL",
            icon: faCopy,
            onClick: () => {
                if (!primaryItemName || !hasURLProp(primaryItemName) || typeof row.id !== "number") return;
                const item = getPrimaryItemById(primaryData, primaryItemName, row.id);
                if (item && "url" in item) copyToClipboard(item.url);
            },
        },
        {
            text: "Open URL",
            icon: faExternalLink,
            onClick: () => {
                if (!primaryItemName || !hasURLProp(primaryItemName) || typeof row.id !== "number") return;
                const item = getPrimaryItemById(primaryData, primaryItemName, row.id);
                if (item && "url" in item) window.open(item.url, "_blank");
            },
        },
        {
            text: "Campaign Links",
            icon: faLink,
            onClick: () => {
                if (view.itemName !== EItemName.CAMPAIGN || typeof row.id !== "number") return;
                setActionMenu({ type: "campaign links", campaignId: row.id })
            },
        },
    ];

    return (
        <>
            <RowWrapper
                value={profit}
                selected={row.selected}
                onClick={handleSelectionChange}
                dialogueMenuItems={dialogueMenuItems}
            >
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

function hasURLProp(itemName: EItemName): boolean {
    if (itemName === EItemName.LANDING_PAGE
        || itemName === EItemName.OFFER
    ) return true;
    return false;
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