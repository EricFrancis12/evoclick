"use client";

import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Select, DummySelect } from "@/components/base";
import { getReportChainColor } from "./colors";
import { EItemName, TClick } from "@/lib/types";
import { useDataContext } from "@/contexts/DataContext";

export type TReportChain = [TReportChainLink, TReportChainLink];
export type TReportChainValue = EItemName | string;
export type TReportChainLink = null | {
    value?: TReportChainValue;
};

export default function ReportChain({ reportChain, onChange, omissions = [], itemName }: {
    reportChain: TReportChain;
    onChange: (reportChain: TReportChain) => void;
    omissions?: EItemName[];
    itemName?: EItemName;
}) {
    const { clicks } = useDataContext();

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>, index: number) {
        let newReportChain = [...reportChain];
        if (e.target.value) {
            newReportChain[index] = { value: e.target.value as TReportChainValue };
            if (index <= newReportChain.length - 2) newReportChain[index + 1] = {};
        } else {
            newReportChain = [{}, null];
        }
        onChange(newReportChain as typeof reportChain);
    }

    return (
        <div className="flex flex-wrap justify-center items-center gap-4">
            {itemName &&
                <div>
                    <DummySelect
                        className="rounded-lg"
                        style={{
                            border: "solid 1px",
                            borderColor: getReportChainColor(0).dark,
                        }}
                    >
                        {itemName}
                    </DummySelect>
                </div>
            }
            {reportChain.map((chainLink, index) => (
                <Fragment key={index}>
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        className={chainLink?.value === undefined ? "text-gray-300" : "text-black"}
                    />
                    <div>
                        <Select
                            key={index}
                            value={chainLink?.value ?? ""}
                            onChange={e => handleChange(e, index)}
                            disabled={chainLink === null}
                            className="rounded-lg"
                            style={{
                                border: "solid 1px",
                                borderColor: getReportChainColor(index + 1).dark,
                            }}
                            dataset={{ ["data-cy"]: `select-chain-link-index-${index}` }}
                        >
                            <option value="">None</option>
                            {[...Object.values(EItemName), ...makeTokenQueryParams(clicks)]
                                .filter(itemName => !((omissions as string[]).includes(itemName)))
                                .filter(itemName => reportChain?.[index - 1]?.value !== itemName)
                                .map((itemName, _index) => (
                                    <option key={_index} value={itemName}>
                                        {itemName}
                                    </option>
                                ))}
                        </Select>
                    </div>
                </Fragment>
            ))}
        </div>
    )
}

function makeTokenQueryParams(clicks: TClick[]): string[] {
    const tokenQueryParams: string[] = [];
    for (const click of clicks) {
        for (const { queryParam } of click.tokens) {
            if (!tokenQueryParams.includes(queryParam)) {
                tokenQueryParams.push(queryParam);
            }
        }
    }
    return tokenQueryParams;
}

type reportChainValueToItemNameResult = {
    success: true;
    itemName: EItemName;
} | {
    success: false;
    itemName: null;
};

export function reportChainValueToItemName(reportChainOption: TReportChainValue): reportChainValueToItemNameResult {
    const itemNames: string[] = Object.values(EItemName);
    if (itemNames.includes(reportChainOption)) {
        return {
            success: true,
            itemName: reportChainOption as EItemName,
        }
    }
    return {
        success: false,
        itemName: null,
    };
}
