"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

export function DummyItem({ children, className = "" }: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="skeleton flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <FontAwesomeIcon icon={faCircle} className="text-md text-gray-200" />
            <div className={"bg-gray-200 rounded-full " + className}>
                {children}
            </div>
        </div>
    )
}
