"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import { TRoute, ELogicalRelation } from "@/lib/types";

type TFlowBuilder = {
    mainRoute: TRoute;
    ruleRoutes: TRoute[];
};

export default function FlowBuilder({ value, onChange }: {
    value: TFlowBuilder;
    onChange: (fb: TFlowBuilder) => any;
}) {
    const { mainRoute, ruleRoutes } = value;

    return (
        <>
            <Route
                route={mainRoute}
                onChange={route => onChange({ ...value, mainRoute: route })}
            />
            {value.ruleRoutes.map((route, index) => (
                <Route
                    key={index}
                    route={route}
                    onChange={route => onChange({
                        ...value,
                        ruleRoutes: ruleRoutes.map((r, i) => i === index ? route : r),
                    })}
                />
            ))}
            <Button
                text="Add New Route"
                icon={faPlus}
                onClick={() => onChange({
                    ...value,
                    ruleRoutes: [...ruleRoutes, newRoute()],
                })}
            />
        </>
    )
}

function Route({ route, onChange }: {
    route: TRoute;
    onChange: (r: TRoute) => any;
}) {
    // TODO: ...

    return (
        <div>
            Route
        </div>
    )
}

function Rules() {
    // TODO: ...

    return (
        <div>
            Rules
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
