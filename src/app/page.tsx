import { getAllLinks } from '@/lib/data';
import Form from './Form'

export default async function Home() {
    const links = await getAllLinks();

    return (
        <main className='flex flex-col justify-center items-center gap-2 h-screen w-full'>
            <Form />
            <div className='p-2 border'>
                {links.map(link => (
                    <div key={link.id}>
                        Link Title: {link.title}
                    </div>
                ))}
            </div>
        </main>
    )
}
