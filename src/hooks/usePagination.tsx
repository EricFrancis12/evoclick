"use client";

import { useState } from "react";
import Pagination, { generatePagination, TPagination } from "@/components/Pagination";

export { Pagination, generatePagination };
export type { TPagination };

export default function usePagination<T>(items: T[], itemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pagination = generatePagination({ currentPage, totalPages });

    const itemsOnCurrentPage: T[] = items.filter(
        (_, index) => (index >= (currentPage - 1) * itemsPerPage) && (index < currentPage * itemsPerPage)
    );

    function handleClick(pgn: TPagination) {
        if (typeof pgn === 'number') {
            setCurrentPage(pgn);
        } else if (pgn === '<<') {
            setCurrentPage(1);
        } else if (pgn === '<') {
            const newCurrentPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
            setCurrentPage(newCurrentPage);
        } else if (pgn === '>') {
            const newCurrentPage = currentPage + 1 <= totalPages ? currentPage + 1 : totalPages;
            setCurrentPage(newCurrentPage);
        } else if (pgn === '>>') {
            setCurrentPage(totalPages);
        }
    }

    function _Pagination() {
        return (
            <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onClick={handleClick}
            />
        )
    }

    return {
        Pagination: _Pagination,
        itemsOnCurrentPage,
        totalPages,
        currentPage,
        setCurrentPage,
    };
}
