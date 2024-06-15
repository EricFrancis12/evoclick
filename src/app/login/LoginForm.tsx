'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loginAction } from '@/lib/actions';
import { formatErr } from '@/lib/utils';

const formInputs = [
    'username',
    'password'
];

export default function LoginForm() {
    const router = useRouter();

    const login = loginAction.bind(null);

    function handleLoginAction(formData: FormData): void {
        login(formData)
            .then(user => {
                if (!user) {
                    toast.error('Login error');
                } else {
                    router.push('/');
                }
            })
            .catch(err => toast.error(formatErr(err)));
    }

    return (
        <form
            action={handleLoginAction}
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
                Login
            </button>
        </form>
    )
}
