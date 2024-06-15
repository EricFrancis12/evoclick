import Form from './Form';
import AffiliateNetworks from './AffiliateNetworks';

export default async function Home() {
    return (
        <main className='flex flex-col justify-center items-center gap-2 h-screen w-full'>
            <Form />
            <AffiliateNetworks />
        </main>
    )
}
