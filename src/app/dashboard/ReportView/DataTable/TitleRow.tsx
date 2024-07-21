"use client";

import { useRef, Fragment } from "react";
import useDragger from "@/hooks/useDragger";
import RowWrapper from "./RowWrapper";
import CheckboxWrapper from "./CheckboxWrapper";
import PosNegIndicator from "./PosNegIndicator";
import Cell from "./Cell";
import { BASE_Z_INDEX, safeIndexCols, TColumn } from ".";

export default function TitleRow({ name, columns, setColumns }: {
    name: string;
    columns: TColumn[];
    setColumns: (cols: TColumn[]) => void;
}) {
    const mouseDownClientX = useRef<number>(0);

    const startDrag = useDragger((e, i) => {
        if (typeof i === "number") {
            const width = safeIndexCols(columns, i).width + e.clientX - mouseDownClientX.current;
            setColumns(columns.map((col, index) => index === i ? { ...col, width } : col));
        }
    });

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>, i: number) {
        mouseDownClientX.current = e.clientX;
        startDrag(e, i);
    }

    return (
        <RowWrapper
            style={{
                position: "sticky",
                top: "0px",
                borderTop: "solid grey 2px",
                borderBottom: "solid grey 2px",
                zIndex: BASE_Z_INDEX,
            }}
        >
            <PosNegIndicator value={0} disabled={true} />
            <CheckboxWrapper />
            {columns.map(({ title, width }, index) => (
                <Fragment key={index}>
                    <Cell
                        value={index === 0 ? name : title}
                        width={width}
                        className="font-bold"
                    />
                    <div className="relative h-auto w-[0px] overflow-visible">
                        <div
                            className="absolute top-0 left-0 h-full w-[1px] bg-blue-500 cursor-e-resize"
                            onMouseDown={e => handleMouseDown(e, index)}
                        />
                    </div>
                </Fragment>
            ))}
        </RowWrapper>
    )
}
