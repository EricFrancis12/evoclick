import Form from '../Form';
import AffiliateNetworks from '../AffiliateNetworks';
import { useProtectedRoute } from '@/lib/auth';

export default async function DashboardPage() {
    await useProtectedRoute();

    return (
        <main className='flex flex-col justify-center items-center gap-2 h-screen w-full'>
            <Form />
            <AffiliateNetworks />
        </main>
    )
}
