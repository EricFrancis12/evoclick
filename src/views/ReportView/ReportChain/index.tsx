"use client";

import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Select, DummySelect } from "@/components/base";
import { getReportChainColor } from "./colors";
import { EItemName } from "@/lib/types";

export type TReportChain = [TReportChainLink, TReportChainLink];
export type TReportChainLink = null | {
    itemName?: EItemName;
};

export default function ReportChain({ reportChain, onChange, omissions = [], itemName }: {
    reportChain: TReportChain;
    onChange: (reportChain: TReportChain) => void;
    omissions?: EItemName[];
    itemName?: EItemName;
}) {
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>, index: number) {
        let newReportChain = [...reportChain];
        if (e.target.value) {
            newReportChain[index] = { itemName: e.target.value as EItemName };
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
                        className={chainLink?.itemName === undefined ? "text-gray-300" : "text-black"}
                    />
                    <div>
                        <Select
                            key={index}
                            value={chainLink?.itemName ?? ""}
                            onChange={e => handleChange(e, index)}
                            disabled={chainLink === null}
                            className="rounded-lg"
                            style={{
                                border: "solid 1px",
                                borderColor: getReportChainColor(index + 1).dark,
                            }}
                        >
                            <option value="">None</option>
                            {Object.values(EItemName)
                                .filter(itemName => !omissions.includes(itemName))
                                .filter(itemName => reportChain?.[index - 1]?.itemName !== itemName)
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
