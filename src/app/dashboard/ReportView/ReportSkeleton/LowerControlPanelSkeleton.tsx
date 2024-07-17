"use client";

import LowerCPWrapper from "../LowerControlPanel/LowerCPWrapper";
import LowerCPRow from "../LowerControlPanel/LowerCPRow";
import { DummyItem } from "./DummyItem";

export default function LowerControlPanelSkeleton() {
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
