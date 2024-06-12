import Hello from "@/components/Hello";
import { CreateNewLinkAction } from "../lib/actions";

export default function Home() {
    const formInputs = [
        'category',
        'description',
        'id',
        'imageUrl',
        'title',
        'url'
    ];

    return (
        <main className='flex flex-col justify-center items-center gap-2 h-screen w-full'>
            Home
            <Hello />
            <form
                action={CreateNewLinkAction}
                className='flex flex-col'
            >
                {formInputs.map(name => (
                    <input key={name} type='text' name={name} placeholder={name} />
                ))}
                <button type='submit'>Create New Link</button>
            </form>
        </main>
    )
}
