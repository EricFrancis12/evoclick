"use client";

import TokenInputSection from "./TokenInputSection";

const tokenColumns = ["", "Query param", "Token", "Name", ""];

export default function TokenInputWrapper({ children, onCreateNew }: {
    children: React.ReactNode;
    onCreateNew: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-start w-full">
            <div className="flex justify-between items-center p-1 w-full">
                {tokenColumns.map((col, index) => (
                    <TokenInputSection key={index}>
                        <span>{col}</span>
                    </TokenInputSection>
                ))}
            </div>
            {children}
            <div
                className="flex justify-center items-center mt-4 p-1 w-full hover:bg-gray-200 cursor-pointer"
                style={{
                    border: "solid black 1px",
                    borderRadius: "6px",
                    userSelect: "none",
                }}
                onClick={onCreateNew}
            >
                <div className="flex justify-center items-center p-1 w-full">
                    <span>+ Add Custom Token</span>
                </div>
            </div>
        </div>
    )
}
