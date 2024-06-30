"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginAction } from "@/lib/actions";
import { formatErr } from "@/lib/utils";

export default function LoginForm() {
    const router = useRouter();

    const login = loginAction.bind(null);

    function handleLoginAction(formData: FormData): void {
        login(formData)
            .then(user => {
                if (!user) {
                    toast.error("Login error");
                } else {
                    router.push("/dashboard");
                }
            })
            .catch(err => toast.error(formatErr(err)));
    }

    return (
        <form
            action={handleLoginAction}
            className="flex flex-col gap-1"
        >
            <Input name="username" type="text" />
            <Input name="password" type="password" />
            <button
                type="submit"
                className="mt-2 bg-blue-400 border rounded"
            >
                Login
            </button>
        </form>
    )
}

function Input({ name, type }: {
    name: string,
    type: string
}) {
    return (
        <input
            key={name}
            type={type}
            name={name}
            placeholder={name}
            className="border px-2 py-1"
        />
    )
}
