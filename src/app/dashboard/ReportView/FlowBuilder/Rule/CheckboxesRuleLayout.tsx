"use client";

import BooleanCheckboxesToggle from "@/components/BooleanCheckboxesToggle";
import CheckboxesInput from "@/components/CheckboxesInput";
import RuleLayoutWrapper from "./RuleLayoutWrapper";
import { EBrowserName, EDeviceType, ERuleName, TRule } from "@/lib/types";

export const checkboxesRules: ERuleName[] = [
    ERuleName.DEVICE_TYPE,
    ERuleName.BROWSER_NAME,
];

export default function CheckboxesRuleLayout({ rule, onChange }: {
    rule: TRule;
    onChange: (ru: TRule) => void;
}) {
    return (
        <RuleLayoutWrapper title={rule.ruleName}>
            <BooleanCheckboxesToggle
                items={["Include", "Exclude"]}
                value={rule.includes}
                onChange={includes => onChange({ ...rule, includes })}
            />
            <CheckboxesInput
                className="mx-4"
                items={checkboxItems(rule.ruleName)}
                value={rule.data}
                onChange={data => onChange({ ...rule, data })}
            />
        </RuleLayoutWrapper>
    )
}

function checkboxItems(ruleName: ERuleName): string[] {
    switch (ruleName) {
        case ERuleName.DEVICE_TYPE:
            return Object.values(EDeviceType);
        case ERuleName.BROWSER_NAME:
            return Object.values(EBrowserName);
        default:
            return [];
    }
}
