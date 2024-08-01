"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useDataContext } from "@/contexts/DataContext";
import Section, { TSection } from "./Section";
import { EItemName, TPath, TRoute } from "@/lib/types";

export default function Path({ path, route, onChange, onDelete }: {
    path: TPath;
    route: TRoute;
    onChange: (p: TPath) => void;
    onDelete: () => void;
}) {
    const { primaryData } = useDataContext();

    const sections: TSection[] = [
        {
            itemName: EItemName.LANDING_PAGE,
            options: primaryData[EItemName.LANDING_PAGE],
        },
        {
            itemName: EItemName.OFFER,
            options: primaryData[EItemName.OFFER],
        },
    ];

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
                            <input
                                className="w-[40px] p-1"
                                style={{ borderRadius: "6px" }}
                                value={path.weight}
                                onChange={e => onChange({ ...path, weight: Number(e.target.value) || 0 })}
                            />
                        </div>
                    }
                    <div className="flex justify-center items-center gap-2">
                        {path.isActive &&
                            <>
                                <span>
                                    {calcWeight(path.weight, route.paths.map(p => p.weight))}
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
            {path.isActive && sections.map((section, index) => (
                <Section key={index} section={section} path={path} onChange={onChange} />
            ))}
        </div>
    )
}

function calcWeight(weight: number, weights: number[]): number {
    const total = weights.reduce((sum, num) => sum + num, 0);
    return weight / total;
}
