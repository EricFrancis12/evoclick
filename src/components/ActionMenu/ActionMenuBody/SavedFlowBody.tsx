"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createNewFlowAction, updateFlowAction } from "@/lib/actions";
import { PopoverContainer, PopoverFooter, PopoverLayer } from "@/components/popover";
import Button from "@/components/Button";
import TagsInput from "@/components/TagsInput";
import FlowBuilder from "../../../views/ReportView/FlowBuilder";
import { Input } from "@/components/base";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import ActionMenuFooter from "../ActionMenuFooter";
import { newRoute } from "@/lib/utils/new";
import { TActionMenu, TSavedFlowActionMenu } from "../types";

export default function SavedFlowBody({ actionMenu, setActionMenu }: {
    actionMenu: TSavedFlowActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
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
                    mainRoute: mainRoute ?? newRoute(),
                    ruleRoutes: ruleRoutes ?? [],
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
            <Button
                text="Edit Flow"
                onClick={() => setFlowBuilderOpen(true)}
            />
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
                                mainRoute: actionMenu.mainRoute || newRoute(),
                                ruleRoutes: actionMenu.ruleRoutes || [],
                            }}
                            onChange={({ mainRoute, ruleRoutes }) => setActionMenu({ ...actionMenu, mainRoute, ruleRoutes })}
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
