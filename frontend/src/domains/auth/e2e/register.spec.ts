/**
 * Auth E2E — Register flow
 *
 * Cobertura: registro com dados válidos, email duplicado e senhas não coincidentes.
 */
import { test, expect } from "@playwright/test";

test.describe("Auth — Register", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/register");
    });

    test("user can register with valid data and is redirected to dashboard", async ({ page }) => {
        const uniqueEmail = `e2e_${Date.now()}@test.dev`;

        await page.locator("#register-fullname").fill("Novo Aluno");
        await page.locator("#register-email").fill(uniqueEmail);
        await page.locator("#register-password").fill("Senha@1234");
        await page.locator("#register-password-confirm").fill("Senha@1234");
        await page.getByRole("button", { name: "Criar conta" }).click();

        // useRegister salva tokens → navigate("/login") → RequireGuest redireciona para /
        await expect(page).not.toHaveURL(/\/register/, { timeout: 10000 });
    });

    test("shows error when registering with duplicate email", async ({ page }) => {
        await page.locator("#register-fullname").fill("Outro Aluno");
        await page.locator("#register-email").fill("student@test.dev");
        await page.locator("#register-password").fill("Senha@1234");
        await page.locator("#register-password-confirm").fill("Senha@1234");
        await page.getByRole("button", { name: "Criar conta" }).click();

        await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole("alert")).toContainText("já está cadastrado");
    });

    test("shows inline error when passwords do not match", async ({ page }) => {
        await page.locator("#register-fullname").fill("Teste Senha");
        await page.locator("#register-email").fill("mismatch@test.dev");
        await page.locator("#register-password").fill("Senha@1234");
        await page.locator("#register-password-confirm").fill("Outra@5678");
        await page.getByRole("button", { name: "Criar conta" }).click();

        await expect(page.getByText("As senhas não coincidem")).toBeVisible();
    });
});
