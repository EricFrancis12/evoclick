"use client";

export default function CheckboxesInput({ items, value, onChange, className = "" }: {
    items: string[];
    value: string[];
    onChange: (newValue: string[]) => void;
    className?: string;
}) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>, item: string) {
        const { checked } = e.target;
        if (checked && !value.includes(item)) {
            onChange([...value, item]);
        } else if (!checked && value.includes(item)) {
            onChange(value.filter(v => v !== item));
        }
    }

    return (
        <div className={"flex flex-wrap items-center gap-2 w-full " + className}>
            {items.map((item, index) => (
                <span key={index} className="flex gap-1">
                    <input
                        type="checkbox"
                        checked={value.includes(item)}
                        onChange={e => handleChange(e, item)}
                    />
                    <span>{item}</span>
                </span>
            ))}
        </div>
    )
}
