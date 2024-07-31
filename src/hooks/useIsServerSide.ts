"use client";

import { useState, useEffect } from "react";

export default function useIsServerSide() {
    const [isServerSide, setIsServerSide] = useState(true);

    useEffect(() => {
        setIsServerSide(false);
    }, [setIsServerSide]);

    return isServerSide;
}
