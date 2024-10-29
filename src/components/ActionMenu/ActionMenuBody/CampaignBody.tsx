"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createNewCampaignAction, getAllFlowsAction, getAllTrafficSourcesAction, updateCampaignAction } from "@/lib/actions";
import { PopoverContainer, PopoverFooter, PopoverLayer } from "@/components/popover";
import FlowBuilder from "../../../views/ReportView/FlowBuilder";
import Button from "@/components/Button";
import TagsInput from "@/components/TagsInput";
import { Input, Select, SelectionButtons } from "@/components/base";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import ActionMenuFooter from "../ActionMenuFooter";
import { newRoute } from "@/lib/utils/new";
import { TActionMenu, TCampaignActionMenu } from "../types";
import { TSavedFlow, TToken, TTrafficSource } from "@/lib/types";
import { $Enums } from "@prisma/client";

function useTrafficSourceTokens(trafficSources: TTrafficSource[], trafficSourceId?: number): TToken[] {
    const [tokens, setTokens] = useState<TToken[]>([]);

    useEffect(() => {
        const trafficSource = trafficSources.find(({ id }) => id === trafficSourceId);
        if (trafficSource) {
            setTokens(trafficSource.customTokens);
        }
    }, [trafficSourceId, trafficSources, trafficSources.length]);

    return tokens;
}

export default function CampaignBody({ actionMenu, setActionMenu }: {
    actionMenu: TCampaignActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const [savedFlows, setSavedFlows] = useState<TSavedFlow[]>([]);
    const [trafficSources, setTrafficSources] = useState<TTrafficSource[]>([]);

    const [flowBuilderOpen, setFlowBuilderOpen] = useState<boolean>(false);

    const tokens = useTrafficSourceTokens(trafficSources, actionMenu.trafficSourceId);

    useEffect(() => {
        getAllTrafficSourcesAction()
            .then(_trafficSources => setTrafficSources(_trafficSources))
            .catch(() => toast.error("Error fetching Traffic Sources"));

        getAllFlowsAction()
            .then(_savedFlows => setSavedFlows(_savedFlows))
            .catch(() => toast.error("Error fetching Flows"));
    }, []);

    async function handleSave() {
        if (!actionMenu.trafficSourceId) {
            toast.error("A Traffic Source is required");
            return;
        };
        if (!actionMenu.flowType) {
            toast.error("A flow type is required");
            return;
        };

        try {
            const {
                id, name, landingPageRotationType, offerRotationType, geoName, tags, trafficSourceId,
                flowType, savedFlowId, flowUrl, flowMainRoute, flowRuleRoutes
            } = actionMenu;
            if (typeof id === "number") {
                await updateCampaignAction(id, {
                    name,
                    landingPageRotationType,
                    offerRotationType,
                    geoName,
                    tags,
                    trafficSourceId,
                    flowType,
                    savedFlowId,
                    flowUrl,
                    flowMainRoute,
                    flowRuleRoutes,
                }, window.location.href);
                toast.success("Campaign was updated successfully");
            } else if (trafficSourceId !== undefined) {
                await createNewCampaignAction({
                    name: name ?? "",
                    landingPageRotationType: landingPageRotationType ?? $Enums.RotationType.RANDOM,
                    offerRotationType: offerRotationType ?? $Enums.RotationType.RANDOM,
                    geoName: geoName ?? $Enums.GeoName.NONE,
                    tags: tags ?? [],
                    trafficSourceId,
                    flowType,
                    savedFlowId: savedFlowId ?? null,
                    flowUrl: flowUrl ?? null,
                    flowMainRoute: flowMainRoute ?? null,
                    flowRuleRoutes: flowRuleRoutes ?? null,
                }, window.location.href);
                toast.success("Successfully created new Campaign");
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
                value={actionMenu.flowType || ""}
                onClick={flowType => setActionMenu({
                    ...actionMenu,
                    flowType: flowType as $Enums.FlowType,
                })}
            >
                {actionMenu.flowType === "SAVED" &&
                    <Select
                        name="Saved Flows"
                        value={actionMenu.savedFlowId}
                        onChange={e => setActionMenu({
                            ...actionMenu,
                            savedFlowId: Number(e.target.value),
                        })}
                    >
                        <option value="">None</option>
                        {savedFlows.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </Select>
                }
                {actionMenu.flowType === "BUILT_IN" &&
                    <Button
                        text="Edit Built-In Flow"
                        onClick={() => setFlowBuilderOpen(true)}
                    />
                }
                {actionMenu.flowType === "URL" &&
                    <Input
                        name="URL"
                        value={actionMenu.flowUrl || ""}
                        onChange={e => setActionMenu({
                            ...actionMenu,
                            flowUrl: e.target.value,
                        })}
                    />
                }
            </SelectionButtons>
            <TagsInput
                title="Tags"
                placeholder="Type to add tags"
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
            <ActionMenuFooter onSave={handleSave} />
            {flowBuilderOpen &&
                <PopoverLayer layer={2}>
                    <PopoverContainer>
                        <FlowBuilder
                            value={{
                                mainRoute: actionMenu.flowMainRoute || newRoute(),
                                ruleRoutes: actionMenu.flowRuleRoutes || [],
                            }}
                            onChange={({ mainRoute, ruleRoutes }) => setActionMenu({
                                ...actionMenu,
                                flowMainRoute: mainRoute,
                                flowRuleRoutes: ruleRoutes,
                            })}
                            tokens={tokens}
                        />
                        <PopoverFooter>
                            <Button
                                text="Done"
                                onClick={() => setFlowBuilderOpen(false)}
                            />
                        </PopoverFooter>
                    </PopoverContainer>
                </PopoverLayer>
            }
        </ActionMenuBodyWrapper>
    )
}
