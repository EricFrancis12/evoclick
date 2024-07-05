"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faExternalLink, faPencilAlt, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PopoverLayer } from "../ReportViewContext";
import Button from "@/components/Button";
import { TRoute, ELogicalRelation, TPath, EItemName } from "@/lib/types";

type TFlowBuilder = {
    mainRoute: TRoute;
    ruleRoutes: TRoute[];
};

export default function FlowBuilder({ value, onChange }: {
    value: TFlowBuilder;
    onChange: (fb: TFlowBuilder) => any;
}) {
    const { mainRoute, ruleRoutes } = value;
    const [rulesMenuOpen, setRulesMenuOpen] = useState<boolean>(false);

    function handleReorder(dir: TReorderDirection, index: number) {
        if (!ruleRoutes[index]) return;

        const clone = structuredClone(ruleRoutes);
        const rule = clone.splice(index, 1)[0];

        if (dir === "up" && ruleRoutes[index - 1]) {
            clone.splice(index - 1, 0, rule);
            onChange({ ...value, ruleRoutes: clone });
        } else if (dir === "down" && ruleRoutes[index + 1]) {
            clone.splice(index + 1, 0, rule);
            onChange({ ...value, ruleRoutes: clone });
        }
    }

    return (
        <>
            <Route
                type="main"
                route={mainRoute}
                onChange={route => onChange({ ...value, mainRoute: route })}
            />
            {ruleRoutes.map((route, index) => (
                <Route
                    type="rule"
                    key={index}
                    route={route}
                    onChange={route => onChange({
                        ...value,
                        ruleRoutes: ruleRoutes.map((r, i) => i === index ? route : r),
                    })}
                    onDelete={() => onChange({ ...value, ruleRoutes: ruleRoutes.filter((_, i) => i !== index) })}
                    onReorder={dir => handleReorder(dir, index)}
                />
            ))}
            <Button
                text="Add New Rule"
                icon={faPlus}
                onClick={() => setRulesMenuOpen(true)}
            />
            {rulesMenuOpen &&
                <PopoverLayer layer={3}>
                    <div className="px-6 py-4 bg-white border">
                        <RulesMenu
                            route={mainRoute}
                            onChange={route => onChange({
                                ...value,
                                mainRoute: route,
                            })}
                        />
                        <div
                            className="flex justify-center items-center w-full mt-6 px-2 py-4"
                            style={{ borderTop: "solid 1px #cfcfcf" }}
                        >
                            <Button text="Done" onClick={() => setRulesMenuOpen(false)} />
                        </div>
                    </div>
                </PopoverLayer>
            }
        </>
    )
}

function RulesMenu({ route, onChange }: {
    route: TRoute;
    onChange: (r: TRoute) => any;
}) {
    return (
        <div>
            RulesMenu
        </div>
    )
}

type TReorderDirection = "up" | "down";

function Route({ type, route, onChange, onDelete, onReorder = () => { } }: {
    type: "main" | "rule";
    route: TRoute;
    onChange: (r: TRoute) => any;
    onDelete?: () => any;
    onReorder?: (dir: TReorderDirection) => any;
}) {
    const [rulesMenuOpen, setRulesMenuOpen] = useState<boolean>(false);

    return (
        <>
            <div
                className="flex flex-col justify-start items-start gap-2 w-full px-2 py-1"
                style={{
                    border: "solid 1px grey",
                    borderRadius: "5px"
                }}
            >
                <div className="flex justify-between items-center p-2 w-full">
                    <div className="flex justify-start items-center">
                        <span className={type === "rule" && !route.isActive ? "line-through" : ""}>
                            {type + " route"}
                        </span>
                    </div>
                    <div className="flex justify-end items-center gap-2 p-2">
                        {type === "rule" &&
                            <>
                                <FontAwesomeIcon icon={faPencilAlt} className="cursor-pointer" onClick={() => setRulesMenuOpen(prev => !prev)} />
                                <FontAwesomeIcon icon={faChevronUp} className="cursor-pointer" onClick={() => onReorder("up")} />
                                <FontAwesomeIcon icon={faChevronDown} className="cursor-pointer" onClick={() => onReorder("down")} />
                                <FontAwesomeIcon icon={faTrashAlt} className="cursor-pointer" onClick={onDelete} />
                                <input
                                    type="checkbox"
                                    checked={route.isActive}
                                    onChange={() => onChange({ ...route, isActive: !route.isActive })}
                                />
                            </>
                        }
                    </div>
                </div>
                {(type === "main" || (type === "rule" && route.isActive)) &&
                    <>
                        {route.paths.map((path, index) => (
                            <Path
                                key={index}
                                path={path}
                                route={route}
                                onChange={newPath => onChange({
                                    ...route,
                                    paths: route.paths.map((p, i) => i === index ? newPath : p),
                                })}
                                onDelete={() => onChange({
                                    ...route,
                                    paths: route.paths.filter((_, i) => i !== index),
                                })}
                            />
                        ))}
                        <Button
                            text="Add Path"
                            onClick={() => onChange({ ...route, paths: [...route.paths, newPath()] })}
                        />
                    </>
                }
            </div>
            {rulesMenuOpen &&
                <PopoverLayer layer={3}>
                    <div className="px-6 py-4 bg-white border">
                        <RulesMenu
                            route={route}
                            onChange={onChange}
                        />
                        <div
                            className="flex justify-center items-center w-full mt-6 px-2 py-4"
                            style={{ borderTop: "solid 1px #cfcfcf" }}
                        >
                            <Button text="Done" onClick={() => setRulesMenuOpen(false)} />
                        </div>
                    </div>
                </PopoverLayer>
            }
        </>
    )
}

function newPath(): TPath {
    return {
        isActive: true,
        weight: 100,
        landingPageIds: [],
        offerIds: [],
        directLinkingEnabled: false,
    };
}

function Path({ path, route, onChange, onDelete }: {
    path: TPath;
    route: TRoute;
    onChange: (p: TPath) => any;
    onDelete: () => any;
}) {
    return (
        <div className="w-full bg-gray-300 px-2" style={{ borderRadius: "5px" }}>
            <div className="flex justify-between items-center py-3">
                <div className="flex justify-start items-center">
                    <span className={path.isActive ? "" : "line-through"}>
                        Path
                    </span>
                </div>
                <div className="flex justify-end items-center gap-2">
                    {path.isActive &&
                        <div className="flex justify-center items-center gap-2">
                            <span>
                                Weight:
                            </span>
                            <input className="w-[40px] p-1" style={{ borderRadius: "6px" }}
                                value={path.weight}
                                onChange={e => onChange({ ...path, weight: Number(e.target.value) || 0 })}
                            />
                        </div>
                    }
                    <div className="flex justify-center items-center gap-2">
                        {path.isActive &&
                            <>
                                <span>
                                    {calcWeightResult(path.weight, route.paths.map(p => p.weight))}
                                </span>
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="cursor-pointer text-black hover:text-red-500"
                                    onClick={onDelete}
                                />
                            </>
                        }
                        <input
                            type="checkbox"
                            checked={path.isActive}
                            onChange={() => onChange({ ...path, isActive: !path.isActive })}
                        />
                    </div>
                </div>
            </div>
            {path.isActive &&
                <>
                    <Section itemName={EItemName.LANDING_PAGE} path={path} onChange={onChange} />
                    <Section itemName={EItemName.OFFER} path={path} onChange={onChange} />
                </>
            }
        </div>
    )
}

function Section({ itemName, path, onChange }: {
    itemName: EItemName.LANDING_PAGE | EItemName.OFFER;
    path: TPath;
    onChange: (p: TPath) => any;
}) {
    const ids = itemName === EItemName.LANDING_PAGE ? path.landingPageIds : path.offerIds;

    function handleDelete(_id: number) {
        const newItems = ids.filter(id => id !== id);
        if (itemName === EItemName.LANDING_PAGE) {
            onChange({ ...path, landingPageIds: newItems });
        } else if (itemName === EItemName.OFFER) {
            onChange({ ...path, offerIds: newItems });
        }
    }

    return (
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
                        {ids.length === 0
                            ? <span className="text-xs">
                                {`No ${itemName} Added`}
                            </span>
                            : ids.map((id, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center gap-2 bg-white h-[40px] my-1 px-2"
                                >
                                    <div className="flex justify-start items-center gap-2">
                                        <span>
                                            {index + 1}
                                        </span>
                                        <WrappableSelect
                                        // array={section.options}
                                        // value={sectionData}
                                        // name={(a: TLandingPage | TOffer) => a.name}
                                        // matchBy={(a: TLandingPage | TOffer) => a._id}
                                        // onChange={(value: TSectionData) => handleItemChange(section.prop, sectionData, value)}
                                        />
                                    </div>
                                    <div className="flex justify-end items-center gap-1">
                                        <a
                                            href="https://bing.com?source=1"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FontAwesomeIcon icon={faExternalLink} />
                                        </a>
                                        <FontAwesomeIcon icon={faPencilAlt} className="cursor-pointer" />
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className="cursor-pointer hover:text-red-500"
                                            onClick={() => handleDelete(id)} />
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="flex justify-between items-center bg-white h-[40px] my-1 px-2">
                        <div
                            onClick={() => console.log("Create new")}
                            className="flex justify-center items-center h-full w-[50%] cursor-pointer"
                            style={{ borderRight: "solid 1px grey" }}
                        >
                            <span>
                                {"Create New " + itemName}
                            </span>
                        </div>
                        <div
                            onClick={() => console.log("+ New")}
                            className="flex justify-center items-center h-full w-[50%] cursor-pointer"
                            style={{ borderLeft: "solid 1px grey" }}
                        >
                            <span>
                                {"+ New " + itemName}
                            </span>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

function WrappableSelect() {
    // TODO: ...

    return (
        <div>
            WrappableSelect
        </div>
    )
}

export function newRoute(): TRoute {
    return {
        isActive: true,
        logicalRelation: ELogicalRelation.AND,
        paths: [],
        rules: [],
    };
}

function calcWeightResult(weight: number, weights: number[]): number {
    const total = weights.reduce((sum, num) => sum + num, 0);
    return weight / total;
}
