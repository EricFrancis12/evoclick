"use client";

export function Input({ name = "", placeholder = "", value, onChange }: {
    name: string;
    placeholder?: string;
    value: string | number | readonly string[] | undefined;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <Wrapper>
            <span>
                {name}
            </span>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full px-2 py-1"
                style={{
                    border: "solid 1px grey",
                    borderRadius: "6px"
                }}
                value={value}
                onChange={onChange}
            />
        </Wrapper>
    )
}

export function Select({ name = "", value, onChange, children, disabled }: {
    name?: string;
    value: string | number | readonly string[] | undefined;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <Wrapper>
            <span>
                {name}
            </span>
            <select
                disabled={disabled}
                className="w-full px-2 py-1"
                style={{
                    border: "solid 1px grey",
                    borderRadius: "6px"
                }}
                value={value}
                onChange={onChange}
            >
                {children}
            </select>
        </Wrapper>
    )
}

export function SelectionButtons({ name = "", options, value, onClick, children }: {
    name: string;
    options: string[];
    value: string;
    onClick: (val: string) => any;
    children?: React.ReactNode;
}) {
    return (
        <Wrapper>
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
        </Wrapper>
    )
}

export function Wrapper({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col justify-start items-start w-full">
            {children}
        </div>
    )
}
