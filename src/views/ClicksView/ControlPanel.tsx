"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Select } from "@/components/base";
import CalendarButton from "@/components/CalendarButton";
import useQueryRouter from "@/hooks/useQueryRouter";
import { encodeTimeframe, getAllFilterActionParams, getFilterActionNames, upperCaseFirstLetter } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { EItemName, TPrimaryData, TPrimaryItemName } from "@/lib/types";

export enum EFilterAction {
    INCLUDE = "Include",
    EXCLUDE = "Exclude",
}

export type TFilterItem = {
    filterAction: EFilterAction;
    primaryItemName: TPrimaryItemName;
    id: number;
};

export default function ControlPanel({ primaryData, timeframe, currentPage }: {
    primaryData: TPrimaryData;
    timeframe: [Date, Date];
    currentPage: number;
}) {
    const searchParams = useSearchParams();
    const queryRouter = useQueryRouter();

    function handleChange({ id, primaryItemName, filterAction }: TFilterItem) {
        const [inclName, exclName] = getFilterActionNames(primaryItemName);
        const inclIds = searchParams.getAll(inclName);
        const exclIds = searchParams.getAll(exclName);

        const idStr = id.toString();
        if (filterAction === EFilterAction.INCLUDE && !inclIds.includes(idStr)) {
            inclIds.push(idStr);
        } else if (!exclIds.includes(idStr)) {
            exclIds.push(idStr);
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

    return (
        <div className="flex gap-2 w-full">
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
            {Object.keys(primaryData).map(primaryItemName => (
                <IncludeExcludeInput
                    key={primaryItemName}
                    values={primaryData[primaryItemName as TPrimaryItemName].map(({ id, name }) => ({ id, name }))}
                    primaryItemName={primaryItemName as TPrimaryItemName}
                    onChange={handleChange}
                />
            ))}
        </div>
    )
}

function IncludeExcludeInput({ values, primaryItemName, onChange }: {
    values: {
        id: number;
        name: string;
    }[];
    primaryItemName: TPrimaryItemName;
    onChange: (fi: TFilterItem) => void;
}) {
    const searchParams = useSearchParams();

    const [inclName, exclName] = getFilterActionNames(primaryItemName);
    const inclIds = searchParams.getAll(inclName);
    const exclIds = searchParams.getAll(exclName);

    const [filterAction, setFilterAction] = useState<EFilterAction>(EFilterAction.INCLUDE);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = e.target;
        if (!value) return;

        const id = parseInt(value);
        if (isNaN(id)) return;

        onChange({
            filterAction,
            primaryItemName,
            id,
        });
    }

    return (
        <div className="flex items-center gap-2">
            <FontAwesomeIcon
                icon={filterAction === EFilterAction.INCLUDE ? faCircleCheck : faCircleXmark}
                className={(filterAction === EFilterAction.INCLUDE ? "text-green-300 hover:text-green-400" : "text-red-300 hover:text-red-400")
                    + " cursor-pointer"}
                onClick={() => setFilterAction(filterAction === EFilterAction.INCLUDE ? EFilterAction.EXCLUDE : EFilterAction.INCLUDE)}
            />
            <Select
                name={upperCaseFirstLetter(filterAction) + " " + primaryItemName}
                value=""
                onChange={handleChange}
            >
                <option value="" />
                {values
                    .filter(({ id }) => !(inclIds.includes(id.toString()) || exclIds.includes(id.toString())))
                    .map(value => (
                        <option key={value.id} value={value.id}>
                            {value.name}
                        </option>
                    ))}
            </Select>
        </div>
    )
}
