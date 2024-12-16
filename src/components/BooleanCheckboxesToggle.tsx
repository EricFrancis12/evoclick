"use client";

export default function BooleanCheckboxesToggle({ textValues, value, onChange }: {
    textValues: [trueText: string, falseText: string];
    value: boolean;
    onChange: (_: boolean) => void;
}) {
    return (
        <div className="flex flex-col justify-center h-full p-2">
            {textValues.map((text, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="checkbox"
                        checked={index === 0 ? value : !value}
                        onChange={() => onChange(index === 0 ? true : false)}
                    />
                    <span>{text}</span>
                </div>
            ))}
        </div>
    )
}
