import { useProtectedRoute } from "@/lib/auth";
import { getClicks } from "@/data";
import ReportView from "./ReportView";
import { EItemName } from "@/lib/types";

export default async function DashboardPage({ params, searchParams }: {
    params: { itemName?: string, id?: string };
    searchParams: { page?: string, size?: string, timeframe?: string };
}) {
    await useProtectedRoute();

    // TODO: Validate all params and search params used here,
    // and create default values if not valid:
    const page = Number(searchParams?.page) || 1;
    const size = Number(searchParams?.size) || 20;
    const splitOnComma = searchParams?.timeframe?.split(",");
    const timeframe: [Date, Date] = splitOnComma?.length === 2
        ? [new Date(splitOnComma[0]), new Date(splitOnComma[1])]
        : [new Date("2024-06-20"), new Date("2024-07-30")];

    const reportItemName = (params?.itemName || null) as EItemName | null;
    const reportItemId = (params?.id || null) as EItemName | null;

    try {
        const clicks = await getClicks({
            skip: getSkip(page, size),
            take: size,
            where: {
                AND: [
                    {
                        viewTime: {
                            gte: timeframe[0],
                            lte: timeframe[1],
                        },
                    },
                    {
                        // TODO: Add ability to filter by reportItemName and reportItemId
                    },
                ],
            },
        });

        return (
            <ReportView
                clicks={clicks}
                page={page}
                size={size}
                timeframe={timeframe}
                reportItemName={reportItemName}
            />
        )
    } catch (err) {
        console.error(err);
        return "Error fetching clicks from db :(";
    }
}

function getSkip(page: number, size: number): number {
    return page < 1 ? 0 : (page - 1) * size;
}
