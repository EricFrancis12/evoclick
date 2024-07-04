"use client";

import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import TagsInput from "@/components/TagsInput";
import { Input, Select } from "@/components/base";
import { getAllAffiliateNetworksAction, getAllTrafficSourcesAction } from "@/lib/actions";
import { EItemName, TAffiliateNetwork, TNamedToken, TRoute, TToken, TTrafficSource } from "@/lib/types";
import { $Enums } from "@prisma/client";

export type TActionMenu = TAffiliateNetworkActionMenu | TCampaignActionMenu | TFlowActionMenu
    | TLandingPageActionMenu | TOfferActionMenu | TTrafficSourceActionMenu;

export type TReportViewContext = {
    actionMenu: TActionMenu | null;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
};

const ReportViewContext = React.createContext<TReportViewContext | null>(null);

export function useReportView() {
    const context = useContext(ReportViewContext);
    if (!context) {
        throw new Error("useReportView must be used within a ReportViewContext provider");
    }
    return context;
}

export function ReportViewProvider({ children }: {
    children: React.ReactNode;
}) {
    const [actionMenu, setActionMenu] = useState<TActionMenu | null>(null);

    const value = {
        actionMenu,
        setActionMenu,
    };

    return (
        <ReportViewContext.Provider value={value}>
            {actionMenu &&
                <>
                    <div
                        className="absolute h-screen w-screen bg-black opacity-50"
                        style={{ zIndex: 100 }}
                    />
                    <div
                        className="absolute flex justify-center items-center h-screen w-screen bg-transparent"
                        style={{ zIndex: 200 }}
                    >
                        <ActionMenu actionMenu={actionMenu} onClose={() => setActionMenu(null)} />
                    </div>
                </>
            }
            {children}
        </ReportViewContext.Provider>
    )
}

function ActionMenu({ actionMenu, onClose }: {
    actionMenu: TActionMenu;
    onClose: () => any;
}) {
    return (
        <div className="flex flex-col justify-between items-center h-[400px] w-[300px] bg-white">
            <ActionMenuHeader
                title={actionMenu.itemName}
                onClose={onClose}
            />
            <ActionMenuBody actionMenu={actionMenu} />
            <ActionMenunFooter
                onSave={() => console.log(actionMenu)}
                onClose={onClose}
            />
        </div>
    )
}

export function ActionMenuHeader({ title, onClose }: {
    title: string;
    onClose: React.MouseEventHandler<HTMLOrSVGElement>;
}) {
    return (
        <div className="flex justify-between items-center w-full p-4 px-6 bg-[#1f76c6]">
            <div className="flex justify-center items-center">
                {title}
            </div>
            <div className="flex gap-4 justify-center items-center">
                <div className="flex justify-center items-center">
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={onClose} />
                </div>
            </div>
        </div>
    )
}

export function ActionMenuBody({ actionMenu }: {
    actionMenu: TActionMenu;
}) {
    switch (actionMenu.itemName) {
        case EItemName.AFFILIATE_NETWORK:
            return <AffiliateNetworkBody actionMenu={actionMenu} />;
        case EItemName.CAMPAIGN:
            return <CampaignBody actionMenu={actionMenu} />;
        case EItemName.FLOW:
            return <FlowBody actionMenu={actionMenu} />;
        case EItemName.LANDING_PAGE:
            return <LandingPageBody actionMenu={actionMenu} />;
        case EItemName.OFFER:
            return <OfferBody actionMenu={actionMenu} />;
        case EItemName.TRAFFIC_SOURCE:
            return <TrafficSourceBody actionMenu={actionMenu} />;
        default:
            return "";
    }
}

function ActionMenuBodyWrapper({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-start items-start gap-2 h-full w-full px-4 py-2">
            {children}
        </div>
    )
}

function AffiliateNetworkBody({ actionMenu }: {
    actionMenu: TAffiliateNetworkActionMenu;
}) {
    const { setActionMenu } = useReportView();

    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />
            <Input
                name="Default New Offer String"
                value={actionMenu.defaultNewOfferString || ""}
                onChange={e => setActionMenu({ ...actionMenu, defaultNewOfferString: e.target.value })}
            />
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
        </ActionMenuBodyWrapper>
    )
}

function CampaignBody({ actionMenu }: {
    actionMenu: TCampaignActionMenu;
}) {
    const { setActionMenu } = useReportView();

    const [trafficSources, setTrafficSources] = useState<TTrafficSource[]>([]);

    useEffect(() => {
        getAllTrafficSourcesAction()
            .then(traffSources => setTrafficSources(traffSources))
            .catch(() => toast.error("Error fetching Traffic Sources"));
    }, []);

    // TODO: ...

    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />
            <Select
                name="Traffic Source"
                value={actionMenu.trafficSourceId}
                onChange={e => setActionMenu({ ...actionMenu, trafficSourceId: Number(e.target.value) || undefined })}
            >
                <option value="">
                    None
                </option>
                {trafficSources.map(({ id, name }) => (
                    <option key={id} value={id}>
                        {name}
                    </option>
                ))}
            </Select>
            <Select
                name="Geo"
                value={actionMenu.geoName || $Enums.GeoName.UNITED_STATES}
                onChange={e => setActionMenu({ ...actionMenu, geoName: e.target.value as $Enums.GeoName })}
            >
                {Object.values($Enums.GeoName).map((geo, index) => (
                    <option key={index} value={geo}>
                        {geo}
                    </option>
                ))}
            </Select>
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
        </ActionMenuBodyWrapper>
    )
}

function FlowBody({ actionMenu }: {
    actionMenu: TFlowActionMenu;
}) {
    // TODO: ...
    return (
        <div>
            FlowBody
        </div>
    )
}

function LandingPageBody({ actionMenu }: {
    actionMenu: TLandingPageActionMenu;
}) {
    const { setActionMenu } = useReportView();

    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />
            <Input
                name="URL"
                value={actionMenu.url || ""}
                onChange={e => setActionMenu({ ...actionMenu, url: e.target.value })}
            />
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
        </ActionMenuBodyWrapper>
    )
}

function OfferBody({ actionMenu }: {
    actionMenu: TOfferActionMenu;
}) {
    const { setActionMenu } = useReportView();

    const [affiliateNetworks, setAffiliateNetworks] = useState<TAffiliateNetwork[]>([]);

    useEffect(() => {
        getAllAffiliateNetworksAction()
            .then(affNetworks => setAffiliateNetworks(affNetworks))
            .catch(() => toast.error("Error fetching Affiliate Networks"));
    }, []);

    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />
            <Select
                name="Affiliate Network"
                value={actionMenu.affiliateNetworkId}
                onChange={e => setActionMenu({ ...actionMenu, affiliateNetworkId: Number(e.target.value) || undefined })}
            >
                <option value="">
                    None
                </option>
                {affiliateNetworks.map(({ id, name }) => (
                    <option key={id} value={id}>
                        {name}
                    </option>
                ))}
            </Select>
            <Input
                name="URL"
                value={actionMenu.url || ""}
                onChange={e => setActionMenu({ ...actionMenu, url: e.target.value })}
            />
            <Input
                name="Payout"
                value={actionMenu.payout || 0}
                onChange={e => setActionMenu({ ...actionMenu, payout: Number(e.target.value) || 0 })}
            />
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
        </ActionMenuBodyWrapper>
    )
}

function TrafficSourceBody({ actionMenu }: {
    actionMenu: TTrafficSourceActionMenu;
}) {
    const { setActionMenu } = useReportView();
    // TODO: ...
    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />

            <Input
                name="Postback URL"
                value={actionMenu.postbackUrl || ""}
                onChange={e => setActionMenu({ ...actionMenu, postbackUrl: e.target.value })}
            />
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
        </ActionMenuBodyWrapper>
    )
}

export function ActionMenunFooter({ onClose, onSave, disabled }: {
    onClose: React.MouseEventHandler<Element>;
    onSave?: React.MouseEventHandler<Element>;
    disabled?: boolean;
}) {
    return (
        <div
            className="flex justify-end items-center w-full p-4 px-6"
            style={{ borderTop: "solid 1px grey" }}
        >
            <Button icon={faTimes} text="Cancel" className="mr-[4px]" onClick={onClose} />
            {onSave &&
                <Button icon={faCheck} text="Save" disabled={disabled} onClick={onSave} />
            }
        </div>
    )
}

type TAffiliateNetworkActionMenu = {
    itemName: EItemName.AFFILIATE_NETWORK;
    name?: string;
    defaultNewOfferString?: string;
    tags?: string[];
};

type TCampaignActionMenu = {
    itemName: EItemName.CAMPAIGN;
    name?: string;
    landingPageRotationType?: $Enums.RotationType;
    offerRotationType?: $Enums.RotationType;
    geoName?: $Enums.GeoName;
    tags?: string[];
    flowId?: number;
    trafficSourceId?: number;
};

type TFlowActionMenu = TFlowActionMenu_saved | TFlowActionMenu_builtIn | TFlowActionMenu_url;

type TFlowActionMenu_saved = {
    itemName: EItemName.FLOW;
    type: "SAVED";
    name?: string;
    mainRoute?: TRoute;
    ruleRoutes?: TRoute[];
    tags?: string[];
};

type TFlowActionMenu_builtIn = {
    itemName: EItemName.FLOW;
    type: "BUILT_IN";
    mainRoute?: TRoute;
    ruleRoutes?: TRoute[];
    tags?: string[];
};

type TFlowActionMenu_url = {
    itemName: EItemName.FLOW;
    type: "URL";
    url?: string;
    tags?: string[];
};

type TLandingPageActionMenu = {
    itemName: EItemName.LANDING_PAGE;
    name?: string;
    url?: string;
    tags?: string[];
};

type TOfferActionMenu = {
    itemName: EItemName.OFFER;
    name?: string;
    url?: string;
    payout?: number;
    tags?: string[];
    affiliateNetworkId?: number;
};

type TTrafficSourceActionMenu = {
    itemName: EItemName.TRAFFIC_SOURCE;
    name?: string;
    externalIdToken?: TToken;
    costToken?: TToken;
    customTokens?: TNamedToken[];
    postbackUrl?: string | null;
    tags?: string[];
};
