"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createNewTrafficSourceAction, updateTrafficSourceAction } from "@/lib/actions";
import { PopoverContainer, PopoverFooter, PopoverLayer } from "@/components/popover";
import Button from "@/components/Button";
import TagsInput from "@/components/TagsInput";
import { Input } from "@/components/base";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import ActionMenuFooter from "../ActionMenuFooter";
import TokenInputWrapper from "../../TokenInput/TokenInputWrapper";
import TokenInput from "../../TokenInput";
import { newToken, newNamedToken } from "@/lib/utils/new";
import { TActionMenu, TTrafficSourceActionMenu } from "../types";
import { EItemName, TNamedToken } from "@/lib/types";

export default function TrafficSourceBody({ actionMenu, setActionMenu }: {
    actionMenu: TTrafficSourceActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
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
            <Button
                text="Edit Tokens"
                onClick={() => setTokensMenuOpen(true)}
            />
            <TagsInput
                title="Tags"
                placeholder="Type to add tags"
                tags={actionMenu.tags || []}
                setTags={tags => setActionMenu({ ...actionMenu, tags })}
            />
            <ActionMenuFooter onSave={handleSave} />
            {tokensMenuOpen &&
                <PopoverLayer layer={2}>
                    <PopoverContainer>
                        <TokenInputWrapper
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
                        </TokenInputWrapper>
                        <PopoverFooter>
                            <Button
                                text="Done"
                                onClick={() => setTokensMenuOpen(false)}
                            />
                        </PopoverFooter>
                    </PopoverContainer>
                </PopoverLayer>
            }
        </ActionMenuBodyWrapper>
    )
}
