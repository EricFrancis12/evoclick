"use client";

import { useState, useEffect, Fragment } from "react";
import useActiveView from "@/hooks/useActiveView";
import DropdownButton, { DropdownItem } from "@/components/DropdownButton";
import { useViewsStore } from "@/lib/store";
import { arrayOf } from "@/lib/utils";
import { EItemName } from "@/lib/types";

const MAX_REPORT_CHAIN_LENGTH = 3;

export type TReportChain = [TReportChainLink, TReportChainLink, TReportChainLink];
export type TReportChainLink = null | {
    itemName?: EItemName;
};

export default function ReportChain({ reportChain, onChange }: {
    reportChain: TReportChain;
    onChange: (reportChain: TReportChain) => any;
}) {
    const { updateViewItemNameById } = useViewsStore(store => store);
    const activeView = useActiveView();
    const dropdownItems = Object.values(EItemName);

    const [dropdownsActive, setDropdownsActive] = useState<[boolean, boolean, boolean]>([false, false, false]);

    useEffect(() => {
        if (activeView?.itemName) {
            handleClick({ itemName: activeView.itemName }, 0);
        }
    }, [activeView?.itemName]);

    function handleClick(chainlink: TReportChainLink, index: number) {
        if (!chainlink) return;
        if (index === 0 && activeView?.id && chainlink?.itemName) {
            updateViewItemNameById(activeView.id, chainlink.itemName);
        }
        setDropdownsActive([false, false, false]);

        const newReportChain = [...reportChain]
            .splice(
                index,
                MAX_REPORT_CHAIN_LENGTH,
                { ...chainlink },
                {},
                ...arrayOf(null, MAX_REPORT_CHAIN_LENGTH)
            )
            .slice(0, MAX_REPORT_CHAIN_LENGTH) as TReportChain;
        onChange(newReportChain);
    }

    function handleSetActive(active: boolean, index: number) {
        setDropdownsActive(prevDropdownsActive => {
            const newDropdownsActive = [...prevDropdownsActive];
            newDropdownsActive.splice(index, 1, active);
            return newDropdownsActive as [boolean, boolean, boolean];
        });
    }

    return (
        <div className="flex flex-wrap justify-center items-center">
            {reportChain.map((chainLink, index) => (
                <div key={index} className="p-1">
                    <DropdownButton
                        text={!chainLink?.itemName ? "" : ((index === 0 ? activeView?.itemName : chainLink?.itemName) || "None")}
                        disabled={!chainLink}
                        active={dropdownsActive[index] !== false}
                        setActive={(active: boolean) => handleSetActive(active, index)}
                    >
                        {index !== 0 &&
                            <DropdownItem text={"None"}
                                onClick={() => handleClick({}, index)}
                            />
                        }
                        {dropdownItems.map((itemName, _index) => {
                            const isPrevChainLink = reportChain.find(chainLink => chainLink?.itemName === itemName) != undefined;
                            return (
                                <Fragment key={_index}>
                                    {!isPrevChainLink &&
                                        <DropdownItem
                                            key={_index}
                                            text={itemName}
                                            onClick={() => handleClick({ itemName }, index)}
                                        />
                                    }
                                </Fragment>
                            )
                        })}
                    </DropdownButton>
                </div>
            ))
            }
        </div>
    )
}
