import { getAllAffiliateNetworks } from '@/lib/data';
import Form from './Form'

export default async function Home() {
    const affiliateNetworks = await getAllAffiliateNetworks();

    return (
        <main className='flex flex-col justify-center items-center gap-2 h-screen w-full'>
            <Form />
            <div className='p-2 border'>
                {affiliateNetworks.map(affiliateNetwork => (
                    <div key={affiliateNetwork.id}>
                        Link Title: {affiliateNetwork.name}
                    </div>
                ))}
            </div>
        </main>
    )
}
