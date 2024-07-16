"use client";

import { useEffect } from "react";
import { faLink, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { newPrimaryItemActionMenu, TActionMenu, TPrimaryData, useReportView } from "./ReportViewContext";
import useQueryRouter from "@/hooks/useQueryRouter";
import CalendarButton from "@/components/CalendarButton";
import RefreshButton from "@/components/RefreshButton";
import ReportButton from "@/components/ReportButton";
import ReportChain, { TReportChain } from "./ReportChain";
import { TView, useViewsStore } from "@/lib/store";
import Button from "@/components/Button";
import { encodeTimeframe } from "@/lib/utils";
import { EItemName } from "@/lib/types";
import { TRow } from "./DataTable";

export default function LowerControlPanel({ view, onNewReport, reportItemName, rows, setRows }: {
    view: TView;
    onNewReport: () => void;
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

    function handleCreateNewItem() {
        setActionMenu(newPrimaryItemActionMenu(view.itemName));
    }

    function handleEditItem() {
        if (selectedRows.length < 1) return;
        if (typeof selectedRows[0].id !== "number") return;
        setActionMenu(makeActionMenu(primaryData, view.itemName, selectedRows[0].id));
    }

    function handleReportChainChange(reportChain: TReportChain) {
        setRows(rows.map(row => ({ ...row, selected: false }))); // Deselect all rows on report chain change
        updateViewReportChainById(view.id, reportChain)
    }

    function handleGetCampaignLinks(rowId: string | number) {
        if (view.itemName !== EItemName.CAMPAIGN || typeof rowId !== "number") return;
        setActionMenu({
            type: "campaign links",
            campaignId: rowId,
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
                            onClick={onNewReport}
                            disabled={selectedRows.length < 1}
                        />
                        {selectedRows.length > 0 && isPrimary(view.itemName)
                            ? <Button
                                text={`Edit ${view.itemName}`}
                                icon={faPencil}
                                onClick={handleEditItem}
                            />
                            : <Button
                                text={`Create New ${isPrimary(view.itemName) ? view.itemName : EItemName.CAMPAIGN}`}
                                icon={faPlus}
                                onClick={handleCreateNewItem}
                            />
                        }
                        {(selectedRows.length === 1 && view.itemName === EItemName.CAMPAIGN) &&
                            <Button
                                text="Get Campaign Links"
                                icon={faLink}
                                onClick={() => handleGetCampaignLinks(selectedRows[0].id)}
                            />
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
                    />
                }
            </LowerCPRow>
        </LowerCPWrapper>
    )
}

export function LowerCPWrapper({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="flex flex-col justify-center gap-6 w-full px-8 py-6 bg-[#ebedef]"
            style={{ borderTop: "solid lightgrey 3px" }}
        >
            {children}
        </div>
    )
}

export function LowerCPRow({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex gap-6 w-full">
            <div className="flex flex-wrap gap-2 justify-center items-center">
                {children}
            </div>
        </div>
    )
}

function makeActionMenu(primaryData: TPrimaryData, itemName: EItemName, id: number): TActionMenu | null {
    let actionMenu: TActionMenu | null = null;
    if (itemName === EItemName.AFFILIATE_NETWORK) {
        const an = getPrimaryItemById(primaryData, "affiliateNetworks", id);
        actionMenu = {
            type: itemName,
            itemName,
            id: an?.id,
            name: an?.name,
            defaultNewOfferString: an?.defaultNewOfferString,
            tags: an?.tags,
        };
    } else if (itemName === EItemName.CAMPAIGN) {
        const ca = getPrimaryItemById(primaryData, "campaigns", id);
        actionMenu = {
            type: itemName,
            itemName,
            id: ca?.id,
            name: ca?.name,
            landingPageRotationType: ca?.landingPageRotationType,
            offerRotationType: ca?.offerRotationType,
            geoName: ca?.geoName,
            tags: ca?.tags,
            trafficSourceId: ca?.trafficSourceId,
            flowType: ca?.flowType,
            savedFlowId: ca?.savedFlowId ?? undefined,
            flowUrl: ca?.flowUrl ?? undefined,
            flowMainRoute: ca?.flowMainRoute ?? undefined,
            flowRuleRoutes: ca?.flowRuleRoutes ?? undefined,
        };
    } else if (itemName === EItemName.FLOW) {
        const fl = getPrimaryItemById(primaryData, "flows", id);
        actionMenu = {
            type: itemName,
            itemName,
            id: fl?.id,
            name: fl?.name ?? undefined,
            mainRoute: fl?.mainRoute ?? undefined,
            ruleRoutes: fl?.ruleRoutes ?? undefined,
            tags: fl?.tags ?? undefined,
        };
    } else if (itemName === EItemName.LANDING_PAGE) {
        const lp = getPrimaryItemById(primaryData, "landingPages", id);
        actionMenu = {
            type: itemName,
            itemName,
            id: lp?.id,
            name: lp?.name,
            url: lp?.url,
            tags: lp?.tags,
        };
    } else if (itemName === EItemName.OFFER) {
        const o = getPrimaryItemById(primaryData, "offers", id);
        actionMenu = {
            type: itemName,
            itemName,
            id: o?.id,
            name: o?.name,
            payout: o?.payout,
            url: o?.url,
            tags: o?.tags,
            affiliateNetworkId: o?.affiliateNetworkId,
        };
    } else if (itemName === EItemName.TRAFFIC_SOURCE) {
        const ts = getPrimaryItemById(primaryData, "trafficSources", id);
        actionMenu = {
            type: itemName,
            itemName,
            id: ts?.id,
            name: ts?.name,
            externalIdToken: ts?.externalIdToken,
            costToken: ts?.costToken,
            customTokens: ts?.customTokens,
            postbackUrl: ts?.postbackUrl,
            tags: ts?.tags,
        };
    }
    return actionMenu;
}

export function getPrimaryItemById<T extends keyof TPrimaryData>(
    primaryData: TPrimaryData,
    itemName: T,
    id: number
): TPrimaryData[T][number] | null {
    const items = primaryData[itemName];
    return items.find(item => item.id === id) ?? null;
}

export function isPrimary(itemName: EItemName): boolean {
    return itemName === EItemName.AFFILIATE_NETWORK
        || itemName === EItemName.CAMPAIGN
        || itemName === EItemName.FLOW
        || itemName === EItemName.LANDING_PAGE
        || itemName === EItemName.OFFER
        || itemName === EItemName.TRAFFIC_SOURCE;
}
