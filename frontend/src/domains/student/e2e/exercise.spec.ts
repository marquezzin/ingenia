/**
 * Student E2E — Exercise & Correction flow (J-003)
 *
 * Cobertura: aluno navega até exercício, escreve código no editor,
 * executa com Skulpt, vê resultado, submete, vê feedback e histórico.
 *
 * Pré-requisito: `make test-seed` (exercício "Primeiro Programa" publicado
 * com test case: input="" → expected_output="Hello").
 */
import { test, expect, type Page } from "@playwright/test";

const STUDENT_EMAIL = "student@test.dev";
const STUDENT_PASSWORD = "Test@123456";
const TIMEOUT = 15_000;
const SKULPT_TIMEOUT = 30_000; // Skulpt execution + submission round-trip

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
 * Helper: navigate from dashboard to the exercise page via URL-based navigation.
 * Uses the modules list → clicks through the UI to reach the exercise.
 */
async function navigateToExercise(page: Page) {
    // Go to modules list via URL
    await page.goto("/student/modules");
    await expect(page.getByText("Introdução ao Python").first()).toBeVisible({ timeout: TIMEOUT });

    // Click on module
    await page.getByText("Introdução ao Python").first().click();
    await expect(page).toHaveURL(/\/student\/modules\/[^/]+/, { timeout: TIMEOUT });

    // Click on lesson "Olá Mundo"
    // Click on lesson "Olá Mundo" (LessonItem renders as button)
    await page.getByRole("button", { name: /Olá Mundo/ }).click();
    await expect(page).toHaveURL(/\/lessons\/[^/]+/, { timeout: TIMEOUT });

    // Click on exercise "Primeiro Programa" (ExerciseListItem renders as button)
    await page.getByRole("button", { name: /Exercício 1/ }).click();
    await expect(page).toHaveURL(/\/exercises\/[^/]+/, { timeout: TIMEOUT });
}

/**
 * Helper: type code into Monaco editor.
 * Uses page.evaluate to call Monaco JS API directly — the only
 * reliable approach since Monaco's internal textarea is readonly.
 */
async function typeCodeInEditor(page: Page, code: string) {
    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible({ timeout: TIMEOUT });

    // Wait for Monaco to fully initialize its model
    await page.waitForTimeout(1000);

    // Set the value directly via Monaco's JS API
    await page.evaluate((c) => {
        // @monaco-editor/react exposes models through monaco.editor
        const models = (window as any).monaco?.editor?.getModels?.();
        if (models && models.length > 0) {
            models[0].setValue(c);
            return;
        }
        // Fallback: try editor instances
        const editors = (window as any).monaco?.editor?.getEditors?.();
        if (editors && editors.length > 0) {
            editors[0].setValue(c);
        }
    }, code);
}

test.describe("Student — J-003: Exercise solving & auto-correction", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
        await loginAsStudent(page);
    });

    test("student opens exercise and sees statement + editor", async ({ page }) => {
        await navigateToExercise(page);

        // Should show exercise title
        await expect(page.getByRole("heading", { name: "Primeiro Programa" })).toBeVisible({ timeout: TIMEOUT });

        // Should show statement text
        await expect(page.getByText("Escreva um programa em Python")).toBeVisible({ timeout: TIMEOUT });

        // Should show test case example (visible)
        await expect(page.getByText("Exemplo 1")).toBeVisible({ timeout: TIMEOUT });

        // Should show code editor with Python label
        await expect(page.getByText("Python", { exact: true })).toBeVisible({ timeout: TIMEOUT });

        // Should show "Executar" and "Submeter" buttons
        await expect(page.getByRole("button", { name: "Executar" })).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByRole("button", { name: "Submeter" })).toBeVisible({ timeout: TIMEOUT });
    });

    test("student runs correct code and sees PASSED result", async ({ page }) => {
        await navigateToExercise(page);

        // Type correct code
        await typeCodeInEditor(page, 'print("Hello")');

        // Click "Executar"
        await page.getByRole("button", { name: "Executar" }).click();

        // Wait for result — ResultPanel shows "Aceito" for PASSED status
        await expect(page.getByText("Aceito")).toBeVisible({ timeout: SKULPT_TIMEOUT });
    });

    test("student submits correct code and sees success notification", async ({ page }) => {
        await navigateToExercise(page);

        // Type correct code
        await typeCodeInEditor(page, 'print("Hello")');

        // Click "Submeter"
        await page.getByRole("button", { name: "Submeter" }).click();

        // Wait for submission result — should show notification with score
        await expect(page.getByText("Submissão enviada")).toBeVisible({ timeout: SKULPT_TIMEOUT });
        await expect(page.getByText("Sua nota: 100%")).toBeVisible({ timeout: TIMEOUT });
    });

    test("student sees error feedback for incorrect code", async ({ page }) => {
        await navigateToExercise(page);

        // Type incorrect code
        await typeCodeInEditor(page, 'print("Wrong")');

        // Click "Executar"
        await page.getByRole("button", { name: "Executar" }).click();

        // Should show "Resposta Incorreta" for FAILED result
        await expect(page.getByText("Resposta Incorreta")).toBeVisible({ timeout: SKULPT_TIMEOUT });
    });

    test("student sees syntax error feedback", async ({ page }) => {
        await navigateToExercise(page);

        // Type code with syntax error (missing closing paren)
        await typeCodeInEditor(page, 'print("Hello"');

        // Click "Executar"
        await page.getByRole("button", { name: "Executar" }).click();

        // Should show error result — ResultPanel title shows "Erro"
        await expect(page.getByText("Erro").first()).toBeVisible({ timeout: SKULPT_TIMEOUT });
    });

    test("student sees submission in history tab", async ({ page }) => {
        await navigateToExercise(page);

        // Click "Histórico" tab
        await page.getByRole("button", { name: /Histórico/ }).click();

        // Should show at least one submission entry with score
        await expect(page.getByText("100%").first()).toBeVisible({ timeout: TIMEOUT });
    });

    test("student can view support hint", async ({ page }) => {
        await navigateToExercise(page);

        // Click "Ver dica" button
        await page.getByRole("button", { name: "Ver dica" }).click();

        // Should show the hint alert
        await expect(page.getByRole("alert", { name: "Dica" })).toBeVisible({ timeout: TIMEOUT });

        // Click "Ocultar dica" to hide it
        await page.getByRole("button", { name: "Ocultar dica" }).click();
    });
});
