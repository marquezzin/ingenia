/**
 * Auth Storage — Gerenciamento de tokens JWT no localStorage.
 */

const ACCESS_TOKEN_KEY = "hub_access_token";
const REFRESH_TOKEN_KEY = "hub_refresh_token";

export const getAccessToken = (): string | null =>
    localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
    localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = ({
    access,
    refresh,
}: {
    access: string;
    refresh: string;
}): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const clearTokens = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => !!getAccessToken();
