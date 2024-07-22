"use client";

import BooleanCheckboxesToggle from "@/components/BooleanCheckboxesToggle";
import TagsInput from "@/components/TagsInput";
import RuleLayoutWrapper from "./RuleLayoutWrapper";
import { ERuleName, TRule } from "@/lib/types";

export const userInputRules: ERuleName[] = [
    ERuleName.BROWSER_VERSION,
    ERuleName.CITY,
    ERuleName.COUNTRY,
    ERuleName.DEVICE,
    ERuleName.IP,
    ERuleName.ISP,
    ERuleName.LANGUAGE,
    ERuleName.OS,
    ERuleName.OS_VERSION,
    ERuleName.REGION,
    ERuleName.SCREEN_RESOLUTION,
    ERuleName.USER_AGENT,
];

const includeExclude: [str: string, str: string] = ["Include", "Exclude"];

export default function UserInputRuleLayout({ rule, onChange }: {
    rule: TRule;
    onChange: (ru: TRule) => void;
}) {
    return (
        <RuleLayoutWrapper title={rule.ruleName}>
            <BooleanCheckboxesToggle
                values={includeExclude}
                value={rule.includes}
                onChange={includes => onChange({ ...rule, includes })}
            />
            <TagsInput
                placeholder="Type to add items"
                tags={rule.data}
                setTags={data => onChange({ ...rule, data })}
            />
        </RuleLayoutWrapper>
    )
}
