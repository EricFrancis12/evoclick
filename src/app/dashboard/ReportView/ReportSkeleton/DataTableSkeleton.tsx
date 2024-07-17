"use client";

import "./skeleton.css";

export default function DataTableSkeleton() {
    return (
        <div className="w-full mt-1">
            {new Array(10)
                .fill("")
                .map((_, index) => (
                    <div key={index} className="skeleton flex justify-center items-center w-full px-6 py-2">
                        <div className="h-2 w-full bg-gray-100 rounded-full" />
                    </div>
                ))}
        </div>
    )
}
