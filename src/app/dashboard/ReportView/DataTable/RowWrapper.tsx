"use client";

import { TDialogueMenuItem, useDialogueMenu } from "../contexts/DialogueMenuContext";
import { ROW_HEIGHT } from ".";

export default function RowWrapper({ children, value = 0, dialogueMenuItems = [], style, selected, onClick = () => { } }: {
    children: React.ReactNode;
    value?: number;
    dialogueMenuItems?: TDialogueMenuItem[];
    style?: React.CSSProperties;
    // Having a selected value of undefined disables the hover, background color change, and onClick functionalities.
    // The title row should use undefined because we do not want the title row to have this funcionality,
    // and all other rows should use a boolean.
    selected?: boolean;
    onClick?: (bool: boolean) => void;
}) {
    const { setDialogueMenu } = useDialogueMenu();

    function handleClick() {
        if (selected === undefined) return;
        onClick(!selected);
    }

    function handleContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        if (selected === undefined) return;
        e.preventDefault();
        onClick(true);

        setDialogueMenu({
            top: e.clientY,
            left: e.clientX,
            open: true,
            items: dialogueMenuItems,
        });
    }

    return (
        <div
            className={(selected === undefined
                ? valueToBg(value)
                : ((selected ? "bg-blue-300" : valueToBg(value) + " hover:bg-blue-200") + " cursor-pointer"))
                + " flex items-center w-full pr-4"}
            style={{ ...style, height: `${ROW_HEIGHT}px` }}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
        >
            {children}
        </div>
    )
}

function valueToBg(value: number): string {
    if (value > 0) return "bg-green-100";
    if (value < 0) return "bg-red-100";
    return "bg-white";
}
