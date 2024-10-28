"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useQueryRouter from "@/hooks/useQueryRouter";
import Pagination, { generatePagination, TPagination } from "@/components/Pagination";
import { getAllFilterActionParams } from "@/lib/utils";

export default function ClicksTablePagination({ currentPage, totalPages }: {
    currentPage: number;
    totalPages: number;
}) {
    const searchParams = useSearchParams();
    const queryRouter = useQueryRouter();

    const pagination = generatePagination({ currentPage, totalPages });

    function handleClick(pgn: TPagination) {
        let newPage = 1;
        if (pgn === "...") {
            return;
        } else if (typeof pgn === "number") {
            newPage = pgn;
        } else if (pgn === "<") {
            newPage = currentPage >= 2 ? currentPage - 1 : 1;
        } else if (pgn === ">") {
            newPage = currentPage <= totalPages - 1 ? currentPage + 1 : totalPages;
        } else if (pgn === ">>") {
            newPage = totalPages;
        }

        queryRouter.push(
            window.location.href,
            {
                page: newPage.toString(),
                ...getAllFilterActionParams(searchParams),
            },
            ["timeframe"],
        );
    }

    return (
        <Pagination
            pagination={pagination}
            currentPage={currentPage}
            onClick={handleClick}
        />
    )
}
