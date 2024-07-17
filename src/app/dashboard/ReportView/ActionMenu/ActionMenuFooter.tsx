"use client";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";

export default function ActionMenuFooter({ onSave, disabled }: {
    onSave: () => void;
    disabled?: boolean;
}) {
    return (
        <div
            className="flex justify-end items-center w-full p-4 px-6"
            style={{ borderTop: "solid 1px grey" }}
        >
            <Button icon={faCheck} text="Save" disabled={disabled} onClick={onSave} />
        </div>
    )
}
