'use client';

import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import { EItemName, TNamedToken, TRoute, TToken } from '@/lib/types';
import { $Enums } from '@prisma/client';

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
        throw new Error('useReportView must be used within a ReportViewContext provider');
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
        <div className="flex flex-col justify-between items-center h-[400px] w-[300px] bg-white rounded">
            <ActionMenuHeader title={actionMenu.itemName} onClose={onClose} />
            <ActionMenuBody actionMenu={actionMenu} />
            <ActionMenunFooter onSave={() => console.log("Save button clicked")} onClose={onClose} />
        </div>
    )
}

export function ActionMenuHeader({ title, onClose }: {
    title: string,
    onClose: React.MouseEventHandler<HTMLSpanElement>
}) {
    return (
        <div
            className='flex justify-between items-center w-full p-4 px-6 bg-[#314a77]'
            style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
        >
            <div className='flex justify-center items-center'>
                <div className='flex justify-center items-center'>
                    {title}
                </div>
            </div>
            <div className='flex gap-4 justify-center items-center'>
                <div className='flex justify-center items-center'>
                    <span className='cursor-pointer' onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
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

function AffiliateNetworkBody({ actionMenu }: {
    actionMenu: TActionMenu;
}) {
    return (
        <div>
            AffiliateNetworkBody
        </div>
    )
}

function CampaignBody({ actionMenu }: {
    actionMenu: TActionMenu;
}) {
    return (
        <div>
            CampaignBody
        </div>
    )
}

function FlowBody({ actionMenu }: {
    actionMenu: TActionMenu;
}) {
    return (
        <div>
            FlowBody
        </div>
    )
}

function LandingPageBody({ actionMenu }: {
    actionMenu: TActionMenu;
}) {
    return (
        <div>
            LandingPageBody
        </div>
    )
}

function OfferBody({ actionMenu }: {
    actionMenu: TActionMenu;
}) {
    return (
        <div>
            OfferBody
        </div>
    )
}

function TrafficSourceBody({ actionMenu }: {
    actionMenu: TActionMenu;
}) {
    return (
        <div>
            TrafficSourceBody
        </div>
    )
}

export function ActionMenunFooter({ onClose, onSave, disabled }: {
    onClose: React.MouseEventHandler<Element>,
    onSave?: React.MouseEventHandler<Element>,
    disabled?: boolean
}) {
    return (
        <div
            className='flex justify-end items-center w-full p-4 px-6'
            style={{ borderTop: 'solid 1px grey' }}
        >
            <span className='mr-[4px]'>
                <Button icon={faTimes} text='Cancel' onClick={onClose} />
            </span>
            {onSave &&
                <span>
                    <Button icon={faCheck} text='Save' disabled={disabled} onClick={onSave} />
                </span>
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
    tags?: string[];
    url?: string;
};

type TOfferActionMenu = {
    itemName: EItemName.OFFER;
    name?: string;
    tags?: string[];
    url?: string;
    payout?: number;
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
