import { getAllAffiliateNetworks } from '@/lib/data';

export default async function AffiliateNetworks() {
    try {
        const affiliateNetworks = await getAllAffiliateNetworks();

        return (
            <div className='p-2 border'>
                {affiliateNetworks.map(affiliateNetwork => (
                    <div key={affiliateNetwork.id}>
                        Link Title: {affiliateNetwork.name}
                    </div>
                ))}
            </div>
        )
    } catch (err) {
        return (
            <div className='p-2 border'>Error fetching Affiliate Networks...</div>
        )
    }
}
