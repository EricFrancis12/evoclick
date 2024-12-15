"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronUp, faChevronDown, faShuffle, faPencil,
    faTrash, faCopy, faLink, faExternalLink
} from "@fortawesome/free-solid-svg-icons";
import { TDialogueMenuItem } from "../../../contexts/DialogueMenuContext";
import useNewReport from "@/hooks/useNewReport";
import RowWrapper from "./RowWrapper";
import CheckboxWrapper from "./CheckboxWrapper";
import Cell from "./Cell";
import HeadlessDataTable from "./HeadlessDataTable";
import PosNegIndicator from "./PosNegIndicator";
import { makeActionMenu } from "../LowerControlPanel";
import { TView } from "@/lib/store";
import { DEPTH_MARGIN, safeIndexCols, TColumn, TRow } from ".";
import { EItemName } from "@/lib/types";
import { useDataContext } from "@/contexts/DataContext";
import { useActionMenuContext } from "../../../contexts/ActionMenuContext";
import { getPrimaryItemById, isPrimary } from "@/lib/utils";
import { copyToClipboard } from "@/lib/utils/client";
import columnsMap, { EColumnTitle, makeCells, TColumnsMap } from "./columnsMap";

export default function Row({ row, columns, onSelected, view, depth }: {
    row: TRow;
    columns: TColumn[];
    onSelected: (selected: boolean) => void;
    view: TView;
    depth: number;
}) {
    const { primaryData } = useDataContext();
    const { setActionMenu } = useActionMenuContext();

    const [open, setOpen] = useState<boolean>(false);
    const cells = makeCells(columnsMap, row.clicks, row.name);
    const profit = safeGetProfit(columnsMap, cells)

    const { primaryItemName } = isPrimary(view.itemName);

    const newReport = useNewReport();

    function handleSelectionChange(selected: boolean) {
        if (depth > 0) return;
        if (view.type === "report" && view.reportChain[0]?.value) return;
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
                setActionMenu({ type: "Delete Items", primaryItemName, ids: [row.id] });
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
                setActionMenu({ type: "Campaign Links", campaignId: row.id })
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
                dataset={{ ["data-cy"]: row.name }}
            >
                <PosNegIndicator value={profit} />
                <CheckboxWrapper>
                    {view?.type === "main"
                        ? <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={() => handleSelectionChange(!row.selected)}
                        />
                        : (view?.type === "report" && view.reportChain[depth]?.value) &&
                        < FontAwesomeIcon
                            icon={open ? faChevronUp : faChevronDown}
                            onClick={() => setOpen(prev => !prev)}
                        />
                    }
                </CheckboxWrapper>
                {cells.map((value, index) => {
                    const { width, format } = safeIndexCols(columns, index);
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
                    reportChainValue={view?.reportChain?.[depth]?.value}
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

export function safeGetProfit(columnsMap: TColumnsMap, cells: (string | number)[]): number {
    // Retrieve the column index for 'Profit' from the columns map
    const profitColumnIndex = columnsMap.get(EColumnTitle.Profit)?.index;
    // Check if the index is valid and exists within the cells array
    if (profitColumnIndex !== undefined && profitColumnIndex < cells.length) {
        const profitValue = cells[profitColumnIndex];
        return typeof profitValue === 'number' ? profitValue : 0;
    }
    return 0;
}
