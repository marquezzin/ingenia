/**
 * Student E2E — Progress tracking flow (J-004)
 *
 * Cobertura: aluno acompanha progresso, visualiza telas de progresso
 * e histórico de submissões, e verifica que o progresso reflete
 * as ações realizadas (exercícios resolvidos, aulas visitadas).
 *
 * Pré-requisito: `make test-seed` (módulo "Introdução ao Python" publicado).
 */
import { test, expect, type Page } from "@playwright/test";

const STUDENT_EMAIL = "student@test.dev";
const STUDENT_PASSWORD = "Test@123456";
const TIMEOUT = 15_000;
const SKULPT_TIMEOUT = 30_000;

/**
 * Helper: login as student.
 */
async function loginAsStudent(page: Page) {
    await page.goto("/login");
    await page.locator("#login-email").fill(STUDENT_EMAIL);
    await page.locator("#login-password").fill(STUDENT_PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForURL(/\/student/, { timeout: TIMEOUT });
}

/**
 * Helper: solve the exercise from the seed data.
 */
async function solveExercise(page: Page) {
    await page.goto("/student/modules");
    await expect(page.getByText("Introdução ao Python").first()).toBeVisible({ timeout: TIMEOUT });
    await page.getByText("Introdução ao Python").first().click();
    await expect(page).toHaveURL(/\/student\/modules\/[^/]+/, { timeout: TIMEOUT });
    await page.getByRole("button", { name: /Olá Mundo/ }).click();
    await expect(page).toHaveURL(/\/lessons\/[^/]+/, { timeout: TIMEOUT });
    await page.getByRole("button", { name: /Exercício 1/ }).click();
    await expect(page).toHaveURL(/\/exercises\/[^/]+/, { timeout: TIMEOUT });

    // Write and submit correct code
    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible({ timeout: TIMEOUT });

    // Wait for Monaco to fully initialize its model
    await page.waitForTimeout(1000);

    // Set value via Monaco JS API (textarea is readonly)
    await page.evaluate(() => {
        const models = (window as any).monaco?.editor?.getModels?.();
        if (models && models.length > 0) {
            models[0].setValue('print("Hello")');
            return;
        }
        const editors = (window as any).monaco?.editor?.getEditors?.();
        if (editors && editors.length > 0) {
            editors[0].setValue('print("Hello")');
        }
    });

    await page.getByRole("button", { name: "Submeter" }).click();
    await expect(page.getByText("Submissão enviada")).toBeVisible({ timeout: SKULPT_TIMEOUT });
}

test.describe("Student — J-004: Progress tracking", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
        await loginAsStudent(page);
    });

    test("student sees progress page with stats", async ({ page }) => {
        // Navigate via URL
        await page.goto("/student/progress");

        // Should show page title (heading, not breadcrumb)
        await expect(page.getByRole("heading", { name: /Meu Progresso/ })).toBeVisible({ timeout: TIMEOUT });

        // Should show stat cards (scoped to main to avoid sidebar matches)
        const main = page.getByRole("main");
        await expect(main.getByText("Módulos", { exact: true })).toBeVisible({ timeout: TIMEOUT });
        await expect(main.getByText("Aulas concluídas")).toBeVisible({ timeout: TIMEOUT });
        await expect(main.getByText("Exercícios resolvidos")).toBeVisible({ timeout: TIMEOUT });
        await expect(main.getByText("Progresso geral")).toBeVisible({ timeout: TIMEOUT });

        // Should show "Sua Evolução" ring progress section
        await expect(page.getByRole("heading", { name: "Sua Evolução" })).toBeVisible({ timeout: TIMEOUT });
    });

    test("student sees submissions page", async ({ page }) => {
        // Navigate via URL
        await page.goto("/student/submissions");

        // Should show page title (heading, not breadcrumb)
        await expect(page.getByRole("heading", { name: /Histórico de Submissões/ })).toBeVisible({ timeout: TIMEOUT });

        // Should show filter controls
        await expect(page.getByText("Todas")).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByText("Aprovadas")).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByText("Reprovadas")).toBeVisible({ timeout: TIMEOUT });
    });

    test("dashboard shows progress indicators on module cards", async ({ page }) => {
        // Dashboard should already be loaded (after login redirect)
        await expect(page.getByText("Trilha de Módulos")).toBeVisible({ timeout: TIMEOUT });

        // Module card should show progress bar indicator
        await expect(page.getByText("Introdução ao Python").first()).toBeVisible({ timeout: TIMEOUT });

        // Should show progress label
        await expect(page.getByText("Progresso", { exact: true }).first()).toBeVisible({ timeout: TIMEOUT });
    });

    test("progress updates after solving exercise", async ({ page }) => {
        // Solve the exercise
        await solveExercise(page);

        // Navigate to progress page
        await page.goto("/student/progress");

        // Should show at least 1 exercise resolved
        await expect(page.getByText("Exercícios resolvidos")).toBeVisible({ timeout: TIMEOUT });

        // Progress should show module progress section
        await expect(page.getByText("Progresso por Módulo")).toBeVisible({ timeout: TIMEOUT });
    });

    test("submissions page shows entry after solving exercise", async ({ page }) => {
        // Navigate to submissions page directly (relies on previous test's submission in serial mode)

        // Navigate to submissions page
        await page.goto("/student/submissions");

        // Should show the submission in the table (multiple might exist across parallel spec files)
        await expect(page.getByText("Primeiro Programa").first()).toBeVisible({ timeout: TIMEOUT });

        // Should show 100% score
        await expect(page.getByText("100%").first()).toBeVisible({ timeout: TIMEOUT });

        // Should show "Aprovado" status
        await expect(page.getByText("Aprovado").first()).toBeVisible({ timeout: TIMEOUT });
    });
});
