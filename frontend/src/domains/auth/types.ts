/**
 * Auth Domain — Types
 */

export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    dateJoined: string;
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
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
