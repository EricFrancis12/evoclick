"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function DropdownButton({ disabled, options, value, onClick }: {
    disabled?: boolean;
    options: string[];
    value: string;
    onClick: (val: string) => void;
}) {
    const [active, setActive] = useState<boolean>(false);

    return (
        <div className="relative whitespace-nowrap">
            <div
                className={(!disabled ? "hover:opacity-70 " : "opacity-40 ")
                    + "flex justify-between items-center min-w-[100px] px-2 py-2"}
                style={{
                    border: "solid lightgrey 1px",
                    borderRadius: "6px",
                    backgroundImage: "linear-gradient(0deg,var(--color-gray5),var(--color-white))",
                }}
                onClick={() => setActive(prev => !prev)}
            >
                <span className="mr-[4px]">{value}</span>
                <FontAwesomeIcon icon={active ? faChevronUp : faChevronDown} />
            </div>
            <div className="absolute top-[100%] left-0 h-full">
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
