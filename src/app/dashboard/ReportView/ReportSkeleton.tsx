"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { UpperCPWrapper, UpperCPRow, upperCPItems, upperCPItemGroups } from "./UpperControlPanel";
import { LowerCPRow, LowerCPWrapper } from "./LowerControlPanel";
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

export function UpperControlPanelSkeleton({ reportItemName }: {
    reportItemName?: EItemName;
}) {
    const rows = [upperCPItems, upperCPItemGroups];

    return (
        <UpperCPWrapper>
            {rows.map((row, index) => (
                <UpperCPRow key={index}>
                    {row
                        .filter(item => "itemName" in item ? item.itemName !== reportItemName : true)
                        .map((item, _index) => (
                            <DummyItem key={_index} className="h-2">
                                <span className="opacity-0">{"itemName" in item ? item.itemName : item.name}</span>
                            </DummyItem>
                        ))}
                </UpperCPRow>
            ))
            }
        </UpperCPWrapper >
    )
}

export function LowerControlPanelSkeleton() {
    return (
        <LowerCPWrapper>
            <LowerCPRow>
                <DummyItem className="h-2 w-[240px]" />
                <DummyItem className="h-2 w-[60px]" />
            </LowerCPRow>
            <LowerCPRow>
                <DummyItem className="h-3 w-[80px]" />
                <DummyItem className="h-3 w-[80px]" />
            </LowerCPRow>
        </LowerCPWrapper>
    )
}

export function DataTableSkeleton() {
    return (
        <div className="w-full mt-1">
            {new Array(10)
                .fill("")
                .map((_, index) => (
                    <div key={index} className="skeleton flex justify-center items-center w-full px-6 py-2">
                        <div className="h-2 w-full bg-gray-100 rounded-full" />
                    </div>
                ))}
        </div>
    )
}

function DummyItem({ children, className = "" }: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="skeleton flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <FontAwesomeIcon icon={faCircle} className="text-md text-gray-200" />
            <div className={"bg-gray-200 rounded-full " + className}>
                {children}
            </div>
        </div>
    )
}
