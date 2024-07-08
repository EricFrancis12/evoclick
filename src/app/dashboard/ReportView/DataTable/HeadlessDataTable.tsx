"use client";

import { useRows } from "../Report";
import Rows from "./Rows";
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
    return itemName
        ? <div className="py-4 bg-blue-200">
            <_Rows
                clicks={clicks}
                itemName={itemName}
                columns={columns}
                view={view}
                depth={depth}
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

    return (
        <Rows
            rows={rows}
            setRows={setRows}
            columns={columns}
            view={view}
            depth={depth + 1}
        />
    )
}
