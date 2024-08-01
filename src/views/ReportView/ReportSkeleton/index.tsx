"use client";

import UpperControlPanelSkeleton from "./UpperControlPanelSkeleton";
import LowerControlPanelSkeleton from "./LowerControlPanelSkeleton";
import DataTableSkeleton from "./DataTableSkeleton";
import { EItemName } from "@/lib/types";
import "./skeleton.css";

export default function ReportSkeleton({ reportItemName }: {
    reportItemName?: EItemName;
}) {
    return (
        <>
            <UpperControlPanelSkeleton reportItemName={reportItemName} />
            <LowerControlPanelSkeleton />
            <DataTableSkeleton />
        </>
    )
}
