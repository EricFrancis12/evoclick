"use client";

import UserInputRuleLayout, { userInputRules } from "./UserInputRuleLayout";
import CheckboxesRuleLayout, { checkboxesRules } from "./CheckboxesRuleLayout";
import { ERuleName, TRule } from "@/lib/types";

export default function Rule(props: {
    rule: TRule;
    onChange: (ru: TRule) => void;
}) {
    const { ruleName } = props.rule;
    if (userInputRules.includes(ruleName)) {
        return <UserInputRuleLayout {...props} />;
    } else if (checkboxesRules.includes(ruleName)) {
        return <CheckboxesRuleLayout {...props} />;
    }
    return "";
}
