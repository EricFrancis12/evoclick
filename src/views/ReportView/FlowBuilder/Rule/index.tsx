"use client";

import UserInputRuleLayout, { userInputRules } from "./UserInputRuleLayout";
import CheckboxesRuleLayout, { checkboxesRules } from "./CheckboxesRuleLayout";
import { TRule } from "@/lib/types";
import { isCustomRuleName } from "@/lib/utils";

export default function Rule(props: {
    rule: TRule;
    onChange: (r: TRule) => void;
}) {
    const { ruleName } = props.rule;
    if ((userInputRules as string[]).includes(ruleName) || isCustomRuleName(ruleName).ok) {
        return <UserInputRuleLayout {...props} />;
    } else if ((checkboxesRules as string[]).includes(ruleName)) {
        return <CheckboxesRuleLayout {...props} />;
    }
    return "";
}
