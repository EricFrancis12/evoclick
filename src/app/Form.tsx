'use client';

import toast from 'react-hot-toast';
import { createNewAffiliateNetworkAction } from '@/lib/actions';

const formInputs = [
    'name',
    'defaultNewOfferString',
    'tags'
];

export default function Form() {
    const createNewAffiliateNetwork = createNewAffiliateNetworkAction.bind(null);

    function handleFormAction(formData: FormData): void {
        try {
            createNewAffiliateNetwork(formData, window.location.pathname);
        } catch (err) {
            toast.error('error... :(');
        }
    }

    return (
        <form
            action={handleFormAction}
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
