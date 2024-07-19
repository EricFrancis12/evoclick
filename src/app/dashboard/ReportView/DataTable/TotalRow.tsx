"use client";

import Cell from "./Cell";
import CheckboxWrapper from "./CheckboxWrapper";
import PosNegIndicator from "./PosNegIndicator";
import RowWrapper from "./RowWrapper";
import { TColumn } from ".";

export default function TotalRow({ columns }: {
    columns: TColumn[];
}) {
    // TODO: ...

    return (
        <RowWrapper>
            <PosNegIndicator value={0} disabled={true} />
            <CheckboxWrapper />
            {columns.map(({ title, width }, index) => (
                <Cell
                    key={index}
                    value={""}
                    width={width}
                    className="font-bold"
                />
            ))}
        </RowWrapper>
    )
}
