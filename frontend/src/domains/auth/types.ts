/**
 * Auth Domain — Types
 * Alinhado com UserMeSerializer do backend.
 */

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: UserRole;
    accountStatus: AccountStatus;
    dateJoined: string;
    profileInfo: Record<string, unknown> | null;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface ForgotPasswordPayload {
    email: string;
}
