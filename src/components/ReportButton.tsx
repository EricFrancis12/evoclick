"use client";

import { faRandom } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

export default function ReportButton({ onClick, disabled = false }: {
    onClick: React.MouseEventHandler<HTMLDivElement>;
    disabled?: boolean;
}) {
    return (
        <Button
            icon={faRandom}
            onClick={onClick}
            disabled={disabled}
            text="Report"
        />
    )
}
