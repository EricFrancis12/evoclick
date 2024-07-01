import DashboardPage from "../../page";

export default async function ReportPage({ searchParams }: {
    searchParams: { page?: string, size?: string, item?: string, order?: string };
}) {
    return DashboardPage({ searchParams });
}
