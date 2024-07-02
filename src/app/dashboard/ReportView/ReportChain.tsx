"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconDefinition, faBullseye, faChevronDown, faChevronUp, faFolder, faGlobe, faGlobeEurope, faHandshake,
    faLaptop, faMobile, faRandom, faSitemap, faSyncAlt, faUsers, faWifi
} from "@fortawesome/free-solid-svg-icons";
import useActiveView from "@/hooks/useActiveView";
import useDragger from "@/hooks/useDragger";
import useHover from "@/hooks/useHover";
import useQueryRouter from "@/hooks/useQueryRouter";
import Tab, { TView, newReportView } from "@/app/dashboard/ReportView/Tab";
import Button from "@/components/Button";
import CalendarButton from "@/components/CalendarButton";
import DropdownButton, { DropdownItem } from "@/components/DropdownButton";
import { refreshAction } from "@/lib/actions";
import { useViewsStore } from "@/lib/store";
import { EItemName, TClick } from "@/lib/types";
import { arrayOf } from "@/lib/utils";

export type TReportChain = [TReportChainLink, TReportChainLink, TReportChainLink];
export type TReportChainLink = null | {
    itemName?: EItemName;
};

const MAX_REPORT_CHAIN_LENGTH = 3;

export default function ReportChain({ reportChain, onChange }: {
    reportChain: TReportChain;
    onChange: (reportChain: TReportChain) => any;
}) {
    const { updateViewItemNameById } = useViewsStore(store => store);
    const activeView = useActiveView();
    const dropdownItems = Object.values(EItemName);

    const [dropdownsActive, setDropdownsActive] = useState<[boolean, boolean, boolean]>([false, false, false]);

    useEffect(() => {
        if (!activeView?.itemName) return;
        handleClick({ itemName: activeView.itemName }, 0);
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
