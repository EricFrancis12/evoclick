"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import TabContainer from "./TabContainer";

export default function TabSkeleton() {
    return (
        <TabContainer>
            <div
                className="flex items-center gap-2 h-[32px] w-[100px] bg-gray-100"
                style={{
                    userSelect: "none",
                    padding: "6px 8px 6px 8px",
                    borderRadius: "6px 6px 0 0",
                }}
            >
                <FontAwesomeIcon icon={faCircle} className="text-md text-gray-200" />
                <div className="h-2 w-full bg-gray-200 rounded-full" />
            </div>
        </TabContainer>
    )
}
