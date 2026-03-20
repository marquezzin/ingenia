/**
 * Admin E2E — Modules flow (J-007)
 *
 * Cobertura: admin cria módulo → aula com vídeo → exercício → test case,
 * verifica BR-010, publica exercício → aula → módulo.
 */
import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@test.dev";
const ADMIN_PASSWORD = "Test@123456";
const TIMEOUT = 15_000;

/**
 * Helper: login como admin e verificar redirect para /admin.
 */
async function loginAsAdmin(page: Page) {
    await page.goto("/login");
    await page.locator("#login-email").fill(ADMIN_EMAIL);
    await page.locator("#login-password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/admin/, { timeout: TIMEOUT });
}

test.describe("Admin — J-007: Create module with lesson & exercise", () => {
    // Use serial mode since the full flow test is sequential
    test.describe.configure({ mode: "serial" });

    test("full content creation and publishing flow", async ({ page }) => {
        const uid = Date.now();
        // Use high sequence_order derived from uid to avoid conflicts with existing data
        const SEQ = (uid % 9000) + 1000;
        const MODULE_TITLE = `E2E Module ${uid}`;
        const MODULE_DESC = `Descrição de teste E2E ${uid}`;
        const LESSON_TITLE = `E2E Lesson ${uid}`;
        const LESSON_CONTENT = `# Aula de Teste\n\nConteúdo markdown da aula E2E ${uid}.`;
        const VIDEO_TITLE = `E2E Video ${uid}`;
        const VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        const EXERCISE_TITLE = `E2E Exercise ${uid}`;
        const EXERCISE_STATEMENT = `Escreva um programa que imprima "Hello" (E2E ${uid}).`;
        const TC_NAME = `E2E Test Case ${uid}`;
        const TC_INPUT = "5";
        const TC_OUTPUT = "Hello";

        // ── 1. Login ──────────────────────────────────────────────────
        await loginAsAdmin(page);

        // ── 2. Create Module ──────────────────────────────────────────
        await page.goto("/admin/modules");
        await page.getByRole("button", { name: "Novo Módulo" }).click();
        await expect(page).toHaveURL(/\/admin\/modules\/new/, { timeout: TIMEOUT });

        await page.getByLabel("Título").fill(MODULE_TITLE);
        await page.getByLabel("Descrição").fill(MODULE_DESC);
        // Set a unique sequence order to avoid conflicts with seed data
        const moduleSeqInput = page.getByRole("textbox", { name: "Ordem na trilha" });
        await moduleSeqInput.clear();
        await moduleSeqInput.fill(String(SEQ));
        await page.getByRole("button", { name: "Salvar Módulo" }).click();

        // Should redirect to module detail page
        await expect(page).toHaveURL(/\/admin\/modules\/[^/]+$/, { timeout: TIMEOUT });
        await expect(page.getByRole("heading", { name: MODULE_TITLE })).toBeVisible({ timeout: TIMEOUT });

        // ── 3. Create Lesson with video ───────────────────────────────
        await page.getByRole("button", { name: "Nova Aula" }).click();
        await expect(page).toHaveURL(/\/lessons\/new/, { timeout: TIMEOUT });

        await page.getByLabel("Título").fill(LESSON_TITLE);
        await page.getByPlaceholder("Escreva o conteúdo da aula").fill(LESSON_CONTENT);

        // Enable video
        await page.getByLabel("Incluir videoaula").check();
        await page.getByLabel("Título do vídeo").fill(VIDEO_TITLE);
        await page.getByLabel("URL do vídeo").fill(VIDEO_URL);

        await page.getByRole("button", { name: "Salvar Aula" }).click();

        // Should redirect to lesson detail page
        await expect(page).toHaveURL(/\/lessons\/[^/]+$/, { timeout: TIMEOUT });
        await expect(page.getByRole("heading", { name: LESSON_TITLE })).toBeVisible({ timeout: TIMEOUT });

        // ── 4. Create Exercise ────────────────────────────────────────
        await page.getByRole("button", { name: "Novo Exercício" }).click();
        await expect(page).toHaveURL(/\/exercises\/new/, { timeout: TIMEOUT });

        await page.getByLabel("Título").fill(EXERCISE_TITLE);
        await page.getByLabel("Enunciado").fill(EXERCISE_STATEMENT);

        await page.getByRole("button", { name: "Salvar Exercício" }).click();

        // Should redirect to exercise detail page
        await expect(page).toHaveURL(/\/exercises\/[^/]+$/, { timeout: TIMEOUT });
        await expect(page.getByRole("heading", { name: EXERCISE_TITLE })).toBeVisible({ timeout: TIMEOUT });

        // ── 5. Verify BR-010 alert (exercise without test cases) ─────
        await expect(page.getByText("Atenção (BR-010)")).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByText("0 testes").first()).toBeVisible();

        // ── 6. Create Test Case ───────────────────────────────────────
        await page.getByRole("button", { name: "Novo Test Case" }).click();

        // Wait for modal to open
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible({ timeout: TIMEOUT });

        await modal.getByLabel("Nome").fill(TC_NAME);
        await modal.getByLabel("Dados de Entrada (input)").fill(TC_INPUT);
        await modal.getByLabel("Saída Esperada").fill(TC_OUTPUT);

        await modal.getByRole("button", { name: "Criar Test Case" }).click();

        // Modal should close and test case should appear
        await expect(modal).not.toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByText(TC_NAME)).toBeVisible({ timeout: TIMEOUT });

        // BR-010 alert should be gone now
        await expect(page.getByText("Atenção (BR-010)")).not.toBeVisible();

        // ── 7. Publish Exercise ───────────────────────────────────────
        await page.getByRole("button", { name: "Publicar" }).click();
        await expect(page.getByRole("button", { name: "Despublicar" })).toBeVisible({ timeout: TIMEOUT });

        // ── 8. Go back to lesson detail and publish lesson ────────────
        // Navigate back via breadcrumb
        await page.getByRole("link", { name: LESSON_TITLE }).click();
        await expect(page.getByRole("heading", { name: LESSON_TITLE })).toBeVisible({ timeout: TIMEOUT });

        await page.getByRole("button", { name: "Publicar" }).click();
        await expect(page.getByRole("button", { name: "Despublicar" })).toBeVisible({ timeout: TIMEOUT });

        // ── 9. Go back to module detail and publish module ────────────
        await page.getByRole("link", { name: MODULE_TITLE }).click();
        await expect(page.getByRole("heading", { name: MODULE_TITLE })).toBeVisible({ timeout: TIMEOUT });

        await page.getByRole("button", { name: "Publicar" }).click();
        await expect(page.getByRole("button", { name: "Despublicar" })).toBeVisible({ timeout: TIMEOUT });
    });

    test("exercise without test cases shows BR-010 alert", async ({ page }) => {
        const uid = Date.now();
        const SEQ = (uid % 9000) + 1000;

        await loginAsAdmin(page);

        // Create a quick module → lesson → exercise without test cases
        await page.goto("/admin/modules/new");
        await expect(page).toHaveURL(/\/admin\/modules\/new/, { timeout: TIMEOUT });

        const title = `BR010 Module ${uid}`;
        await page.getByLabel("Título").fill(title);
        await page.getByLabel("Descrição").fill("Teste BR-010");
        const moduleSeqInput = page.getByRole("textbox", { name: "Ordem na trilha" });
        await moduleSeqInput.clear();
        await moduleSeqInput.fill(String(SEQ));
        await page.getByRole("button", { name: "Salvar Módulo" }).click();
        await expect(page).toHaveURL(/\/admin\/modules\/[^/]+$/, { timeout: TIMEOUT });
        await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: TIMEOUT });

        // Create lesson
        await page.getByRole("button", { name: "Nova Aula" }).click();
        await expect(page).toHaveURL(/\/lessons\/new/, { timeout: TIMEOUT });
        await page.getByLabel("Título").fill(`BR010 Lesson ${uid}`);
        await page.getByPlaceholder("Escreva o conteúdo da aula").fill("Conteúdo");
        await page.getByRole("button", { name: "Salvar Aula" }).click();
        await expect(page).toHaveURL(/\/lessons\/[^/]+$/, { timeout: TIMEOUT });

        // Create exercise without test cases
        await page.getByRole("button", { name: "Novo Exercício" }).click();
        await expect(page).toHaveURL(/\/exercises\/new/, { timeout: TIMEOUT });
        await page.getByLabel("Título").fill(`BR010 Exercise ${uid}`);
        await page.getByLabel("Enunciado").fill("Enunciado teste");
        await page.getByRole("button", { name: "Salvar Exercício" }).click();
        await expect(page).toHaveURL(/\/exercises\/[^/]+$/, { timeout: TIMEOUT });

        // Verify BR-010 alert is present
        await expect(page.getByText("Atenção (BR-010)")).toBeVisible({ timeout: TIMEOUT });
        await expect(
            page.getByText("Este exercício não possui test cases"),
        ).toBeVisible();
    });
});
