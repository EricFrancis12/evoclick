"use client";

import toast from "react-hot-toast";

export function copyToClipboard(text: string) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        toast.success("Copied text to clipboard");
    } catch (err) {
        toast.error("error copying text to clipboard");
    }
}

export function isAncestorOfRef(element: HTMLElement, ref: React.RefObject<HTMLElement>): boolean {
    if (element === ref.current) {
        return true; // Found the valid ref, return element
    } else if (element !== document.body && !!element.parentNode) {
        const parentElement = element.parentElement;
        if (parentElement) return isAncestorOfRef(parentElement, ref); // Recursive call and return its result
    }
    return false; // If no valid ref found, return false
}
