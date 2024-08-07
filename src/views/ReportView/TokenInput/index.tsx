"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TokenInputSection from "./TokenInputSection";
import { Input } from "@/components/base";
import { TNamedToken, TToken } from "@/lib/types";

export default function TokenInput({ token, onChange, onDelete, title = "" }: {
    token: TToken | TNamedToken;
    onChange: (t: typeof token) => void;
    onDelete?: () => void;
    title?: string;
}) {
    const isNamedToken = "name" in token;

    return (
        <div className="flex justify-between items-center gap-2 w-full p-2"
            style={{ borderTop: "solid grey 1px" }}
        >
            <div className="flex justify-start items-center h-full w-full">
                <span>{title}</span>
            </div>
            <TokenInputSection>
                <Input
                    name=""
                    placeholder="query parameter"
                    value={token.queryParam}
                    onChange={e => onChange({ ...token, queryParam: e.target.value })}
                />
            </TokenInputSection>
            <TokenInputSection>
                <Input
                    name=""
                    placeholder="{value}"
                    value={token.value}
                    onChange={e => onChange({ ...token, value: e.target.value })}
                />
            </TokenInputSection>
            <TokenInputSection>
                {isNamedToken &&
                    <Input
                        name=""
                        placeholder="name"
                        value={token.name}
                        onChange={e => onChange({ ...token, name: e.target.value })}

                    />
                }
            </TokenInputSection>
            <div className="flex justify-center items-center h-full w-[50px]">
                {isNamedToken &&
                    <span
                        className="cursor-pointer text-black hover:text-red-500"
                        onClick={onDelete}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </span>
                }
            </div>
        </div>
    )
}

