import Creator from './Creator';
import List from './List';
import { getAllAffiliateNetworks } from '@/data';

export default async function AffiliateNetworks() {
    try {
        const affiliateNetworks = await getAllAffiliateNetworks();

        return (
            <>
                <Creator />
                <List affiliateNetworks={affiliateNetworks} />
            </>
        )
    } catch (err) {
        return (
            <div className='p-2 border'>Error fetching Affiliate Networks...</div>
        )
    }
}
