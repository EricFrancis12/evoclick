import { useProtectedRoute } from "@/lib/auth";
import { getClicks } from "@/data";
import ReportView from "./ReportView";
import { EItemName } from "@/lib/types";

export default async function DashboardPage({ params, searchParams }: {
    params: { itemName?: string };
    searchParams: { page?: string, size?: string, timeframe?: string };
}) {
    await useProtectedRoute();

    // TODO: Validate all params and search params used here:
    const page = Number(searchParams?.page) || 1;
    const size = Number(searchParams?.size) || 20;
    const splitOnComma = searchParams?.timeframe?.split(",");
    const timeframe: [Date, Date] = splitOnComma?.length === 2
        ? [new Date(splitOnComma[0]), new Date(splitOnComma[1])]
        : [new Date, new Date];

    const reportItemName = (params?.itemName || null) as EItemName | null;

    try {
        const clicks = await getClicks({
            skip: getSkip(page, size),
            take: size,
            // TOOO: Filter by timeframe and itemName
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
