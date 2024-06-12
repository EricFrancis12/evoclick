'use client';

import { CreateNewLinkAction } from '@/lib/actions';

const formInputs = [
    'category',
    'description',
    'imageUrl',
    'title',
    'url'
];

export default function Form() {
    const createNewLink = CreateNewLinkAction.bind(null);

    return (
        <form
            action={formData => createNewLink(formData, window.location.pathname)}
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
    )
}
