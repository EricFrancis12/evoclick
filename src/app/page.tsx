import { CreateNewLinkAction } from '../lib/actions';


export default function Home() {
    const formInputs = [
        'category',
        'description',
        'imageUrl',
        'title',
        'url'
    ];

    return (
        <main className='flex flex-col justify-center items-center gap-2 h-screen w-full'>
            <form
                action={CreateNewLinkAction}
                className='flex flex-col gap-1'
            >
                {formInputs.map(name => (
                    <input
                        key={name}
                        type='text'
                        name={name}
                        placeholder={name}
                        className='border px-2 py-1'
                    />
                ))}
                <button
                    type='submit'
                    className='mt-2 bg-blue-400 border rounded'
                >
                    Create New Link
                </button>
            </form>
        </main>
    )
}
