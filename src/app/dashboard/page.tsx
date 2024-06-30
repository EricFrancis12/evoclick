import { useProtectedRoute } from "@/lib/auth";
import { getClicks } from "@/data";
import Dashboard from "./Dashboard";

export default async function DashboardPage({ searchParams }: {
    searchParams: { page?: string, size?: string, item?: string, order?: string };
}) {
    await useProtectedRoute();

    const page = Number(searchParams?.page) || 1;
    const size = Number(searchParams?.size) || 20;

    const clicks = await getClicks({
        skip: getSkip(page, size),
        take: size,
    });

    return (
        <Dashboard clicks={clicks} page={page} size={size} />
    )
}

function getSkip(page: number, size: number): number {
    return page < 1 ? 0 : (page - 1) * size;
}
