"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const data = Object.fromEntries(formData);
        const callbackUrl = formData.get("callbackUrl") as string || "/dashboard";
        // Avoid redirect loop if callbackUrl is login
        const redirectTo = callbackUrl.includes("/login") ? "/dashboard" : callbackUrl;
        await signIn("credentials", { ...data, redirectTo });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}

export async function loginWithToken(token: string, callbackUrl: string = "/dashboard") {
    try {
        await signIn("credentials", {
            email: "token-login",
            password: token,
            redirectTo: callbackUrl
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Login failed with token" };
        }
        throw error;
    }
}
