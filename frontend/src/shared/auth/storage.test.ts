import { describe, it, expect, beforeEach, vi } from "vitest";
import { getAccessToken, getRefreshToken, setTokens, clearTokens, isAuthenticated } from "./storage";

describe("Auth Storage", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("should store and retrieve tokens", () => {
        setTokens({ access: "access-123", refresh: "refresh-456" });
        expect(getAccessToken()).toBe("access-123");
        expect(getRefreshToken()).toBe("refresh-456");
    });

    it("should clear tokens", () => {
        setTokens({ access: "access-123", refresh: "refresh-456" });
        clearTokens();
        expect(getAccessToken()).toBeNull();
        expect(getRefreshToken()).toBeNull();
    });

    it("should check if authenticated", () => {
        expect(isAuthenticated()).toBe(false);
        setTokens({ access: "access-123", refresh: "refresh-456" });
        expect(isAuthenticated()).toBe(true);
    });
});
