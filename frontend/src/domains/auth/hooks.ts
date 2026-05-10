/**
 * Auth Domain — React Query Hooks
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    forgotPasswordApi,
    getMeApi,
    loginApi,
    registerApi,
    resetPasswordApi,
} from "./api";
import type {
    ForgotPasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
} from "./types";
import { setTokens, clearTokens, isAuthenticated } from "@/shared/auth/storage";

const AUTH_KEYS = {
    me: ["auth", "me"] as const,
};

export const useMe = () =>
    useQuery({
        queryKey: AUTH_KEYS.me,
        queryFn: getMeApi,
        retry: false,
        enabled: isAuthenticated(),
    });

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: LoginPayload) => loginApi(payload),
        onSuccess: (data) => {
            setTokens({ access: data.access, refresh: data.refresh });
            queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: RegisterPayload) => registerApi(payload),
        onSuccess: (data) => {
            setTokens({ access: data.access, refresh: data.refresh });
            queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordApi(payload),
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi(payload),
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return () => {
        clearTokens();
        queryClient.clear();
        window.location.href = "/login";
    };
};
