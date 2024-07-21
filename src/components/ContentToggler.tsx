"use client";

import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type TContentTogglerButton = typeof ContentTogglerButton;
export type TContentTogglerButtonProps = {
    active: boolean;
    setActive: (active: boolean) => void;
};

export default function ContentToggler({ active, setActive, children, fallback, style, className, Button = ContentTogglerButton }: {
    active: boolean;
    setActive: (active: boolean) => void;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    Button?: TContentTogglerButton;
}) {
    return (
        <div className={className} style={style}>
            <Button active={active} setActive={setActive} />
            {active ? children : fallback}
        </div>
    )
}

export function ContentTogglerButton({ active, setActive }: TContentTogglerButtonProps) {
    return (
        <FontAwesomeIcon
            icon={active ? faChevronUp : faChevronDown}
            className="cursor-pointer"
            onClick={() => setActive(!active)}
        />
    )
}
