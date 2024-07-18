"use client";

import { faFolder, faGlobeEurope, faLaptop, faMobile, faWifi } from "@fortawesome/free-solid-svg-icons";
import { EItemName } from "@/lib/types";
import UpperCPWrapper from "./UpperCPWrapper";
import UpperCPRow from "./UpperCPRow";
import UpperCPItem from "./UpperCPItem";
import UpperCPItemGroup, { TUpperCPItemGroup } from "./UpperCPItemGroup";

export default function UpperControlPanel({ onClick = () => { }, reportItemName }: {
    onClick?: (itemName: EItemName) => void;
    reportItemName?: EItemName;
}) {
    return (
        <UpperCPWrapper>
            <UpperCPRow>
                {upperCPItems
                    .filter(itemName => itemName !== reportItemName)
                    .map((itemName, _index) => (
                        <UpperCPItem
                            key={_index}
                            itemName={itemName}
                            onClick={onClick}
                        />
                    ))}
            </UpperCPRow>
            <UpperCPRow>
                {upperCPItemGroups.map((group, index) => (
                    <UpperCPItemGroup
                        key={index}
                        itemGroup={group}
                        onClick={onClick}
                        reportItemName={reportItemName}
                    />
                ))}
            </UpperCPRow>
        </UpperCPWrapper>
    )
}

export const upperCPItems: EItemName[] = [
    EItemName.CAMPAIGN,
    EItemName.OFFER,
    EItemName.LANDING_PAGE,
    EItemName.FLOW,
    EItemName.TRAFFIC_SOURCE,
    EItemName.AFFILIATE_NETWORK,
];

export const upperCPItemGroups: TUpperCPItemGroup[] = [
    {
        name: EItemName.COUNTRY, icon: faGlobeEurope, children: [
            EItemName.COUNTRY,
            EItemName.REGION,
            EItemName.CITY,
            EItemName.LANGUAGE,
        ],
    },
    {
        name: EItemName.ISP, icon: faWifi, children: [
            EItemName.ISP,
            EItemName.IP,
            EItemName.USER_AGENT,
        ],
    },
    {
        name: EItemName.DEVICE, icon: faLaptop, children: [
            EItemName.DEVICE,
            EItemName.DEVICE_TYPE,
            EItemName.SCREEN_RESOLUTION,
        ],
    },
    {
        name: EItemName.OS, icon: faMobile, children: [
            EItemName.OS,
            EItemName.OS_VERSION,
        ],
    },
    {
        name: EItemName.BROWSER_NAME, icon: faFolder, children: [
            EItemName.BROWSER_NAME,
            EItemName.BROWSER_VERSION,
        ],
    },
];
