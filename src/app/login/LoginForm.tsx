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
            <Input name="username" type="text" data-cy="username-input" />
            <Input name="password" type="password" data-cy="password-input" />
            <button
                type="submit"
                className="mt-2 bg-blue-400 border rounded"
                data-cy="submit-button"
            >
                Login
            </button>
        </form>
    )
}

function Input(props: React.ComponentPropsWithoutRef<"input">) {
    return (
        <input
            {...props}
            placeholder={props?.name}
            className="border px-2 py-1"
        />
    )
}
