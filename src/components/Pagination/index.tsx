"use client";

import generatePagination, { TPagination } from "./generatePagination";

export { generatePagination };
export type { TPagination };

export default function Pagination({ pagination, currentPage, onClick = () => { } }: {
    pagination: TPagination[];
    currentPage?: number;
    onClick?: (pgn: TPagination) => void;
}) {
    return (
        <div className='flex justify-around w-full mt-2'>
            {pagination.map((pgn, _index) => (
                <span
                    key={_index}
                    className={(pgn !== '...' ? 'cursor-pointer hover:underline ' : ' ')
                        + (pgn === currentPage ? ' text-blue-500 font-bold' : ' ')}
                    onClick={() => onClick(pgn)}
                >
                    {pgn}
                </span>
            ))}
        </div>
    )
}
