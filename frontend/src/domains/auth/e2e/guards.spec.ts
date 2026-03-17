/**
 * Auth E2E — Route guards
 *
 * Cobertura: acesso sem autenticação e acesso com role incorreta.
 */
import { test, expect } from "@playwright/test";

test.describe("Auth — Route Guards", () => {
    test("unauthenticated user accessing /student is redirected to /login", async ({ page }) => {
        await page.goto("/student");
        await expect(page).toHaveURL(/\/login/);
    });

    test("student accessing /admin is redirected to /unauthorized", async ({ page }) => {
        // Login as student
        await page.goto("/login");
        await page.locator("#login-email").fill("student@test.dev");
        await page.locator("#login-password").fill("Test@123456");
        await page.getByRole("button", { name: "Entrar" }).click();
        await expect(page).toHaveURL(/\/student/, { timeout: 10000 });

        // Try to access admin area
        await page.goto("/admin");
        await expect(page).toHaveURL(/\/unauthorized/, { timeout: 10000 });
        await expect(page.getByText("Acesso Negado")).toBeVisible();
    });
});
