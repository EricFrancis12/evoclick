"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import Route, { TReorderDirection } from "./Route";
import { newRoute } from "@/lib/utils/new";
import { TRoute, TToken } from "@/lib/types";

export type TFlowBuilder = {
    mainRoute: TRoute;
    ruleRoutes: TRoute[];
};

export default function FlowBuilder({ value, onChange, tokens = [] }: {
    value: TFlowBuilder;
    onChange: (fb: TFlowBuilder) => void;
    tokens?: TToken[];
}) {
    const { mainRoute, ruleRoutes } = value;

    function handleReorder(direc: TReorderDirection, index: number) {
        if (!isValidIndex(ruleRoutes, index)) return;

        const newIndex = direc === "up" ? index - 1 : index + 1;
        if (!isValidIndex(ruleRoutes, newIndex)) return;

        const newRuleRoutes = structuredClone(ruleRoutes);
        const [rule] = newRuleRoutes.splice(index, 1);
        if (!rule) return;

        newRuleRoutes.splice(newIndex, 0, rule);

        onChange({ ...value, ruleRoutes: newRuleRoutes });
    }

    return (
        <div className="flex flex-col gap-2">
            <Route
                type="main"
                route={mainRoute}
                onChange={mainRoute => onChange({ ...value, mainRoute })}
            />
            {ruleRoutes.map((route, index) => (
                <Route
                    key={index}
                    type="rule"
                    route={route}
                    onChange={route => onChange({
                        ...value,
                        ruleRoutes: ruleRoutes.map((r, i) => i === index ? route : r),
                    })}
                    onDelete={() => onChange({
                        ...value,
                        ruleRoutes: ruleRoutes.filter((_, i) => i !== index),
                    })}
                    onReorder={dir => handleReorder(dir, index)}
                    tokens={tokens}
                />
            ))}
            <Button
                text="Add New Rule"
                icon={faPlus}
                onClick={() => onChange({ ...value, ruleRoutes: [...value.ruleRoutes, newRoute()] })}
            />
        </div>
    )
}

function isValidIndex(arr: unknown[], index: number): boolean {
    return index > 0 && index < arr.length;
}
