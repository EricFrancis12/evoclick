"use client";

import { useRows } from "@/hooks/useRows";
import Rows from "./Rows";
import { reportChainColors } from "../ReportChain";
import { EItemName, TClick } from "@/lib/types";
import { TView } from "@/lib/store";
import { TColumn } from ".";

export default function HeadlessDataTable({ clicks, itemName, columns, view, depth }: {
    clicks: TClick[];
    itemName?: EItemName;
    columns: TColumn[];
    view: TView;
    depth: number;
}) {
    const newDepth = depth + 1;

    return itemName
        ? <div
            className="py-4 bg-blue-200"
            style={{ backgroundColor: reportChainColors[newDepth]?.light }}
        >
            <_Rows
                clicks={clicks}
                itemName={itemName}
                columns={columns}
                view={view}
                depth={newDepth}
            />
        </div>
        : "";
}

function _Rows({ clicks, itemName, columns, view, depth }: {
    clicks: TClick[];
    itemName: EItemName;
    columns: TColumn[];
    view: TView;
    depth: number;
}) {
    const [rows, setRows] = useRows(clicks, itemName);

    return rows
        ? <Rows
            rows={rows}
            setRows={setRows}
            columns={columns}
            view={view}
            depth={depth}
        />
        : "";
}
