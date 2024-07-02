"use client";

import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { refreshAction } from "@/lib/actions";
import Button from "./Button";

export default function RefreshButton({ disabled = false }: {
    disabled?: boolean;
}) {
    return (
        <Button
            icon={faSyncAlt}
            onClick={() => refreshAction(window.location.href)}
            disabled={disabled}
            text="Refresh"
        />
    )
}
