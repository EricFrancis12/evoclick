import DashboardPage from "../../../page";

export default async function ReportPage({ params, searchParams }: {
    params: { itemName?: string };
    searchParams: { timeframe?: string };
}) {
    return DashboardPage({ params, searchParams });
}
