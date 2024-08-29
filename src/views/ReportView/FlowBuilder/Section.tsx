"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink, faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PopoverLayer } from "@/components/popover";
import { Select } from "@/components/base";
import ActionMenu from "../ActionMenu";
import { TActionMenu } from "../ActionMenu/types";
import { newPrimaryItemActionMenu } from "@/lib/utils/new";
import { EItemName, TLandingPage, TOffer, TPath } from "@/lib/types";

// A section represents either the list of landing pages,
// or the list of offers contained within the path
export type TSection = {
    itemName: EItemName.LANDING_PAGE;
    options: TLandingPage[];
} | {
    itemName: EItemName.OFFER;
    options: TOffer[];
};

export default function Section({ section, path, onChange }: {
    section: TSection;
    path: TPath;
    onChange: (p: TPath) => void;
}) {
    const { itemName, options } = section;
    const items = makeItems(
        section.itemName === EItemName.LANDING_PAGE ? path.landingPageIds : path.offerIds,
        section
    );

    const [outerActionMenu, setOuterActionMenu] = useState<TActionMenu | null>(null);

    function handleAddNew(id: number) {
        if (itemName === EItemName.LANDING_PAGE) {
            onChange({ ...path, landingPageIds: [...path.landingPageIds, id] });
        } else if (itemName === EItemName.OFFER) {
            onChange({ ...path, offerIds: [...path.offerIds, id] });
        }
    }

    function handleDelete(index: number) {
        if (itemName === EItemName.LANDING_PAGE) {
            onChange({ ...path, landingPageIds: path.landingPageIds.filter((_, i) => i !== index) });
        } else if (itemName === EItemName.OFFER) {
            onChange({ ...path, offerIds: path.offerIds.filter((_, i) => i !== index) });
        }
    }

    return (
        <>
            <div className="my-2">
                <div className="relative flex justify-between items-center bg-white h-[40px] my-1 px-2">
                    <div className="flex justify-between items-center gap-2 w-full">
                        <span
                            className={itemName === EItemName.LANDING_PAGE && path.directLinkingEnabled ? "line-through" : ""}
                            style={{ whiteSpace: "nowrap" }}
                        >
                            {itemName}
                        </span>
                        {itemName === EItemName.LANDING_PAGE &&
                            <input
                                type="checkbox"
                                checked={!path.directLinkingEnabled}
                                onChange={() => onChange({ ...path, directLinkingEnabled: !path.directLinkingEnabled })}
                            />
                        }
                    </div>
                </div>
                {itemName === EItemName.LANDING_PAGE && path.directLinkingEnabled
                    ? <div className="flex justify-center items-center bg-white h-[40px] my-1 px-2">
                        <span>
                            Direct Linking Enabled
                        </span>
                    </div>
                    : <>
                        <div className="flex flex-col justify-center items-center min-h-[40px] bg-white">
                            {items.length === 0
                                ? <span className="text-xs">
                                    {`No ${itemName} Added`}
                                </span>
                                : items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center gap-2 bg-white h-[40px] w-full my-1 px-2"
                                    >
                                        <div className="flex justify-start items-center gap-2">
                                            <span>{index + 1}</span>
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="flex justify-end items-center gap-1">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <FontAwesomeIcon icon={faExternalLink} />
                                            </a>
                                            <FontAwesomeIcon
                                                icon={faPencilAlt}
                                                className="cursor-pointer"
                                                onClick={() => setOuterActionMenu({
                                                    ...newPrimaryItemActionMenu(itemName),
                                                    ...item
                                                })}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                className="cursor-pointer hover:text-red-500"
                                                onClick={() => handleDelete(index)} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="flex justify-between items-center bg-white h-[40px] my-1">
                            <div
                                onClick={() => setOuterActionMenu(newPrimaryItemActionMenu(itemName))}
                                className="flex justify-center items-center h-full w-[50%] px-2 cursor-pointer"
                                style={{ borderRight: "solid 1px grey" }}
                            >
                                <span>{"Create New " + itemName}</span>
                            </div>
                            <div
                                className="flex justify-center items-center h-full w-[50%] px-2 cursor-pointer"
                                style={{ borderLeft: "solid 1px grey" }}
                            >
                                <Select value="" onChange={e => handleAddNew(Number(e.target.value))}>
                                    <option value="">{"+ New " + itemName}</option>
                                    {options.map(({ id, name }) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </>
                }
            </div>
            {outerActionMenu &&
                <PopoverLayer layer={4}>
                    <ActionMenu actionMenu={outerActionMenu} setActionMenu={setOuterActionMenu} />
                </PopoverLayer>
            }
        </>
    )
}

function makeItems(ids: number[], section: TSection) {
    const result = [];
    for (const id of ids) {
        const item = section.options.find(option => option.id === id);
        if (item) result.push(item);
    }
    return result;
}
