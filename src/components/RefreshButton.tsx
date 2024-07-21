"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { faSpinner, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

export default function RefreshButton({ disabled = false }: {
    disabled?: boolean;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleClick() {
        startTransition(() => {
            // Refresh the current route and fetch new data from the server without
            // losing React state.
            router.refresh();
        });
    }

    return (
        <Button
            icon={isPending ? faSpinner : faSyncAlt}
            onClick={handleClick}
            disabled={disabled || isPending}
            text="Refresh"
        />
    )
}
