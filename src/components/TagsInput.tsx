"use client";

import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const X_BUTTON_SIZE = 16;

export default function TagsInput({ tags, setTags, title, placeholder, suggestions }: {
    tags: string[];
    setTags: (newTags: string[]) => void;
    title?: string;
    placeholder?: string;
    suggestions?: string[];
}) {
    const tagInputElement = useRef<HTMLInputElement>(null);

    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    function handleMouseDown(tag: string) {
        addNewTag(tag);
        setSearchQuery("");
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!tagInputElement.current?.value) return;

        addNewTag(tagInputElement.current.value);
        tagInputElement.current.value = "";
        setSearchQuery("");
    }

    function addNewTag(tag: string) {
        if (tags.includes(tag)) return;
        setTags([...tags, tag]);
    }

    function deleteTag(tag: string) {
        const newTags = tags.filter(_tag => _tag !== tag);
        setTags(newTags);
    }

    return (
        <div className="flex flex-col w-full">
            {title && <span>{title}</span>}
            <div className="w-full p-1 bg-white" style={{ border: "solid 1px grey", borderRadius: "6px" }}>
                <span>
                    {tags.map((tag, index) => (
                        <span key={index} className="inline-block rounded-full bg-gray-300 m-1 p-1">
                            <div className="flex justify-center items-center gap-1 px-1">
                                <span className="flex justify-center items-center ml-1">
                                    {tag}
                                </span>
                                <span onClick={() => deleteTag(tag)}
                                    className="flex justify-center items-center rounded-full p-1 cursor-pointer hover:bg-gray-500"
                                    style={{
                                        height: `${X_BUTTON_SIZE}px`,
                                        width: `${X_BUTTON_SIZE}px`,
                                        border: "solid darkgrey 2px"
                                    }}
                                >
                                    <FontAwesomeIcon icon={faX} fontSize={`${X_BUTTON_SIZE / 2}px`} />
                                </span>
                            </div>
                        </span>
                    ))}
                    <span className="relative inline-block w-full">
                        <form className="w-full" onSubmit={handleSubmit}>
                            <input
                                ref={tagInputElement}
                                placeholder={placeholder}
                                className="w-full m-1 p-1 bg-transparent"
                                style={{
                                    border: "none",
                                    outline: "none"
                                }}
                                onChange={e => setSearchQuery(e.target?.value ?? "")}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setShowSuggestions(false)}
                            />
                        </form>
                        {showSuggestions &&
                            <div className="absolute">
                                {suggestions
                                    ?.filter(suggestion => filterSuggestions(suggestion, searchQuery, tags))
                                    .map((tag, index) => (
                                        <div key={index} onMouseDown={e => handleMouseDown(tag)}>
                                            {tag}
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </span>
                </span>
            </div>
        </div>
    )
}

function filterSuggestions(suggestion: string, searchQuery: string, tags: string[]): boolean {
    const satisfiesSearchQuery = suggestion.includes(searchQuery) || !searchQuery;
    const notInTags = !tags.includes(suggestion);
    return satisfiesSearchQuery && notInTags;
}
