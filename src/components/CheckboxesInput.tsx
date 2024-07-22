"use client";

export default function CheckboxesInput({ options, value, onChange, className = "" }: {
    options: string[];
    value: string[];
    onChange: (newValue: string[]) => void;
    className?: string;
}) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>, option: string) {
        const { checked } = e.target;
        if (shouldBeAdded(checked, value, option)) {
            onChange([...value, option]);
        } else if (shouldBeRemoved(checked, value, option)) {
            onChange(value.filter(v => v !== option));
        }
    }

    return (
        <div className={"flex flex-wrap items-center gap-2 w-full " + className}>
            {options.map((option, index) => (
                <span key={index} className="flex gap-1">
                    <input
                        type="checkbox"
                        checked={value.includes(option)}
                        onChange={e => handleChange(e, option)}
                    />
                    <span>{option}</span>
                </span>
            ))}
        </div>
    )
}

function shouldBeAdded(checked: boolean, value: string[], option: string): boolean {
    return checked && !value.includes(option);
}

function shouldBeRemoved(checked: boolean, value: string[], option: string): boolean {
    return !checked && value.includes(option);
}
