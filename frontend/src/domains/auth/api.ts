/**
 * Auth Domain — API contract
 */
import { httpClient } from "@/shared/http/client";
import type { AuthTokens, LoginPayload, RegisterPayload, User } from "./types";

export const loginApi = async (payload: LoginPayload): Promise<AuthTokens & { user: User }> => {
    const { data } = await httpClient.post("/api/auth/login/", payload);
    return data;
};

export const registerApi = async (
    payload: RegisterPayload
): Promise<AuthTokens & { user: User }> => {
    const { data } = await httpClient.post("/api/auth/register/", payload);
    return data;
};

export const refreshApi = async (refresh: string): Promise<{ access: string }> => {
    const { data } = await httpClient.post("/api/auth/refresh/", { refresh });
    return data;
};

export const getMeApi = async (): Promise<User> => {
    const { data } = await httpClient.get("/api/auth/me/");
    return data;
};
