"use client";

import { Select } from "@/components/base";
import { EItemName } from "@/lib/types";

export type TReportChain = [TReportChainLink, TReportChainLink];
export type TReportChainLink = null | {
    itemName?: EItemName;
};

export default function ReportChain({ reportChain, onChange, omissions = [] }: {
    reportChain: TReportChain;
    onChange: (reportChain: TReportChain) => void;
    omissions?: EItemName[];
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
            {reportChain.map((chainLink, index) => (
                <div key={index}>
                    <Select
                        key={index}
                        value={chainLink?.itemName ?? ""}
                        onChange={e => handleChange(e, index)}
                        disabled={chainLink === null}
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
            ))}
        </div>
    )
}
