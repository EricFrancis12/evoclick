import AffiliateNetworks from './components/AffiliateNetworks';
import { useRootUserRoute } from '../../lib/auth';

export default async function DevPage() {
    await useRootUserRoute();

    return (
        <main className='flex flex-col justify-center items-center gap-2 h-screen w-full'>
            <AffiliateNetworks />
        </main>
    )
}
