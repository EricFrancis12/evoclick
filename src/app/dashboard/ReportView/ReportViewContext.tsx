"use client";

import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import FlowBuilder, { newRoute } from "./FlowBuilder";
import TagsInput from "@/components/TagsInput";
import Button from "@/components/Button";
import { Input, Select, SelectionButtons } from "@/components/base";
import {
    createNewAffiliateNetworkAction, createNewCampaignAction, createNewFlowAction,
    createNewLandingPageAction, createNewOfferAction, createNewTrafficSourceAction,
    getAllAffiliateNetworksAction, getAllFlowsAction, getAllTrafficSourcesAction,
    updateAffiliateNetworkAction, updateCampaignAction, updateFlowAction,
    updateLandingPageAction, updateOfferAction, updateTrafficSourceAction
} from "@/lib/actions";
import { EItemName, TAffiliateNetwork, TClick, TFlow, TNamedToken, TRoute, TToken, TTrafficSource } from "@/lib/types";
import { $Enums } from "@prisma/client";

export type TActionMenu = TAffiliateNetworkActionMenu | TCampaignActionMenu | TSavedFlowActionMenu
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
                <PopoverLayer layer={1}>
                    <ActionMenu actionMenu={actionMenu} onClose={() => setActionMenu(null)} />
                </PopoverLayer>
            }
            {children}
        </ReportViewContext.Provider >
    )
}

function PopoverLayer({ children, layer = 1, dark = true }: {
    children: React.ReactNode;
    layer?: number;
    dark?: boolean;
}) {
    const zIndex = layer * 100;

    return (
        <>
            {dark &&
                <div
                    className="absolute top-0 left-0 h-screen w-screen bg-black opacity-50"
                    style={{ zIndex: zIndex - 1 }}
                />
            }
            <div
                className="absolute top-0 left-0 flex justify-center items-center h-screen w-screen bg-transparent"
                style={{ zIndex }}
            >
                {children}
            </div>
        </>
    )
}

function ActionMenu({ actionMenu, onClose }: {
    actionMenu: TActionMenu;
    onClose: () => any;
}) {
    return (
        <div className="flex flex-col items-center bg-white">
            <ActionMenuHeader
                title={actionMenu.itemName}
                onClose={onClose}
            />
            <ActionMenuBody actionMenu={actionMenu} />
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
            return <SavedFlowBody actionMenu={actionMenu} />;
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

    async function handleSave() {
        try {
            const { id, name, defaultNewOfferString, tags } = actionMenu;
            if (typeof id === "number") {
                await updateAffiliateNetworkAction(id, { name, defaultNewOfferString, tags }, window.location.href);
                toast.success("Affiliate Network was updated successfully");
            } else {
                await createNewAffiliateNetworkAction({
                    name: name ?? "",
                    defaultNewOfferString: defaultNewOfferString ?? "",
                    tags: tags ?? [],
                }, window.location.href);
                toast.success("Successfully created new Affiliate Network");
            }
            setActionMenu(null);
        } catch (err) {
            console.error(err);
            toast.error("Error completing operation");
        }
    }

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
            <ActionMenuFooter onSave={handleSave} />
        </ActionMenuBodyWrapper>
    )
}

function CampaignBody({ actionMenu }: {
    actionMenu: TCampaignActionMenu;
}) {
    const { setActionMenu } = useReportView();

    const [flows, setFlows] = useState<TFlow[]>([]);
    const [trafficSources, setTrafficSources] = useState<TTrafficSource[]>([]);

    const [flowBuilderOpen, setFlowBuilderOpen] = useState<boolean>(false);

    useEffect(() => {
        getAllTrafficSourcesAction()
            .then(_trafficSources => setTrafficSources(_trafficSources))
            .catch(() => toast.error("Error fetching Traffic Sources"));

        getAllFlowsAction()
            .then(_flows => {
                setFlows(_flows);

                const flow = _flows.find(_flow => _flow.id === actionMenu.flowId);
                if (!flow) return;

                const { type, id, name, url, mainRoute, ruleRoutes, tags } = flow;
                setActionMenu({
                    ...actionMenu,
                    flowData: {
                        type,
                        name: name ?? undefined,
                        url: url ?? undefined,
                        mainRoute: mainRoute ?? undefined,
                        ruleRoutes: ruleRoutes ?? undefined,
                        tags,
                    },
                });
            })
            .catch(() => toast.error("Error fetching Flows"));
    }, []);

    async function handleSave() {
        if (!actionMenu.flowData?.type) {
            toast.error("A flow type is required");
            return;
        };
        try {
            const { id, name, landingPageRotationType, offerRotationType, geoName, tags, trafficSourceId } = actionMenu;
            let flowId: number | undefined = actionMenu.flowId;
            if (actionMenu.flowData?.type !== "SAVED") {
                const { type, mainRoute, ruleRoutes, url, tags } = actionMenu.flowData;
                if (typeof flowId === "number") {
                    await updateFlowAction(flowId, { mainRoute, ruleRoutes, url, tags }, window.location.href);
                    toast.success("Flow was updated successfully");
                } else if (type === "URL") {
                    const createdFlow = await createNewFlowAction({
                        name: null,
                        type: $Enums.FlowType.URL,
                        mainRoute: null,
                        ruleRoutes: null,
                        url: url ?? "",
                        tags: tags ?? [],
                    }, window.location.href);
                    toast.success("Successfully created new URL Flow");
                    flowId = createdFlow.id;
                } else {
                    const createdFlow = await createNewFlowAction({
                        name: null,
                        type: $Enums.FlowType.BUILT_IN,
                        mainRoute: mainRoute ?? newRoute(),
                        ruleRoutes: ruleRoutes ?? [],
                        url: null,
                        tags: tags ?? [],
                    }, window.location.href);
                    toast.success("Successfully created new Built-in Flow");
                    flowId = createdFlow.id;
                }
            }

            if (flowId == undefined) {
                toast.error("Missing flow ID");
                return;
            } else if (typeof id === "number") {
                await updateCampaignAction(id, {
                    name,
                    landingPageRotationType,
                    offerRotationType,
                    geoName,
                    tags,
                    flowId,
                    trafficSourceId
                }, window.location.href);
                toast.success("Campaign was updated successfully");
            } else if (trafficSourceId !== undefined) {
                await createNewCampaignAction({
                    name: name ?? "",
                    landingPageRotationType: landingPageRotationType ?? $Enums.RotationType.RANDOM,
                    offerRotationType: offerRotationType ?? $Enums.RotationType.RANDOM,
                    geoName: geoName ?? $Enums.GeoName.NONE,
                    tags: tags ?? [],
                    flowId: flowId,
                    trafficSourceId
                }, window.location.href);
                toast.success("Successfully created new Campaign");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error completing operation");
        }
    }

    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />
            <Select
                name="Geo"
                value={actionMenu.geoName}
                onChange={e => setActionMenu({ ...actionMenu, geoName: e.target.value as $Enums.GeoName })}
            >
                {Object.values($Enums.GeoName).map((geo, index) => (
                    <option key={index} value={geo}>
                        {geo}
                    </option>
                ))}
            </Select>
            <Select
                name="Traffic Source"
                value={actionMenu.trafficSourceId}
                onChange={e => setActionMenu({ ...actionMenu, trafficSourceId: Number(e.target.value) || undefined })}
            >
                <option value="">None</option>
                {trafficSources.map(({ id, name }) => (
                    <option key={id} value={id}>
                        {name}
                    </option>
                ))}
            </Select>
            <SelectionButtons
                name="Flow"
                options={Object.values($Enums.FlowType)}
                value={actionMenu.flowData?.type || ""}
                onClick={flowType => setActionMenu({
                    ...actionMenu,
                    flowData: {
                        ...actionMenu.flowData,
                        type: flowType as $Enums.FlowType,
                    },
                })}
            >
                {actionMenu.flowData?.type === "SAVED" &&
                    <Select
                        name="Saved Flows"
                        value={actionMenu.flowId}
                        onChange={e => setActionMenu({
                            ...actionMenu,
                            flowId: Number(e.target.value),
                        })}
                    >
                        <option value="">None</option>
                        {flows.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </Select>
                }
                {actionMenu.flowData?.type === "BUILT_IN" &&
                    <Button text="Edit Built-In Flow" onClick={() => setFlowBuilderOpen(prev => !prev)} />
                }
                {actionMenu.flowData?.type === "URL" &&
                    <Input
                        name="URL"
                        value={actionMenu.flowData.url || ""}
                        onChange={e => setActionMenu({
                            ...actionMenu,
                            flowData: {
                                ...actionMenu.flowData,
                                url: e.target.value,
                            },
                        })}
                    />
                }
            </SelectionButtons>
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
            <ActionMenuFooter onSave={handleSave} />
            {flowBuilderOpen &&
                <PopoverLayer layer={2}>
                    <div className="px-6 py-4 bg-white border">
                        <FlowBuilder
                            value={{
                                mainRoute: actionMenu.flowData?.mainRoute || newRoute(),
                                ruleRoutes: actionMenu.flowData?.ruleRoutes || [],
                            }}
                            onChange={({ mainRoute, ruleRoutes }) => setActionMenu({
                                ...actionMenu,
                                flowData: {
                                    ...actionMenu.flowData,
                                    mainRoute,
                                    ruleRoutes,
                                },
                            })}
                        />
                        <div
                            className="flex justify-center items-center w-full mt-6 px-2 py-4"
                            style={{ borderTop: "solid 1px #cfcfcf" }}
                        >
                            <Button text="Done" onClick={() => setFlowBuilderOpen(false)} />
                        </div>
                    </div>
                </PopoverLayer>
            }
        </ActionMenuBodyWrapper>
    )
}

function SavedFlowBody({ actionMenu }: {
    actionMenu: TSavedFlowActionMenu;
}) {
    const { setActionMenu } = useReportView();

    const [flowBuilderOpen, setFlowBuilderOpen] = useState<boolean>(false);

    async function handleSave() {
        try {
            const { id, name, mainRoute, ruleRoutes, tags } = actionMenu;
            if (typeof id === "number") {
                await updateFlowAction(id, { name, mainRoute, ruleRoutes, tags }, window.location.href);
                toast.success("Saved Flow was updated successfully");
            } else {
                await createNewFlowAction({
                    name: name ?? "",
                    type: $Enums.FlowType.SAVED,
                    mainRoute: mainRoute ?? newRoute(),
                    ruleRoutes: ruleRoutes ?? [],
                    url: null,
                    tags: tags ?? [],
                }, window.location.href);
                toast.success("Successfully created new Saved Flow");
            }
            setActionMenu(null);
        } catch (err) {
            console.error(err);
            toast.error("Error completing operation");
        }
    }

    return (
        <ActionMenuBodyWrapper>
            <Input
                name="Name"
                value={actionMenu.name || ""}
                onChange={e => setActionMenu({ ...actionMenu, name: e.target.value })}
            />
            <Button text="Edit Flow" onClick={() => setFlowBuilderOpen(prev => !prev)} />
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
            <ActionMenuFooter onSave={handleSave} />
            {flowBuilderOpen &&
                <PopoverLayer layer={2}>
                    <div className="px-6 py-4 bg-white border">
                        <FlowBuilder
                            value={{
                                mainRoute: actionMenu.mainRoute || newRoute(),
                                ruleRoutes: actionMenu.ruleRoutes || [],
                            }}
                            onChange={({ mainRoute, ruleRoutes }) => setActionMenu({ ...actionMenu, mainRoute, ruleRoutes })}
                        />
                        <div
                            className="flex justify-center items-center w-full mt-6 px-2 py-4"
                            style={{ borderTop: "solid 1px #cfcfcf" }}
                        >
                            <Button text="Done" onClick={() => setFlowBuilderOpen(false)} />
                        </div>
                    </div>
                </PopoverLayer>
            }
        </ActionMenuBodyWrapper>
    )
}

function LandingPageBody({ actionMenu }: {
    actionMenu: TLandingPageActionMenu;
}) {
    const { setActionMenu } = useReportView();

    async function handleSave() {
        try {
            const { id, name, url, tags } = actionMenu;
            if (typeof id === "number") {
                await updateLandingPageAction(id, { name, url, tags }, window.location.href);
                toast.success("Landing Page was updated successfully");
            } else {
                await createNewLandingPageAction({
                    name: name ?? "",
                    url: url ?? "",
                    tags: tags ?? [],
                }, window.location.href);
                toast.success("Successfully created new Landing Page");
            }
            setActionMenu(null);
        } catch (err) {
            console.error(err);
            toast.error("Error completing operation");
        }
    }

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
            <ActionMenuFooter onSave={handleSave} />
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

    async function handleSave() {
        try {
            const { id, name, url, payout, tags, affiliateNetworkId } = actionMenu;
            if (typeof id === "number") {
                await updateOfferAction(id, { name, url, payout, tags, affiliateNetworkId }, window.location.href);
                toast.success("Offer was updated successfully");
            } else if (affiliateNetworkId !== undefined) {
                await createNewOfferAction({
                    name: name ?? "",
                    url: url ?? "",
                    payout: payout ?? 0,
                    tags: tags ?? [],
                    affiliateNetworkId: affiliateNetworkId,
                }, window.location.href);
                toast.success("Successfully created new Offer");
            }
            setActionMenu(null);
        } catch (err) {
            console.error(err);
            toast.error("Error completing operation");
        }
    }

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
            <ActionMenuFooter onSave={handleSave} />
        </ActionMenuBodyWrapper>
    )
}

function TrafficSourceBody({ actionMenu }: {
    actionMenu: TTrafficSourceActionMenu;
}) {
    const { setActionMenu } = useReportView();

    const [tokensMenuOpen, setTokensMenuOpen] = useState<boolean>(false);

    async function handleSave() {
        try {
            const { id, name, externalIdToken, costToken, customTokens, postbackUrl, tags } = actionMenu;
            if (typeof id === "number") {
                await updateTrafficSourceAction(id, { name, externalIdToken, costToken, customTokens, postbackUrl, tags }, window.location.href);
                toast.success("Traffic Source was updated successfully");
            } else {
                await createNewTrafficSourceAction({
                    name: name ?? "",
                    externalIdToken: externalIdToken ?? newToken(),
                    costToken: costToken ?? newToken(),
                    customTokens: customTokens ?? [],
                    postbackUrl: postbackUrl ?? "",
                    tags: tags ?? [],
                }, window.location.href);
                toast.success("Successfully created new Traffic Source");
            }
            setActionMenu(null);
        } catch (err) {
            console.error(err);
            toast.error("Error completing operation");
        }
    }

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
            <Button text="Edit Tokens" onClick={() => setTokensMenuOpen(prev => !prev)} />
            <TagsInput
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
            <ActionMenuFooter onSave={handleSave} />
            {tokensMenuOpen &&
                <PopoverLayer layer={2}>
                    <div className="px-6 py-4 bg-white border">
                        <TokensInputWrapper
                            onCreateNew={() => setActionMenu({
                                ...actionMenu,
                                customTokens: [...(actionMenu.customTokens || []), newNamedToken()]
                            })}
                        >
                            <TokenInput
                                title="External ID"
                                token={actionMenu.externalIdToken || newToken()}
                                onChange={externalIdToken => setActionMenu({ ...actionMenu, externalIdToken })}
                            />
                            <TokenInput
                                title="Cost"
                                token={actionMenu.costToken || newToken()}
                                onChange={costToken => setActionMenu({ ...actionMenu, costToken })}
                            />
                            {actionMenu.customTokens?.map((token, index) => (
                                <TokenInput
                                    key={index}
                                    title={`Custom ${index + 1}`}
                                    token={token as TNamedToken}
                                    onChange={_token => setActionMenu({
                                        ...actionMenu,
                                        customTokens: actionMenu.customTokens?.map(
                                            (custToken, i) => i === index && "name" in _token
                                                ? { ..._token }
                                                : custToken
                                        ),
                                    })}
                                    onDelete={() => setActionMenu({
                                        ...actionMenu,
                                        customTokens: actionMenu.customTokens?.filter((_, i) => i !== index)
                                    })}
                                />
                            ))}
                        </TokensInputWrapper>
                        <div
                            className="flex justify-center items-center w-full mt-6 px-2 py-4"
                            style={{ borderTop: "solid 1px #cfcfcf" }}
                        >
                            <Button text="Done" onClick={() => setTokensMenuOpen(false)} />
                        </div>
                    </div>
                </PopoverLayer>
            }
        </ActionMenuBodyWrapper>
    )
}

function ActionMenuFooter({ onSave, disabled }: {
    onSave: () => any;
    disabled?: boolean;
}) {
    return (
        <div
            className="flex justify-end items-center w-full p-4 px-6"
            style={{ borderTop: "solid 1px grey" }}
        >
            <Button icon={faCheck} text="Save" disabled={disabled} onClick={onSave} />
        </div>
    )
}

function newToken(): TToken {
    return {
        queryParam: "",
        value: "",
    };
}

function newNamedToken(): TNamedToken {
    return {
        ...newToken(),
        name: "",
    };
}

function TokensInputWrapper({ children, onCreateNew }: {
    children: React.ReactNode;
    onCreateNew: () => any;
}) {
    // TODO: Refactor token columns
    return (
        <div className="flex flex-col justify-start items-start w-full">
            <div className="flex justify-between items-center p-1 w-full">
                <div className="flex justify-center items-center h-full w-full">
                    <span></span>
                </div>
                <div className="flex justify-center items-center h-full w-full">
                    <span>Query param</span>
                </div>
                <div className="flex justify-center items-center h-full w-full">
                    <span>Token</span>
                </div>
                <div className="flex justify-center items-center h-full w-full">
                    <span>Name</span>
                </div>
                <div className="w-[50px]">
                    <span></span>
                </div>
            </div>
            {children}
            <div
                className="flex justify-center items-center mt-4 p-1 w-full hover:bg-gray-200 cursor-pointer"
                style={{ border: "solid black 1px", borderRadius: "6px", userSelect: "none" }}
                onClick={onCreateNew}
            >
                <div className="flex justify-center items-center p-1 w-full">
                    <span>+ Add Custom Token</span>
                </div>
            </div>
        </div>
    )
}

function TokenInput({ token, onChange, onDelete, title = "" }: {
    token: TToken | TNamedToken;
    onChange: (t: typeof token) => any;
    onDelete?: () => any;
    title?: string;
}) {
    const isNamedToken = "name" in token;

    return (
        <div className="flex justify-between items-center gap-2 w-full p-2"
            style={{ borderTop: "solid grey 1px" }}
        >
            <div className="flex justify-start items-center h-full w-full">
                <span>{title}</span>
            </div>
            <div className="flex justify-center items-center h-full w-full">
                <Input
                    name=""
                    placeholder="query parameter"
                    value={token.queryParam}
                    onChange={e => onChange({ ...token, queryParam: e.target.value })}
                />
            </div>
            <div className="flex justify-center items-center h-full w-full">
                <Input
                    name=""
                    placeholder="{value}"
                    value={token.value}
                    onChange={e => onChange({ ...token, value: e.target.value })}
                />
            </div>
            <div className="flex justify-center items-center h-full w-full">
                {isNamedToken &&
                    <Input
                        name=""
                        placeholder="name"
                        value={token.name}
                        onChange={e => onChange({ ...token, name: e.target.value })}

                    />
                }
            </div>
            <div className="flex justify-center items-center h-full w-[50px]">
                {isNamedToken &&
                    <span
                        className="cursor-pointer text-black hover:text-red-500"
                        onClick={onDelete}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </span>
                }
            </div>
        </div>
    )
}

type TAffiliateNetworkActionMenu = {
    itemName: EItemName.AFFILIATE_NETWORK;
    id?: number;
    name?: string;
    defaultNewOfferString?: string;
    tags?: string[];
};

type TCampaignActionMenu = {
    itemName: EItemName.CAMPAIGN;
    id?: number;
    name?: string;
    landingPageRotationType?: $Enums.RotationType;
    offerRotationType?: $Enums.RotationType;
    geoName?: $Enums.GeoName;
    tags?: string[];
    flowId?: number;
    flowData?: TFlowData;
    trafficSourceId?: number;
};

type TFlowData = {
    type?: $Enums.FlowType;
    name?: string;
    url?: string;
    mainRoute?: TRoute;
    ruleRoutes?: TRoute[];
    tags?: string[];
};

type TSavedFlowActionMenu = {
    itemName: EItemName.FLOW;
    id?: number;
    type: "SAVED";
    name?: string;
    mainRoute?: TRoute;
    ruleRoutes?: TRoute[];
    tags?: string[];
};

type TLandingPageActionMenu = {
    itemName: EItemName.LANDING_PAGE;
    id?: number;
    name?: string;
    url?: string;
    tags?: string[];
};

type TOfferActionMenu = {
    itemName: EItemName.OFFER;
    id?: number;
    name?: string;
    url?: string;
    payout?: number;
    tags?: string[];
    affiliateNetworkId?: number;
};

type TTrafficSourceActionMenu = {
    itemName: EItemName.TRAFFIC_SOURCE;
    id?: number;
    name?: string;
    externalIdToken?: TToken;
    costToken?: TToken;
    customTokens?: TNamedToken[];
    postbackUrl?: string | null;
    tags?: string[];
};
