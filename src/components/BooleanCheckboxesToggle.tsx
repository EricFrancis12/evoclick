"use client";

export default function BooleanCheckboxesToggle({ items, value, onChange }: {
    items: [trueItem: string, falseItem: string];
    value: boolean;
    onChange: (bool: boolean) => void;
}) {
    return (
        <div className="flex flex-col justify-center h-full p-2">
            {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="checkbox"
                        checked={index === 0 ? value : !value}
                        onChange={() => onChange(index === 0 ? true : false)}
                    />
                    <span>{item}</span>
                </div>
            ))}
        </div>
    )
}
