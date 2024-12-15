"use client";

import { useEffect, useState } from "react";
import { TClick } from "@/lib/types";
import ClicksTablePagination from "./ClicksTablePagination";

export default function ClicksTable({ clicks, currentPage, totalPages, selectedClickIds, setSelectedClickIds }: {
    clicks: TClick[];
    currentPage: number;
    totalPages: number;
    selectedClickIds: Set<number>;
    setSelectedClickIds: (newSelectedClickIds: Set<number>) => void;
}) {
    useEffect(() => {
        setSelectedClickIds(new Set());
    }, [clicks, clicks.length, currentPage, totalPages, setSelectedClickIds]);

    function handleClickRowChecked(checked: boolean, clickId: number) {
        const newSelectedClickIds = structuredClone(selectedClickIds);
        if (checked) {
            newSelectedClickIds.add(clickId);
        } else {
            newSelectedClickIds.delete(clickId);
        }
        setSelectedClickIds(newSelectedClickIds);
    }

    const titleRowChecked = clicks.length === selectedClickIds.size && clicks.length > 0;

    return (
        <div className="w-full border border-black">
            <TitleRow
                title="Click IDs"
                checked={titleRowChecked}
                onChecked={() => setSelectedClickIds(
                    titleRowChecked
                        ? new Set()
                        : new Set(clicks.map(({ id }) => id))
                )}
            />
            {clicks.length === 0
                ? <div className="p-2 font-bold italic border-b border-black">
                    No clicks...
                </div>
                : clicks.map(click => (
                    <ClickRow
                        key={click.id}
                        click={click}
                        checked={selectedClickIds.has(click.id)}
                        onChecked={ch => handleClickRowChecked(ch, click.id)}
                    />
                ))}
            <ClicksTablePagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    )
}

function RowWrapper({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2 w-full px-2 py-1 border-b border-black">
            {children}
        </div>
    )
}

function TitleRow({ title, checked, onChecked }: {
    title: string;
    checked: boolean;
    onChecked: (newChecked: boolean) => void;
}) {
    return (
        <RowWrapper>
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChecked(!checked)}
            />
            <span>{title}</span>
        </RowWrapper>
    )
}

function ClickRow({ click, checked, onChecked }: {
    click: TClick;
    checked: boolean;
    onChecked: (newChecked: boolean) => void;
}) {
    return (
        <RowWrapper>
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChecked(!checked)}
            />
            <span>{click.id}</span>
        </RowWrapper>
    )
}
