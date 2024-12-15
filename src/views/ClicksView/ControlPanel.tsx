"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Select } from "@/components/base";
import CalendarButton from "@/components/CalendarButton";
import useQueryRouter from "@/hooks/useQueryRouter";
import { encodeTimeframe, getAllFilterActionParams, getFilterActionNames } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck, faCircleXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { TPrimaryData, TPrimaryItemName } from "@/lib/types";
import Button from "@/components/Button";
import { useActionMenuContext } from "../../contexts/ActionMenuContext";
import UpperCPWrapper from "../ReportView/UpperControlPanel/UpperCPWrapper";
import UpperCPRow from "../ReportView/UpperControlPanel/UpperCPRow";
import ContentToggler from "@/components/ContentToggler";
import LowerCPWrapper from "../ReportView/LowerControlPanel/LowerCPWrapper";
import LowerCPRow from "../ReportView/LowerControlPanel/LowerCPRow";

export enum EFilterAction {
    INCLUDE = "Include",
    EXCLUDE = "Exclude",
}

export type TFilterItem = {
    filterAction: EFilterAction | null;
    primaryItemName: TPrimaryItemName;
    id: number;
};

export default function ControlPanel({ primaryData, timeframe, currentPage, selectedClickIds, setSelectedClickIds }: {
    primaryData: TPrimaryData;
    timeframe: [Date, Date];
    currentPage: number;
    selectedClickIds: Set<number>;
    setSelectedClickIds: (newSelectedClickIds: Set<number>) => void;
}) {
    const { setActionMenu } = useActionMenuContext();

    const searchParams = useSearchParams();
    const queryRouter = useQueryRouter();

    function handleChange({ id, primaryItemName, filterAction }: TFilterItem) {
        const [inclName, exclName] = getFilterActionNames(primaryItemName);
        let inclIds = searchParams.getAll(inclName);
        let exclIds = searchParams.getAll(exclName);

        const idStr = id.toString();
        if (filterAction === EFilterAction.INCLUDE && !inclIds.includes(idStr)) {
            inclIds.push(idStr);
            exclIds = exclIds.filter(id => id !== idStr);
        } else if (filterAction === EFilterAction.EXCLUDE && !exclIds.includes(idStr)) {
            exclIds.push(idStr);
            inclIds = inclIds.filter(id => id !== idStr);
        } else if (filterAction === null) {
            inclIds = inclIds.filter(id => id !== idStr);
            exclIds = exclIds.filter(id => id !== idStr);
        }

        queryRouter.push(
            window.location.href,
            {
                timeframe: encodeTimeframe(timeframe),
                page: currentPage.toString(),
                ...getAllFilterActionParams(searchParams),
                [inclName]: inclIds,
                [exclName]: exclIds,
            },
        );
    }

    async function handleDelete() {
        if (selectedClickIds.size === 0) return;
        setActionMenu({
            type: "Delete Clicks",
            clickIds: Array.from(selectedClickIds),
        });
    }

    async function handleDeleteAll() {
        setActionMenu({
            type: "Delete Clicks",
            clickIds: [],
            deleteAll: true,
        });
    }

    return (
        <div className="w-full">
            <UpperCPWrapper>
                <UpperCPRow>
                    <CalendarButton
                        timeframe={timeframe}
                        onChange={tf => queryRouter.push(
                            window.location.href,
                            {
                                timeframe: encodeTimeframe(tf),
                                page: currentPage.toString(),
                                ...getAllFilterActionParams(searchParams),
                            },
                        )}
                    />
                    <Button
                        text={`Delete (${selectedClickIds.size}) Clicks`}
                        disabled={selectedClickIds.size === 0}
                        icon={faTrash}
                        onClick={handleDelete}
                    />
                    <Button
                        text={"Delete All Clicks"}
                        icon={faTrash}
                        onClick={handleDeleteAll}
                    />
                </UpperCPRow>
            </UpperCPWrapper>
            <LowerCPWrapper>
                <div className="w-full">
                    {Object.keys(primaryData).map(primaryItemName => (
                        <div
                            key={primaryItemName}
                            className="inline-flex flex-col m-3 p-1 rounded-md border border-black select-none"
                        >
                            <p className="font-bold">{primaryItemName}</p>
                            <IncludeExcludeListSelect
                                values={primaryData[primaryItemName as TPrimaryItemName].map(({ id, name }) => ({ id, name }))}
                                primaryItemName={primaryItemName as TPrimaryItemName}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
            </LowerCPWrapper>
        </div>
    )
}

function IncludeExcludeListSelect({ values, primaryItemName, onChange }: {
    values: {
        id: number;
        name: string;
    }[];
    primaryItemName: TPrimaryItemName;
    onChange: (fi: TFilterItem) => void;
}) {
    return (
        <div className="flex flex-col gap-1">
            {values.map(value => (
                <IncludeExcludeListRow
                    key={value.id}
                    value={value}
                    primaryItemName={primaryItemName}
                    onChange={onChange}
                />
            ))}
        </div>
    )
}

function IncludeExcludeListRow({ value, primaryItemName, onChange }: {
    value: {
        id: number;
        name: string;
    };
    primaryItemName: TPrimaryItemName;
    onChange: (fi: TFilterItem) => void;
}) {
    const { id, name } = value;

    const searchParams = useSearchParams();

    const [inclName, exclName] = getFilterActionNames(primaryItemName);
    const inclIds = searchParams.getAll(inclName);
    const exclIds = searchParams.getAll(exclName);

    const idStr = id.toString();
    const filterAction: EFilterAction | null = inclIds.includes(idStr)
        ? EFilterAction.INCLUDE
        : exclIds.includes(idStr)
            ? EFilterAction.EXCLUDE
            : null;

    function handleClick() {
        const newFilterAction = filterAction === null
            ? EFilterAction.INCLUDE
            : filterAction === EFilterAction.INCLUDE
                ? EFilterAction.EXCLUDE
                : null;

        onChange({
            filterAction: newFilterAction,
            primaryItemName,
            id,
        });
    }
    return (
        <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-70"
            onClick={handleClick}
        >
            <FontAwesomeIcon
                icon={filterAction === EFilterAction.INCLUDE ? faCircleCheck : filterAction === EFilterAction.EXCLUDE ? faCircleXmark : faCircle}
                className={
                    (filterAction === EFilterAction.INCLUDE ? "text-green-300 hover:text-green-400" : "")
                    + (filterAction === EFilterAction.EXCLUDE ? " text-red-300 hover:text-red-400" : "")
                }
            />
            <span>{name}</span>
        </div>
    )
}
