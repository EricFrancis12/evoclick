import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export const BUTTON_STYLE: React.CSSProperties = {
    border: "solid lightgrey 1px",
    borderRadius: "6px",
    backgroundImage: "linear-gradient(0deg,var(--color-gray5),var(--color-white))",
};

export default function Button({ children, disabled, icon, onClick, text, className }: {
    children?: React.ReactNode,
    disabled?: boolean,
    icon?: IconDefinition,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    text?: string,
    className?: string
}) {
    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        if (disabled) return;
        onClick(e);
    }

    return (
        <div className={className} style={{ userSelect: "none" }}>
            <div onClick={handleClick}
                className={(!disabled ? "cursor-pointer hover:opacity-70" : "opacity-40")
                    + " flex justify-center items-center gap-2 px-2 py-2 border"}
                style={BUTTON_STYLE}
            >
                {icon && <FontAwesomeIcon icon={icon} />}
                {text && <span>{text}</span>}
                {children}
            </div>
        </div>
    )
}
