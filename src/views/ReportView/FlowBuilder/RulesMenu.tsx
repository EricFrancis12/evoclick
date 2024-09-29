"use client";

import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import { Select } from "@/components/base";
import Rule from "./Rule";
import { newRule } from "@/lib/utils/new";
import { TRoute, ELogicalRelation, ERuleName, TToken } from "@/lib/types";
import { CUSTOM_RULE_, toCustomRuleName } from "@/lib/utils";

export default function RulesMenu({ route, onChange, tokens = [] }: {
    route: TRoute;
    onChange: (r: TRoute) => void;
    tokens?: TToken[];
}) {
    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const ruleName = (Object.values(ERuleName) as string[]).includes(e.target.value)
            ? e.target.value as ERuleName
            : toCustomRuleName(e.target.value);

        onChange({ ...route, rules: [...route.rules, newRule(ruleName)] });
    }

    return (
        <div
            className="flex flex-col justify-start items-between h-full w-full max-h-[90vh] max-w-[700px] bg-white"
            style={{ borderRadius: "5px" }}
        >
            <div
                className="flex flex-col justify-start items-start gap-2 px-4 overflow-y-scroll"
                style={{ height: "inherit" }}
            >
                <div className="flex justify-start items-center w-full">
                    <span>Logical Relation</span>
                </div>
                <div className="flex justify-start items-center gap-2 w-full">
                    {Object.values(ELogicalRelation).map((logicalRelation, index) => (
                        <div key={index} className="flex justify-start items-center">
                            <input
                                type="checkbox"
                                checked={logicalRelation === route.logicalRelation}
                                onChange={() => onChange({ ...route, logicalRelation })}
                            />
                            <span>{logicalRelation}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-start items-center gap-2 w-full">
                    <Select
                        value=""
                        onChange={handleSelectChange}
                    >
                        <option value="">Add New Rule</option>
                        {[...Object.values(ERuleName), ...tokens.map(({ queryParam }) => queryParam)]
                            .filter(ruleName => !route.rules.some(rule => rule.ruleName === ruleName || rule.ruleName === toCustomRuleName(ruleName)))
                            .map((ruleName, index) => (
                                <option key={index} value={ruleName}>
                                    {ruleName}
                                </option>
                            ))}
                    </Select>
                    <Button
                        text="Remove All Rules"
                        icon={faTrashAlt}
                        onClick={() => onChange({ ...route, rules: [] })}
                    />
                </div>
                <div
                    className="flex flex-col justify-start items-center gap-2 p-2 w-full"
                    style={{ border: "solid 1px grey" }}
                >
                    {route.rules.map((rule, index) => (
                        <Rule
                            key={index}
                            rule={rule}
                            onChange={newRule => onChange({
                                ...route,
                                rules: route.rules.map((r, i) => i === index ? newRule : r),
                            })}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
