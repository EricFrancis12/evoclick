"use client";

import BooleanCheckboxesToggle from "@/components/BooleanCheckboxesToggle";
import TagsInput from "@/components/TagsInput";
import RuleLayoutWrapper from "./RuleLayoutWrapper";
import { ERuleName, TRule } from "@/lib/types";
import { CUSTOM_RULE_ } from "@/lib/utils";

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
    onChange: (r: TRule) => void;
}) {
    return (
        <RuleLayoutWrapper title={fmtIfCustomRuleName(rule.ruleName)}>
            <BooleanCheckboxesToggle
                textValues={includeExclude}
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

function fmtIfCustomRuleName(str: string): string {
    if (str.substring(0, CUSTOM_RULE_.length) === CUSTOM_RULE_) {
        return str.substring(CUSTOM_RULE_.length) + " (Custom Rule)";
    }
    return str;
}
