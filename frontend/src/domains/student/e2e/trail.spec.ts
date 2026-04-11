/**
 * Student E2E — Trail & Lesson flow (J-002)
 *
 * Cobertura: aluno navega pela trilha, visualiza módulos, abre módulo,
 * acessa aula com vídeo + conteúdo + exercícios, navega entre aulas.
 *
 * Pré-requisito: `make test-seed` (módulo "Introdução ao Python" publicado).
 */
import { test, expect, type Page } from "@playwright/test";

const STUDENT_EMAIL = "student@test.dev";
const STUDENT_PASSWORD = "Test@123456";
const TIMEOUT = 15_000;

/**
 * Helper: login as student and wait for redirect.
 */
async function loginAsStudent(page: Page) {
    await page.goto("/login");
    await page.locator("#login-email").fill(STUDENT_EMAIL);
    await page.locator("#login-password").fill(STUDENT_PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForURL(/\/student/, { timeout: TIMEOUT });
}

test.describe("Student — J-002: Trail navigation & lesson access", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
        await loginAsStudent(page);
    });

    test("student sees dashboard with modules trail", async ({ page }) => {
        // Dashboard should show the greeting
        await expect(page.getByText("Olá, Aluno!")).toBeVisible({ timeout: TIMEOUT });

        // Should show "Trilha de Módulos" section
        await expect(page.getByText("Trilha de Módulos")).toBeVisible({ timeout: TIMEOUT });

        // Should show our seed module (appears in ContinueStudyCard + ModuleCard)
        await expect(page.getByText("Introdução ao Python").first()).toBeVisible({ timeout: TIMEOUT });
    });

    test("student navigates to modules list via sidebar", async ({ page }) => {
        // Click "Módulos" in sidebar navigation (NavLink renders as button)
        await page.locator("nav").getByText("Módulos").click();
        await expect(page).toHaveURL(/\/student\/modules/, { timeout: TIMEOUT });

        // Should display the seed module
        await expect(page.getByText("Introdução ao Python").first()).toBeVisible({ timeout: TIMEOUT });
    });

    test("student opens module detail and sees lessons", async ({ page }) => {
        // Navigate to modules list via URL
        await page.goto("/student/modules");

        // Click on the module card
        await page.getByText("Introdução ao Python").first().click();
        await expect(page).toHaveURL(/\/student\/modules\/[^/]+/, { timeout: TIMEOUT });

        // Should show module title as heading
        await expect(page.getByRole("heading", { name: "Introdução ao Python" })).toBeVisible({ timeout: TIMEOUT });

        // Should show lessons section
        await expect(page.getByRole("heading", { name: "Aulas" })).toBeVisible({ timeout: TIMEOUT });

        // Should list both lessons (LessonItem renders as button)
        await expect(page.getByRole("button", { name: /Olá Mundo/ })).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByRole("button", { name: /Variáveis/ })).toBeVisible({ timeout: TIMEOUT });

        // Should show CTA button
        await expect(page.locator("#module-continue-button")).toBeVisible({ timeout: TIMEOUT });
    });

    test("student opens lesson and sees video + content + exercises", async ({ page }) => {
        // Navigate to modules list, then module
        await page.goto("/student/modules");
        await page.getByText("Introdução ao Python").first().click();
        await expect(page).toHaveURL(/\/student\/modules\/[^/]+/, { timeout: TIMEOUT });

        // Click on first lesson "Olá Mundo" (LessonItem renders as button)
        await page.getByRole("button", { name: /Olá Mundo/ }).click();
        await expect(page).toHaveURL(/\/lessons\/[^/]+/, { timeout: TIMEOUT });

        // Should show lesson title as heading
        await expect(page.getByRole("heading", { name: "Olá Mundo", exact: true })).toBeVisible({ timeout: TIMEOUT });

        // Should show video player (iframe)
        await expect(page.locator("iframe")).toBeVisible({ timeout: TIMEOUT });

        // Should show written content — check for a markdown heading
        await expect(page.getByRole("heading", { name: "O comando print" })).toBeVisible({ timeout: TIMEOUT });

        // Should show exercises section with "Primeiro Programa"
        await expect(page.getByRole("heading", { name: "Exercícios" })).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByRole("button", { name: /Exercício 1/ })).toBeVisible({ timeout: TIMEOUT });

        // Should show lesson counter badge
        await expect(page.getByText("Aula 1 de 2")).toBeVisible({ timeout: TIMEOUT });
    });

    test("student can navigate to lesson without exercises and complete it", async ({ page }) => {
        // Navigate: modules → module detail → lesson 2
        await page.goto("/student/modules");
        await page.getByText("Introdução ao Python").first().click();
        await expect(page).toHaveURL(/\/student\/modules\/[^/]+/, { timeout: TIMEOUT });

        // Click on second lesson "Variáveis" (LessonItem renders as button)
        await page.getByRole("button", { name: /Variáveis/ }).click();
        await expect(page).toHaveURL(/\/lessons\/[^/]+/, { timeout: TIMEOUT });

        // Should show lesson title (Mantine h2, not markdown headings)
        await expect(page.locator("h2.mantine-Title-root").filter({ hasText: "Variáveis" })).toBeVisible({ timeout: TIMEOUT });

        // Should show written content
        await expect(page.getByText("Variáveis são como")).toBeVisible({ timeout: TIMEOUT });

        // Should show "Concluir aula" button (no exercises)
        await expect(page.locator("#lesson-complete-button")).toBeVisible({ timeout: TIMEOUT });
    });

    test("non-student user is blocked from student area", async ({ page }) => {
        // Logout first: open user menu, click "Sair"
        await page.locator("header").getByRole("button").last().click();
        await page.getByText("Sair").click();
        await page.waitForURL(/\/login/, { timeout: TIMEOUT });

        // Login as admin
        await page.locator("#login-email").fill("admin@test.dev");
        await page.locator("#login-password").fill("Test@123456");
        await page.getByRole("button", { name: "Entrar" }).click();
        await page.waitForURL(/\/admin/, { timeout: TIMEOUT });

        // Try to access /student directly
        await page.goto("/student");

        // Should be redirected away (to /unauthorized or /admin)
        await expect(page).not.toHaveURL(/\/student/, { timeout: TIMEOUT });
    });
});
