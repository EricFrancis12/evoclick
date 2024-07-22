"use client";

const BASE_COMPONENT_CLASSNAME = "w-full px-2 py-1";
const BASE_COMPONENT_STYLE = {
    border: "solid 1px grey",
    borderRadius: "6px"
};

export function Input({ name = "", placeholder, value, onChange }: {
    name: string;
    placeholder?: string;
    value: string | number | readonly string[] | undefined;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <BaseComponentWrapper>
            <span>
                {name}
            </span>
            <input
                type="text"
                placeholder={placeholder}
                className={BASE_COMPONENT_CLASSNAME}
                style={BASE_COMPONENT_STYLE}
                value={value}
                onChange={onChange}
            />
        </BaseComponentWrapper>
    )
}

export function Select({ name = "", value, onChange, children, disabled, className, style }: {
    name?: string;
    value: string | number | readonly string[] | undefined;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <BaseComponentWrapper>
            <span>
                {name}
            </span>
            <select
                disabled={disabled}
                className={BASE_COMPONENT_CLASSNAME + " " + className}
                style={{ ...BASE_COMPONENT_STYLE, ...style }}
                value={value}
                onChange={onChange}
            >
                {children}
            </select>
        </BaseComponentWrapper>
    )
}

export function DummySelect({ children, className, style }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div>
            <BaseComponentWrapper>
                <div
                    className={BASE_COMPONENT_CLASSNAME + " " + className}
                    style={{ ...BASE_COMPONENT_STYLE, ...style }}
                >
                    {children}
                </div>
            </BaseComponentWrapper>
        </div>
    )
}

export function SelectionButtons({ name = "", options, value, onClick, children }: {
    name: string;
    options: string[];
    value: string;
    onClick: (val: string) => void;
    children?: React.ReactNode;
}) {
    return (
        <BaseComponentWrapper>
            <span>
                {name}
            </span>
            <div
                className="flex flex-col justify-center gap-4 w-full p-2"
                style={{
                    border: "solid 1px grey",
                    borderRadius: "6px"
                }}
            >
                <div className="flex justify-around items-center w-full">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => onClick(option)}
                            className={(value === option ? "bg-blue-400" : "bg-white hover:bg-blue-400")
                                + " px-4 py-2 border rounded-full cursor-pointer"}
                        >
                            {option}
                        </div>
                    ))}
                </div>
                {children}
            </div>
        </BaseComponentWrapper>
    )
}

export function BaseComponentWrapper({ children, className, style }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={"flex flex-col justify-start items-start w-full " + className} style={style}>
            {children}
        </div>
    )
}
