"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faExternalLink, faPencilAlt, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PopoverLayer } from "../ReportViewContext";
import TagsInput from "@/components/TagsInput";
import Button from "@/components/Button";
import { Select } from "@/components/base";
import { TRoute, ELogicalRelation, TPath, EItemName, TRule, ERuleName, EDeviceType, EBrowserName } from "@/lib/types";

type TFlowBuilder = {
    mainRoute: TRoute;
    ruleRoutes: TRoute[];
};

export default function FlowBuilder({ value, onChange }: {
    value: TFlowBuilder;
    onChange: (fb: TFlowBuilder) => any;
}) {
    const { mainRoute, ruleRoutes } = value;
    const [rulesMenuOpen, setRulesMenuOpen] = useState<boolean>(false);

    function handleReorder(dir: TReorderDirection, index: number) {
        if (!ruleRoutes[index]) return;

        const clone = structuredClone(ruleRoutes);
        const rule = clone.splice(index, 1)[0];

        if (dir === "up" && ruleRoutes[index - 1]) {
            clone.splice(index - 1, 0, rule);
            onChange({ ...value, ruleRoutes: clone });
        } else if (dir === "down" && ruleRoutes[index + 1]) {
            clone.splice(index + 1, 0, rule);
            onChange({ ...value, ruleRoutes: clone });
        }
    }

    return (
        <>
            <Route
                type="main"
                route={mainRoute}
                onChange={route => onChange({ ...value, mainRoute: route })}
            />
            {ruleRoutes.map((route, index) => (
                <Route
                    type="rule"
                    key={index}
                    route={route}
                    onChange={route => onChange({
                        ...value,
                        ruleRoutes: ruleRoutes.map((r, i) => i === index ? route : r),
                    })}
                    onDelete={() => onChange({ ...value, ruleRoutes: ruleRoutes.filter((_, i) => i !== index) })}
                    onReorder={dir => handleReorder(dir, index)}
                />
            ))}
            <Button
                text="Add New Rule"
                icon={faPlus}
                onClick={() => setRulesMenuOpen(true)}
            />
            {rulesMenuOpen &&
                <PopoverLayer layer={3}>
                    <div className="px-6 py-4 bg-white border">
                        <RulesMenu
                            route={mainRoute}
                            onChange={route => onChange({
                                ...value,
                                mainRoute: route,
                            })}
                        />
                        <div
                            className="flex justify-center items-center w-full mt-6 px-2 py-4"
                            style={{ borderTop: "solid 1px #cfcfcf" }}
                        >
                            <Button text="Done" onClick={() => setRulesMenuOpen(false)} />
                        </div>
                    </div>
                </PopoverLayer>
            }
        </>
    )
}

function RulesMenu({ route, onChange }: {
    route: TRoute;
    onChange: (r: TRoute) => any;
}) {
    return (
        <div className='flex flex-col justify-start items-between h-full w-full max-h-[90vh] max-w-[700px] bg-white'
            style={{ borderRadius: '5px' }}
        >
            <div className='flex flex-col justify-start items-start gap-2 px-4 overflow-y-scroll'
                style={{ height: 'inherit' }}
            >
                <div className='flex justify-start items-center w-full'>
                    <span>
                        Logical Relation
                    </span>
                </div>
                <div className='flex justify-start items-center gap-2 w-full'>
                    {Object.values(ELogicalRelation).map((lr, index) => (
                        <div key={index} className='flex justify-start items-center'>
                            <input
                                type="checkbox"
                                checked={lr === route.logicalRelation}
                                onChange={() => onChange({ ...route, logicalRelation: lr })}
                            />
                            <span>
                                {lr}
                            </span>
                        </div>
                    ))}
                </div>
                <div className='flex justify-start items-center gap-2 w-full'>
                    <Select
                        value=""
                        onChange={e => onChange({ ...route, rules: [...route.rules, newRule(e.target.value as ERuleName)] })}
                    >
                        <option value="">Add New Rule</option>
                        {Object.values(ERuleName)
                            .filter(ruleName => !route.rules.some(rule => rule.ruleName === ruleName))
                            .map((ruleName, index) => (
                                <option key={index} value={ruleName}>
                                    {ruleName}
                                </option>
                            ))}
                    </Select>
                    <Button
                        text='Remove All Rules'
                        icon={faTrashAlt}
                        onClick={() => onChange({ ...route, rules: [] })}
                    />
                </div>
                <div
                    className='flex flex-col justify-start items-center gap-2 p-2 w-full'
                    style={{ border: 'solid 1px grey' }}
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

function Rule(props: {
    rule: TRule;
    onChange: (ru: TRule) => any;
}) {
    if (userInputRules.includes(props.rule.ruleName)) {
        return <UserInputRuleLayout {...props} />;
    } else if (checkboxesRules.includes(props.rule.ruleName)) {
        return <CheckboxesRuleLayout {...props} />;
    }
    return "";
}

const userInputRules: ERuleName[] = [
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

const checkboxesRules: ERuleName[] = [
    ERuleName.DEVICE_TYPE,
    ERuleName.BROWSER_NAME,
];

function UserInputRuleLayout({ rule, onChange }: {
    rule: TRule;
    onChange: (ru: TRule) => any;
}) {
    return (
        <RuleLayoutWrapper title={rule.ruleName}>
            <BooleanCheckboxesToggle
                items={["Include", "Exclude"]}
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

function CheckboxesRuleLayout({ rule, onChange }: {
    rule: TRule;
    onChange: (ru: TRule) => any;
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

function CheckboxesInput({ items, value, onChange, className = "" }: {
    items: string[];
    value: string[];
    onChange: (newValue: string[]) => any;
    className?: string;
}) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>, item: string) {
        const checked = e.target.checked;
        if (checked && !value.includes(item)) {
            onChange([...value, item]);
        } else if (!checked && value.includes(item)) {
            onChange(value.filter(v => v !== item));
        }
    }

    return (
        <div className={"flex flex-wrap items-center gap-2 w-full " + className}>
            {items.map((item, index) => (
                <span key={index} className="flex gap-1">
                    <input
                        type="checkbox"
                        checked={value.includes(item)}
                        onChange={e => handleChange(e, item)}
                    />
                    <span>{item}</span>
                </span>
            ))}
        </div>
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

function RuleLayoutWrapper({ children, title }: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <div className="flex flex-col gap-4 w-full p-2 bg-slate-200">
            <span>{title}</span>
            <div className="flex justify-between items-center gap-2 w-full p-2">
                {children}
            </div>
        </div>
    )
}

function BooleanCheckboxesToggle({ items, value, onChange }: {
    items: [trueItem: string, falseItem: string];
    value: boolean;
    onChange: (bool: boolean) => any;
}) {
    return (
        <div className="flex flex-col justify-center h-full p-2">
            {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="checkbox"
                        checked={index === 0 ? value : !value}
                        onChange={() => onChange(index === 0 ? true : false)}
                    />
                    <span>{item}</span>
                </div>
            ))}
        </div>
    )
}

function ToggleButton({ active, onChange, size = 50 }: {
    active: boolean;
    onChange: (newActive: boolean) => any;
    size?: number;
}) {
    return (
        <div
            className="flex p-1 rounded-full border"
            style={{
                justifyContent: active ? "end" : "start",
                height: `${size}px`,
                width: `${size * 2}px`,
                backgroundColor: active ? "rgb(88 167 239)" : "lightgrey",
                transition: "background-color 0.3s ease, justify-content 0.3s ease",
            }}
        >
            <div
                className="h-full w-[50%] bg-white rounded-full border border-black cursor-pointer"
                onClick={() => onChange(!active)}
            />
        </div>
    )
}

function newRule(ruleName: ERuleName): TRule {
    return {
        ruleName,
        data: [],
        includes: true,
    };
}

type TReorderDirection = "up" | "down";

function Route({ type, route, onChange, onDelete, onReorder = () => { } }: {
    type: "main" | "rule";
    route: TRoute;
    onChange: (r: TRoute) => any;
    onDelete?: () => any;
    onReorder?: (dir: TReorderDirection) => any;
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
            {rulesMenuOpen &&
                <PopoverLayer layer={3}>
                    <div className="px-6 py-4 bg-white border">
                        <RulesMenu
                            route={route}
                            onChange={onChange}
                        />
                        <div
                            className="flex justify-center items-center w-full mt-6 px-2 py-4"
                            style={{ borderTop: "solid 1px #cfcfcf" }}
                        >
                            <Button text="Done" onClick={() => setRulesMenuOpen(false)} />
                        </div>
                    </div>
                </PopoverLayer>
            }
        </>
    )
}

function newPath(): TPath {
    return {
        isActive: true,
        weight: 100,
        landingPageIds: [],
        offerIds: [],
        directLinkingEnabled: false,
    };
}

function Path({ path, route, onChange, onDelete }: {
    path: TPath;
    route: TRoute;
    onChange: (p: TPath) => any;
    onDelete: () => any;
}) {
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
                            <input className="w-[40px] p-1" style={{ borderRadius: "6px" }}
                                value={path.weight}
                                onChange={e => onChange({ ...path, weight: Number(e.target.value) || 0 })}
                            />
                        </div>
                    }
                    <div className="flex justify-center items-center gap-2">
                        {path.isActive &&
                            <>
                                <span>
                                    {calcWeightResult(path.weight, route.paths.map(p => p.weight))}
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
            {path.isActive &&
                <>
                    <Section itemName={EItemName.LANDING_PAGE} path={path} onChange={onChange} />
                    <Section itemName={EItemName.OFFER} path={path} onChange={onChange} />
                </>
            }
        </div>
    )
}

function Section({ itemName, path, onChange }: {
    itemName: EItemName.LANDING_PAGE | EItemName.OFFER;
    path: TPath;
    onChange: (p: TPath) => any;
}) {
    const ids = itemName === EItemName.LANDING_PAGE ? path.landingPageIds : path.offerIds;

    function handleDelete(_id: number) {
        const newItems = ids.filter(id => id !== id);
        if (itemName === EItemName.LANDING_PAGE) {
            onChange({ ...path, landingPageIds: newItems });
        } else if (itemName === EItemName.OFFER) {
            onChange({ ...path, offerIds: newItems });
        }
    }

    return (
        <div className="my-2">
            <div className="relative flex justify-between items-center bg-white h-[40px] my-1 px-2">
                <div className="flex justify-between items-center gap-2 w-full">
                    <span
                        className={itemName === EItemName.LANDING_PAGE && path.directLinkingEnabled ? "line-through" : ""}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {itemName}
                    </span>
                    {itemName === EItemName.LANDING_PAGE &&
                        <input
                            type="checkbox"
                            checked={!path.directLinkingEnabled}
                            onChange={() => onChange({ ...path, directLinkingEnabled: !path.directLinkingEnabled })}
                        />
                    }
                </div>
            </div>
            {itemName === EItemName.LANDING_PAGE && path.directLinkingEnabled
                ? <div className="flex justify-center items-center bg-white h-[40px] my-1 px-2">
                    <span>
                        Direct Linking Enabled
                    </span>
                </div>
                : <>
                    <div className="flex flex-col justify-center items-center min-h-[40px] bg-white">
                        {ids.length === 0
                            ? <span className="text-xs">
                                {`No ${itemName} Added`}
                            </span>
                            : ids.map((id, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center gap-2 bg-white h-[40px] my-1 px-2"
                                >
                                    <div className="flex justify-start items-center gap-2">
                                        <span>{index + 1}</span>
                                        <WrappableSelect />
                                    </div>
                                    <div className="flex justify-end items-center gap-1">
                                        <a
                                            href="https://bing.com?source=1"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FontAwesomeIcon icon={faExternalLink} />
                                        </a>
                                        <FontAwesomeIcon icon={faPencilAlt} className="cursor-pointer" />
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className="cursor-pointer hover:text-red-500"
                                            onClick={() => handleDelete(id)} />
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="flex justify-between items-center bg-white h-[40px] my-1 px-2">
                        <div
                            // TODO: ...
                            onClick={() => console.log("Create new")}
                            className="flex justify-center items-center h-full w-[50%] cursor-pointer"
                            style={{ borderRight: "solid 1px grey" }}
                        >
                            <span>
                                {"Create New " + itemName}
                            </span>
                        </div>
                        <div
                            // TODO: ...
                            onClick={() => console.log("+ New")}
                            className="flex justify-center items-center h-full w-[50%] cursor-pointer"
                            style={{ borderLeft: "solid 1px grey" }}
                        >
                            <span>
                                {"+ New " + itemName}
                            </span>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

function WrappableSelect() {
    // TODO: ...

    return (
        <div>
            WrappableSelect
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

function calcWeightResult(weight: number, weights: number[]): number {
    const total = weights.reduce((sum, num) => sum + num, 0);
    return weight / total;
}
