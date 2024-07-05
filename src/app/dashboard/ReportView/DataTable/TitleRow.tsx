"use client";

import { useRef, Fragment } from "react";
import useDragger from "@/hooks/useDragger";
import RowWrapper from "./RowWrapper";
import Cell from "./Cell";
import { TColumn } from ".";

export default function TitleRow({ name, columns, setColumns }: {
    name: string;
    columns: TColumn[];
    setColumns: (cols: TColumn[]) => any;
}) {
    const mouseDownClientX = useRef<number>(0);

    const startDrag = useDragger((e, i) => {
        if (typeof i === "number") {
            const newWidth = `${parseFloat(columns[i].width) + e.clientX - mouseDownClientX.current}px`;
            setColumns(columns.map((col, index) => index === i ? { ...col, width: newWidth } : col));
        }
    });

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>, i: number) {
        mouseDownClientX.current = e.clientX;
        startDrag(e, i);
    }

    return (
        <RowWrapper>
            {columns.map(({ title, width }, index) => (
                <Fragment key={index}>
                    <Cell value={index === 0 ? name : title} width={width} />
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
