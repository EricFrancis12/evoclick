"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { BUTTON_STYLE } from "./Button";

export default function DropdownButton({ options, value, disabled, onClick }: {
    options: string[];
    value: string;
    disabled?: boolean;
    onClick: (newValue: string) => void;
}) {
    const [active, setActive] = useState<boolean>(false);

    return (
        <div className="relative whitespace-nowrap">
            <div
                className={(!disabled ? "hover:opacity-70" : "opacity-40")
                    + " flex justify-between items-center min-w-[100px] px-2 py-2"}
                style={BUTTON_STYLE}
                onClick={() => setActive(prev => !prev)}
            >
                <span className="mr-[4px]">{value}</span>
                <FontAwesomeIcon icon={active ? faChevronUp : faChevronDown} />
            </div>
            <div className="absolute top-full left-0 h-full">
                {(active && !disabled) && options.map((option, index) => (
                    <div
                        key={index}
                        className="p-1 hover:bg-blue-300"
                        style={{ outline: "solid grey 1px" }}
                        onClick={() => onClick(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    )
}
