"use client";

export default function RowWrapper({ children, selected, setSelected = () => { } }: {
    children: React.ReactNode;
    selected?: boolean;
    setSelected?: (newSelected: boolean) => any;
}) {
    return (
        <div className="flex items-center w-full px-4">
            <div className="h-full w-[22px]">
                {selected !== undefined &&
                    <input
                        type="checkbox"
                        checked={selected === true}
                        onChange={() => setSelected(!selected)}
                    />
                }
            </div>
            {children}
        </div>
    )
}
