"use client";

import { upperCPItems, upperCPItemGroups } from "../UpperControlPanel";
import UpperCPWrapper from "../UpperControlPanel/UpperCPWrapper";
import UpperCPRow from "../UpperControlPanel/UpperCPRow";
import { DummyItem } from "./DummyItem";
import { EItemName } from "@/lib/types";

export default function UpperControlPanelSkeleton({ reportItemName }: {
    reportItemName?: EItemName;
}) {
    const rows = [upperCPItems, upperCPItemGroups];

    return (
        <UpperCPWrapper>
            {rows.map((row, index) => (
                <UpperCPRow key={index}>
                    {row
                        .filter(item => typeof item === "string" ? item !== reportItemName : true)
                        .map((item, _index) => (
                            <DummyItem key={_index} className="h-2">
                                <span className="opacity-0">{typeof item === "string" ? item : item.name}</span>
                            </DummyItem>
                        ))}
                </UpperCPRow>
            ))
            }
        </UpperCPWrapper >
    )
}
