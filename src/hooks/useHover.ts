"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";

export default function useHover(ref: React.RefObject<HTMLElement>): [boolean, Dispatch<SetStateAction<boolean>>] {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        const node = ref.current;
        if (node) {
            node.addEventListener("mouseenter", handleMouseEnter);
            node.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                node.removeEventListener("mouseenter", handleMouseEnter);
                node.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, [ref]);

    return [isHovered, setIsHovered];
}
