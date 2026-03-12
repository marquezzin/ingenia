/**
 * Auth E2E — Login flow
 */
import { test, expect } from "@playwright/test";

test.describe("Auth — Login", () => {
    test("user can login with valid credentials", async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel("E-mail").fill("user@hub.dev");
        await page.getByLabel("Senha").fill("user123");
        await page.getByRole("button", { name: "Acessar sistema" }).click();
        await expect(page).toHaveURL("/");
    });

    test("shows error with invalid credentials", async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel("E-mail").fill("wrong@example.com");
        await page.getByLabel("Senha").fill("wrongpassword");
        await page.getByRole("button", { name: "Acessar sistema" }).click();
        await expect(page.getByRole("alert")).toBeVisible();
    });

    test("unauthenticated user is redirected to login", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL("/login");
    });
});
