"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PopoverContainer, PopoverFooter, PopoverLayer } from "@/components/popover";
import Button from "@/components/Button";
import RulesMenu from "./RulesMenu";
import Path from "./Path";
import { newPath } from "@/lib/utils/new";
import { TRoute } from "@/lib/types";

export type TReorderDirection = "up" | "down";

export default function Route({ type, route, onChange, onDelete, onReorder = () => { } }: {
    type: "main" | "rule";
    route: TRoute;
    onChange: (r: TRoute) => void;
    onDelete?: () => void;
    onReorder?: (dir: TReorderDirection) => void;
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
            {type === "rule" && rulesMenuOpen &&
                <PopoverLayer layer={3}>
                    <PopoverContainer>
                        <RulesMenu
                            route={route}
                            onChange={onChange}
                        />
                        <PopoverFooter>
                            <Button text="Done" onClick={() => setRulesMenuOpen(false)} />
                        </PopoverFooter>
                    </PopoverContainer>
                </PopoverLayer>
            }
        </>
    )
}
