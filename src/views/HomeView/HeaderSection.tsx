"use client";

import { faTachometerAltFast } from "@fortawesome/free-solid-svg-icons";
import useQueryRouter from "@/hooks/useQueryRouter";
import Button from "@/components/Button";
import CalendarButton from "@/components/CalendarButton";
import { encodeTimeframe } from "@/lib/utils";

export default function HeaderSection({ timeframe }: {
    timeframe: [Date, Date];
}) {
    const queryRouter = useQueryRouter();

    return (
        <div className="flex justify-end items-center gap-2 w-full p-4">
            <CalendarButton
                timeframe={timeframe}
                onChange={_timeframe => queryRouter.push(
                    window.location.href,
                    { timeframe: encodeTimeframe(_timeframe) }
                )}
            />
            <Button
                text="Dashboard"
                icon={faTachometerAltFast}
                onClick={() => queryRouter.push(
                    "/dashboard",
                    { timeframe: encodeTimeframe(timeframe) }
                )}
            />
        </div>
    )
}
