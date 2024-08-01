"use client";

import { useEffect, useRef } from "react";
import { isAncestorOfRef } from "@/lib/utils/client";

export default function useClickOutsideToggle(
    value: boolean,
    onChange: (newValue: boolean) => void
): React.MutableRefObject<HTMLDivElement | null> {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (value) {
            addListeners();
        } else {
            removeListeners();
        }

        function addListeners() {
            document.addEventListener("click", handleGlobalClick);
            document.addEventListener("contextmenu", handleGlobalClick);
        }

        function removeListeners() {
            document.removeEventListener("click", handleGlobalClick);
            document.removeEventListener("contextmenu", handleGlobalClick);
        }

        function handleGlobalClick(e: MouseEvent) {
            const element = e.target as HTMLElement;
            if (value && !isAncestorOfRef(element, ref)) {
                onChange(false);
            }
        }

        return () => removeListeners();
    }, [value, onChange]);

    return ref;
}
