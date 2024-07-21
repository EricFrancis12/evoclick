"use client";

import { useRows } from "@/hooks/useRows";
import Rows from "./Rows";
import TotalRow from "./TotalRow";
import { getReportChainColor } from "../ReportChain/colors";
import { TView } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";
import { BASE_Z_INDEX, DEPTH_MARGIN, ROW_HEIGHT, TColumn } from ".";

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
            className="py-4"
            style={{
                backgroundColor: getReportChainColor(newDepth).light,
                paddingLeft: `${DEPTH_MARGIN}px`
            }}
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

    return (
        <>
            <div
                className="flex items-center px-1 font-bold"
                style={{
                    position: "sticky",
                    top: `${ROW_HEIGHT * depth}px`,
                    height: `${ROW_HEIGHT}px`,
                    paddingLeft: `${DEPTH_MARGIN * 3}px`,
                    backgroundColor: getReportChainColor(depth).light,
                    zIndex: BASE_Z_INDEX - depth,
                }}
            >
                {itemName}
            </div>
            {rows &&
                <>
                    <Rows
                        rows={rows}
                        setRows={setRows}
                        columns={columns}
                        view={view}
                        depth={depth}
                    />
                    <TotalRow
                        rows={rows}
                        columns={columns}
                        depth={depth}
                    />
                </>
            }
        </>
    )
}
