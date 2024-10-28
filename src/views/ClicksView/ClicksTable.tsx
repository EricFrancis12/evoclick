"use client";

import { TClick } from "@/lib/types";
import ClicksTablePagination from "./ClicksTablePagination";

export default function ClicksTable({ clicks, currentPage, totalPages }: {
    clicks: TClick[];
    currentPage: number;
    totalPages: number;
}) {
    // TODO: map over clicks and turn into rows

    return (
        <div className="w-full">
            {clicks.map(click => (
                <div key={click.id} className="w-full px-2 py-1 border border-black">
                    {click.id}
                </div>
            ))}
            <ClicksTablePagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    )
}
