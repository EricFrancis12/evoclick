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
