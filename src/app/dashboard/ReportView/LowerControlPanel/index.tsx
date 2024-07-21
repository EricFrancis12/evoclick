"use client";

import { useEffect } from "react";
import { faLink, faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { TPrimaryData, useReportView } from "../ReportViewContext";
import useNewReport from "@/hooks/useNewReport";
import useQueryRouter from "@/hooks/useQueryRouter";
import CalendarButton from "@/components/CalendarButton";
import RefreshButton from "@/components/RefreshButton";
import ReportButton from "@/components/ReportButton";
import ReportChain, { TReportChain } from "../ReportChain";
import LowerCPWrapper from "./LowerCPWrapper";
import LowerCPRow from "./LowerCPRow";
import { TView, useViewsStore } from "@/lib/store";
import Button from "@/components/Button";
import { TActionMenu, TAffiliateNetworkActionMenu, TCampaignActionMenu, TLandingPageActionMenu, TOfferActionMenu, TSavedFlowActionMenu, TTrafficSourceActionMenu } from "../ActionMenu/types";
import { encodeTimeframe, getPrimaryItemById, isPrimary, newPrimaryItemActionMenu } from "@/lib/utils";
import { EItemName, TAffiliateNetwork, TCampaign, TLandingPage, TOffer, TSavedFlow, TTrafficSource } from "@/lib/types";
import { TRow } from "../DataTable";

export default function LowerControlPanel({ view, reportItemName, rows, setRows }: {
    view: TView;
    reportItemName?: EItemName;
    rows: TRow[];
    setRows: (newRows: TRow[]) => void;
}) {
    const { setActionMenu, primaryData } = useReportView();
    const queryRouter = useQueryRouter();
    const selectedRows = rows.filter(row => row.selected === true);

    const { updateViewReportChainById } = useViewsStore(store => store);
    useEffect(() => {
        updateViewReportChainById(view.id, [{}, null]);
    }, [view.itemName]);

    const newReport = useNewReport();
    // Finds the first row that is selected and creates a report for it
    function handleNewReport() {
        if (!selectedRows[0]) return;
        newReport(view.itemName, selectedRows[0].id.toString(), view.timeframe);
    }

    function handleCreateNewItem() {
        setActionMenu(newPrimaryItemActionMenu(view.itemName));
    }

    function handleEditItem() {
        if (typeof selectedRows[0]?.id !== "number") return;
        setActionMenu(makeActionMenu(primaryData, view.itemName, selectedRows[0].id));
    }

    function handleDeleteItem() {
        const { ok, primaryItemName } = isPrimary(view.itemName);
        if (!ok) return;
        setActionMenu({
            type: "delete item",
            primaryItemName,
            ids: selectedRows.reduce((ids: number[], { id }) => {
                return typeof id === "number" ? [...ids, id] : ids;
            }, [])
        });
    }

    function handleReportChainChange(reportChain: TReportChain) {
        setRows(rows.map(row => ({ ...row, selected: false }))); // Deselect all rows on report chain change
        updateViewReportChainById(view.id, reportChain)
    }

    function handleGetCampaignLinks() {
        if (view.itemName !== EItemName.CAMPAIGN || typeof selectedRows[0]?.id !== "number") return;
        setActionMenu({
            type: "campaign links",
            campaignId: selectedRows[0].id,
        });
    }

    return (
        <LowerCPWrapper>
            <LowerCPRow>
                <CalendarButton
                    timeframe={view.timeframe}
                    onChange={timeframe => queryRouter.push(
                        window.location.href,
                        { timeframe: encodeTimeframe(timeframe) }
                    )}
                />
                <RefreshButton />
                {view.type === "main" &&
                    <>
                        <ReportButton
                            onClick={handleNewReport}
                            disabled={selectedRows.length < 1}
                        />
                        {isPrimary(view.itemName).ok &&
                            <>
                                <Button
                                    text={`Edit ${view.itemName}`}
                                    icon={faPencil}
                                    disabled={selectedRows.length !== 1}
                                    onClick={handleEditItem}
                                />
                                <Button
                                    text={`Delete ${view.itemName}${selectedRows.length > 1 ? "s" : ""}`}
                                    icon={faTrash}
                                    disabled={selectedRows.length === 0}
                                    onClick={handleDeleteItem}
                                />
                            </>
                        }
                    </>
                }
            </LowerCPRow>
            <LowerCPRow>
                {view.type === "report" &&
                    <ReportChain
                        reportChain={view.reportChain}
                        onChange={handleReportChainChange}
                        omissions={reportItemName ? [view.itemName, reportItemName] : [view.itemName]}
                        itemName={view.itemName}
                    />
                }
                {view.type === "main" &&
                    <>
                        <Button
                            text={`Create New ${isPrimary(view.itemName).ok ? view.itemName : EItemName.CAMPAIGN}`}
                            icon={faPlus}
                            onClick={handleCreateNewItem}
                        />
                        {(view.itemName === EItemName.CAMPAIGN && selectedRows.length > 0) &&
                            <Button
                                text="Get Campaign Links"
                                icon={faLink}
                                onClick={() => handleGetCampaignLinks()}
                            />
                        }
                    </>
                }
            </LowerCPRow>
        </LowerCPWrapper>
    )
}

export function makeActionMenu(primaryData: TPrimaryData, itemName: EItemName, id: number): TActionMenu | null {
    const { primaryItemName } = isPrimary(itemName);
    if (primaryItemName) {
        const item = getPrimaryItemById(primaryData, primaryItemName, id);
        switch (item?.primaryItemName) {
            case EItemName.AFFILIATE_NETWORK:
                return newAffiliateNetworkActionMenu(item);
            case EItemName.CAMPAIGN:
                return newCampaignActionMenu(item);
            case EItemName.FLOW:
                return newSavedFlowActionMenu(item);
            case EItemName.LANDING_PAGE:
                return newLandingPageActionMenu(item);
            case EItemName.OFFER:
                return newOfferActionMenu(item);
            case EItemName.TRAFFIC_SOURCE:
                return newTrafficSourceActionMenu(item);
        }
    }
    return null;
}


function newAffiliateNetworkActionMenu(affiliateNetwork: TAffiliateNetwork): TAffiliateNetworkActionMenu {
    return {
        ...affiliateNetwork,
        type: EItemName.AFFILIATE_NETWORK,
        itemName: EItemName.AFFILIATE_NETWORK,
    };
}

function newCampaignActionMenu(campaign: TCampaign): TCampaignActionMenu {
    const { savedFlowId, flowUrl, flowMainRoute, flowRuleRoutes } = campaign;
    return {
        ...campaign,
        type: EItemName.CAMPAIGN,
        itemName: EItemName.CAMPAIGN,
        savedFlowId: savedFlowId ?? undefined,
        flowUrl: flowUrl ?? undefined,
        flowMainRoute: flowMainRoute ?? undefined,
        flowRuleRoutes: flowRuleRoutes ?? undefined,
    };
}

function newSavedFlowActionMenu(savedFlow: TSavedFlow): TSavedFlowActionMenu {
    const { id, name, mainRoute, ruleRoutes, tags } = savedFlow;
    return {
        type: EItemName.FLOW,
        itemName: EItemName.FLOW,
        id,
        name: name ?? undefined,
        mainRoute: mainRoute ?? undefined,
        ruleRoutes: ruleRoutes ?? undefined,
        tags: tags ?? undefined,
    };
}

function newLandingPageActionMenu(landingPage: TLandingPage): TLandingPageActionMenu {
    return {
        ...landingPage,
        type: EItemName.LANDING_PAGE,
        itemName: EItemName.LANDING_PAGE,
    };
}

function newOfferActionMenu(offer: TOffer): TOfferActionMenu {
    return {
        ...offer,
        type: EItemName.OFFER,
        itemName: EItemName.OFFER,
    };
}

function newTrafficSourceActionMenu(trafficSource: TTrafficSource): TTrafficSourceActionMenu {
    return {
        ...trafficSource,
        type: EItemName.TRAFFIC_SOURCE,
        itemName: EItemName.TRAFFIC_SOURCE,
    };
}
