"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { faCheckCircle, faDotCircle, faSpinner, faTrash, faXmarkCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useReportView } from "../../ReportViewContext";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import Button from "@/components/Button";
import {
    deleteAffiliateNetworkAction, deleteCampaignAction, deleteFlowAction,
    deleteLandingPageAction, deleteOfferAction, deleteTrafficSourceAction,
    revalidatePathAction
} from "@/lib/actions";
import { formatErr, getPrimaryItemById, itemNameToKeyOfPrimaryData } from "@/lib/utils";
import { TActionMenu, TDeleteItemsActionMenu } from "../types";
import {
    EItemName, TAffiliateNetwork, TCampaign, TLandingPage,
    TOffer, TPrimaryItemName, TSavedFlow, TTrafficSource
} from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TDeletionStatus = "idle" | "pending" | "success" | "failed";

type TDeletionItem = {
    data: TAffiliateNetwork | TCampaign | TSavedFlow | TLandingPage | TOffer | TTrafficSource;
    status: TDeletionStatus;
    error: string;
};

export default function DeleteItemBody({ actionMenu, setActionMenu }: {
    actionMenu: TDeleteItemsActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const { primaryItemName, ids } = actionMenu;
    const { primaryData } = useReportView();

    const [disabled, setDisabled] = useState<boolean>(false);

    const key = itemNameToKeyOfPrimaryData(primaryItemName);
    const [deletionItems, setDeletionItems] = useState<TDeletionItem[]>(
        ids
            .map(id => getPrimaryItemById(primaryData, key, id))
            .filter(item => !!item)
            .map(data => ({
                data,
                status: "idle",
                error: "",
            }))
    );

    async function handleDelete() {
        if (disabled) return;
        setDisabled(true);

        let deletedIds: number[] = [];
        let errCount = 0;

        for (const deletionItem of deletionItems) {
            const { id } = deletionItem.data;
            try {
                setDeletionItems(prev => prev.map(delItem => delItem.data.id === id ? { ...delItem, status: "pending" } : delItem));
                await deleteItemMap[primaryItemName](id);
                deletedIds.push(id);
                setDeletionItems(prev => prev.map(delItem => delItem.data.id === id ? { ...delItem, status: "success" } : delItem));
                revalidatePathAction(window.location.href);
            } catch (err) {
                errCount++;
                setDeletionItems(prev => prev.map(delItem => delItem.data.id === id ? { ...delItem, status: "failed", error: formatErr(err) } : delItem));
            }
        }

        setDeletionItems(prev => prev.filter((delItem => !deletedIds.includes(delItem.data.id))));
        setDisabled(false);

        if (deletedIds.length > 0) toast.success(`Deleted ${deletedIds.length} item(s)`);

        // Close the action menu only if ALL items were deleted with no errors
        if (deletedIds.length === deletionItems.length && errCount === 0) setActionMenu(null);
    }

    return (
        <ActionMenuBodyWrapper>
            <div className="flex flex-col gap-4 w-full p-2">
                <span>Are you sure you want to delete these items?</span>
                {deletionItems.map(({ data, status }, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <FontAwesomeIcon icon={statusToIcon(status)} />
                        <span>{data.name}</span>
                    </div>
                ))}
                <Button
                    text="Yes"
                    icon={disabled ? faSpinner : faTrash}
                    disabled={disabled}
                    onClick={handleDelete}
                />
            </div>
        </ActionMenuBodyWrapper>
    )
}

type TDeleteItemFunc = (id: number, pathname?: string) => Promise<Object>;

const deleteItemMap: Record<TPrimaryItemName, TDeleteItemFunc> = {
    [EItemName.AFFILIATE_NETWORK]: deleteAffiliateNetworkAction as TDeleteItemFunc,
    [EItemName.CAMPAIGN]: deleteCampaignAction as TDeleteItemFunc,
    [EItemName.FLOW]: deleteFlowAction as TDeleteItemFunc,
    [EItemName.LANDING_PAGE]: deleteLandingPageAction as TDeleteItemFunc,
    [EItemName.OFFER]: deleteOfferAction as TDeleteItemFunc,
    [EItemName.TRAFFIC_SOURCE]: deleteTrafficSourceAction as TDeleteItemFunc,
};

function statusToIcon(status: TDeletionStatus): IconDefinition {
    switch (status) {
        case "pending":
            return faSpinner;
        case "success":
            return faCheckCircle;
        case "failed":
            return faXmarkCircle;
        default:
            return faDotCircle;
    }
}
