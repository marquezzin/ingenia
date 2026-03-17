/**
 * Auth E2E — Login flow
 *
 * Cobertura de J-001: login com redirect por role, credenciais inválidas,
 * conta inativa e logout.
 */
import { test, expect } from "@playwright/test";

test.describe("Auth — Login", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("student can login and is redirected to /student", async ({ page }) => {
        await page.locator("#login-email").fill("student@test.dev");
        await page.locator("#login-password").fill("Test@123456");
        await page.getByRole("button", { name: "Entrar" }).click();
        await expect(page).toHaveURL(/\/student/, { timeout: 10000 });
    });

    test("teacher can login and is redirected to /teacher", async ({ page }) => {
        await page.locator("#login-email").fill("teacher@test.dev");
        await page.locator("#login-password").fill("Test@123456");
        await page.getByRole("button", { name: "Entrar" }).click();
        await expect(page).toHaveURL(/\/teacher/, { timeout: 10000 });
    });

    test("admin can login and is redirected to /admin", async ({ page }) => {
        await page.locator("#login-email").fill("admin@test.dev");
        await page.locator("#login-password").fill("Test@123456");
        await page.getByRole("button", { name: "Entrar" }).click();
        await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
    });

    test("shows error with invalid credentials", async ({ page }) => {
        await page.locator("#login-email").fill("wrong@example.com");
        await page.locator("#login-password").fill("wrongpassword");
        await page.getByRole("button", { name: "Entrar" }).click();
        await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
    });

    test("shows error when account is inactive", async ({ page }) => {
        await page.locator("#login-email").fill("inactive@test.dev");
        await page.locator("#login-password").fill("Test@123456");
        await page.getByRole("button", { name: "Entrar" }).click();
        await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
    });
});

test.describe("Auth — Logout", () => {
    test("user can logout and is redirected to /login", async ({ page }) => {
        // Login first
        await page.goto("/login");
        await page.locator("#login-email").fill("student@test.dev");
        await page.locator("#login-password").fill("Test@123456");
        await page.getByRole("button", { name: "Entrar" }).click();
        await expect(page).toHaveURL(/\/student/, { timeout: 10000 });

        // Logout: abre menu do usuário e clica em Sair
        await page.locator("header").getByRole("button").last().click();
        await page.getByRole("menuitem", { name: "Sair" }).click();
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
});
