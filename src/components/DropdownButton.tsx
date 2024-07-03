"use client";

import { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function DropdownButton({ children, disabled, active, setActive, icon, text, onClick, className = "" }: {
    children: React.ReactNode;
    disabled?: boolean;
    active: boolean;
    setActive: (active: boolean) => any;
    icon?: IconDefinition;
    text: string;
    onClick?: Function;
    className?: string;
    id?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!active) return;
        if (onClick) {
            onClick(false);
        } else {
            setActive(false);
        }
    }, [disabled]);

    useEffect(() => {
        document.addEventListener("click", handleGlobalClick);
        return () => document.removeEventListener("click", handleGlobalClick);

        function handleGlobalClick(e: MouseEvent) {
            if (!traverseParentsForRef(e.target as HTMLElement, ref)) setActive(false);
        }
    }, []);

    return (
        <div
            ref={ref}
            className={" relative whitespace-nowrap " + className + (!disabled ? " cursor-pointer" : "")}
        >
            <div
                className={(!disabled ? "hover:opacity-70 " : "opacity-40 ") + "flex justify-between px-2 py-2"}
                style={{
                    minWidth: "100px",
                    border: "solid lightgrey 1px",
                    borderRadius: "6px",
                    backgroundImage: "linear-gradient(0deg,var(--color-gray5),var(--color-white))"
                }}
                onClick={!disabled ? (onClick ?? setActive ? (() => setActive(!active)) : undefined) : undefined}
            >
                <span>
                    {icon && <FontAwesomeIcon icon={icon} className="mr-[4px]" />}
                    <span className="mr-[4px]">
                        {text ?? ""}
                    </span>
                </span>
                <span>
                    <FontAwesomeIcon icon={active ? faChevronUp : faChevronDown} />
                </span>
            </div>
            {(active && !disabled) &&
                <Dropdown>
                    {children}
                </Dropdown>
            }
        </div>
    )
}

export function DropdownItem({ children, text, icon, onClick }: {
    children?: React.ReactNode;
    text?: string;
    icon?: IconDefinition;
    onClick: React.MouseEventHandler;
}) {
    return (
        <div
            className="p-1 hover:bg-blue-300"
            style={{ outline: "solid grey 1px" }}
            onClick={onClick}
        >
            {icon &&
                <FontAwesomeIcon icon={icon} className="mr-[4px]" />
            }
            {children || text}
        </div>
    )
}

export function Dropdown({ children, ref, id, isHovered = true }: {
    children?: React.ReactNode,
    ref?: React.MutableRefObject<HTMLDivElement>,
    id?: string,
    isHovered?: boolean
}) {
    return (
        <div className="absolute w-auto bg-white rounded overflow-hidden"
            ref={ref}
            id={id}
            style={{
                display: isHovered ? "block" : "none",
                border: "solid black 1px",
                zIndex: 999
            }}
        >
            {children}
        </div>
    )
}

export function traverseParentsForRef(element: HTMLElement, ref: React.RefObject<HTMLElement>): boolean {
    if (element === ref.current) {
        return true; // Found the valid ref, return element
    } else if (element !== document.body && !!element.parentNode) {
        const parentElement = element.parentElement;
        if (parentElement) return traverseParentsForRef(parentElement, ref); // Recursive call and return its result
    }
    return false; // If no valid ref found, return false
}
