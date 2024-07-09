import Link from "next/link"

export default async function HomePage() {
    return (
        <main className="flex flex-col justify-center items-center gap-2 h-screen w-full">
            Home Page
            <Link href="/dashboard">
                Navigate to Dashboard
            </Link>
        </main>
    )
}
