"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { BUTTON_STYLE } from "./Button";

export default function DropdownButton<S extends string>({ options, value, disabled, onClick }: {
    options: S[];
    value: S;
    disabled?: boolean;
    onClick: (newValue: S) => void;
}) {
    const [open, setOpen] = useState<boolean>(false);

    function handleClick(newValue: S) {
        setOpen(false);
        onClick(newValue);
    }

    return (
        <div className="relative whitespace-nowrap">
            <div
                className={(!disabled ? "hover:opacity-70" : "opacity-40")
                    + " flex justify-between items-center min-w-[100px] px-2 py-2 cursor-pointer"}
                style={BUTTON_STYLE}
                onClick={() => setOpen(prev => !prev)}
            >
                <span className="mr-[4px]">{value}</span>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </div>
            <div className="absolute top-full left-0 h-full bg-white">
                {(open && !disabled) && options.map((option, index) => (
                    <div
                        key={index}
                        className="p-1 bg-white hover:bg-blue-300 cursor-pointer"
                        style={{ outline: "solid grey 1px" }}
                        onClick={() => handleClick(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    )
}
