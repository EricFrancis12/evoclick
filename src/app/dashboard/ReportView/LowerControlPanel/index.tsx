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
import { TActionMenu } from "../ActionMenu/types";
import { encodeTimeframe, getPrimaryItemById, itemNameIsPrimary, newPrimaryItemActionMenu } from "@/lib/utils";
import { EItemName } from "@/lib/types";
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
        if (selectedRows.length < 1) return;
        newReport(view.itemName, selectedRows[0].id.toString(), view.timeframe);
    }

    function handleCreateNewItem() {
        setActionMenu(newPrimaryItemActionMenu(view.itemName));
    }

    function handleEditItem() {
        if (selectedRows.length < 1) return;
        if (typeof selectedRows[0].id !== "number") return;
        setActionMenu(makeActionMenu(primaryData, view.itemName, selectedRows[0].id));
    }

    function handleDeleteItem() {
        const { isPrimary, primaryItemName } = itemNameIsPrimary(view.itemName);
        if (!isPrimary) return;
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
                            onClick={handleNewReport}
                            disabled={selectedRows.length < 1}
                        />
                        {itemNameIsPrimary(view.itemName).isPrimary &&
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
                            text={`Create New ${itemNameIsPrimary(view.itemName).isPrimary ? view.itemName : EItemName.CAMPAIGN}`}
                            icon={faPlus}
                            onClick={handleCreateNewItem}
                        />
                        {(view.itemName === EItemName.CAMPAIGN && selectedRows.length > 0) &&
                            <Button
                                text="Get Campaign Links"
                                icon={faLink}
                                onClick={() => handleGetCampaignLinks(selectedRows[0].id)}
                            />
                        }
                    </>
                }
            </LowerCPRow>
        </LowerCPWrapper>
    )
}

export function makeActionMenu(primaryData: TPrimaryData, itemName: EItemName, id: number): TActionMenu | null {
    const { primaryItemName } = itemNameIsPrimary(itemName);
    if (!primaryItemName) return null;

    let actionMenu: TActionMenu | null = null;
    const item = getPrimaryItemById(primaryData, primaryItemName, id);

    if (item?.primaryItemName === EItemName.AFFILIATE_NETWORK) {
        actionMenu = {
            type: item?.primaryItemName,
            itemName: item?.primaryItemName,
            id: item?.id,
            name: item?.name,
            defaultNewOfferString: item?.defaultNewOfferString,
            tags: item?.tags,
        };
    } else if (item?.primaryItemName === EItemName.CAMPAIGN) {
        actionMenu = {
            type: item?.primaryItemName,
            itemName: item?.primaryItemName,
            id: item?.id,
            name: item?.name,
            landingPageRotationType: item?.landingPageRotationType,
            offerRotationType: item?.offerRotationType,
            geoName: item?.geoName,
            tags: item?.tags,
            trafficSourceId: item?.trafficSourceId,
            flowType: item?.flowType,
            savedFlowId: item?.savedFlowId ?? undefined,
            flowUrl: item?.flowUrl ?? undefined,
            flowMainRoute: item?.flowMainRoute ?? undefined,
            flowRuleRoutes: item?.flowRuleRoutes ?? undefined,
        };
    } else if (item?.primaryItemName === EItemName.FLOW) {
        actionMenu = {
            type: item?.primaryItemName,
            itemName: item?.primaryItemName,
            id: item?.id,
            name: item?.name ?? undefined,
            mainRoute: item?.mainRoute ?? undefined,
            ruleRoutes: item?.ruleRoutes ?? undefined,
            tags: item?.tags ?? undefined,
        };
    } else if (item?.primaryItemName === EItemName.LANDING_PAGE) {
        actionMenu = {
            type: item?.primaryItemName,
            itemName: item?.primaryItemName,
            id: item?.id,
            name: item?.name,
            url: item?.url,
            tags: item?.tags,
        };
    } else if (item?.primaryItemName === EItemName.OFFER) {
        actionMenu = {
            type: item?.primaryItemName,
            itemName: item?.primaryItemName,
            id: item?.id,
            name: item?.name,
            payout: item?.payout,
            url: item?.url,
            tags: item?.tags,
            affiliateNetworkId: item?.affiliateNetworkId,
        };
    } else if (item?.primaryItemName === EItemName.TRAFFIC_SOURCE) {
        actionMenu = {
            type: item?.primaryItemName,
            itemName: item?.primaryItemName,
            id: item?.id,
            name: item?.name,
            externalIdToken: item?.externalIdToken,
            costToken: item?.costToken,
            customTokens: item?.customTokens,
            postbackUrl: item?.postbackUrl,
            tags: item?.tags,
        };
    }
    return actionMenu;
}
