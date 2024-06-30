

export default function Tooltip({ text, disabled, children }: {
    text: string,
    disabled?: boolean,
    children: React.ReactNode
}) {
    return (
        disabled
            ? children
            : <span className='relative group'>
                {children}
                <span
                    className='absolute top-100 left-[50%] hidden opacity-0 group-hover:inline group-hover:opacity-100 ml-[-60px] mt-[5px] bg-black text-white text-center rounded px-2 overflow-hidden'
                    style={{
                        transition: 'opacity 0.3s ease-in-out',
                        whiteSpace: 'nowrap',
                        zIndex: 1000
                    }}
                >
                    {text}
                </span>
            </span>
    )
}
