/**
 * Auth Domain — API contract
 */
import { httpClient } from "@/shared/http/client";
import type { AuthTokens, LoginPayload, RegisterPayload, ForgotPasswordPayload, User } from "./types";

export const loginApi = async (payload: LoginPayload): Promise<AuthTokens & { user: User }> => {
    const { data } = await httpClient.post("/api/auth/login/", payload);
    return data;
};

export const registerApi = async (
    payload: RegisterPayload
): Promise<AuthTokens & { user: User }> => {
    const { data } = await httpClient.post("/api/auth/register/", {
        full_name: payload.fullName,
        email: payload.email,
        password: payload.password,
        password_confirm: payload.passwordConfirm,
    });
    return data;
};

export const refreshApi = async (refresh: string): Promise<{ access: string }> => {
    const { data } = await httpClient.post("/api/auth/refresh/", { refresh });
    return data;
};

export const getMeApi = async (): Promise<User> => {
    const { data } = await httpClient.get("/api/auth/me/");
    return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: data.full_name,
        role: data.role,
        accountStatus: data.account_status,
        dateJoined: data.date_joined,
        profileInfo: data.profile_info,
    };
};

export const forgotPasswordApi = async (payload: ForgotPasswordPayload): Promise<void> => {
    await httpClient.post("/api/auth/forgot-password/", payload);
};
