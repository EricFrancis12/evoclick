"use client";

export function Wrapper({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col justify-start items-start w-full">
            {children}
        </div>
    )
}

export function Input({ name = "", placeholder = "", value, onChange }: {
    name: string,
    placeholder?: string,
    value: string | number | readonly string[] | undefined,
    onChange: React.ChangeEventHandler<HTMLInputElement>
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

export function Select({ name = "", value, onChange, children }: {
    name: string,
    value?: string | number | readonly string[] | undefined,
    onChange: React.ChangeEventHandler<HTMLSelectElement>,
    children: React.ReactNode
}) {
    return (
        <Wrapper>
            <span>
                {name}
            </span>
            <select
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
