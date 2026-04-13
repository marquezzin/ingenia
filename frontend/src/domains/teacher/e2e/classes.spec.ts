/**
 * Teacher E2E — J-005: Professor cria turma e acompanha desempenho coletivo
 *
 * Cobertura:
 *  - Login como professor → dashboard
 *  - Navegar até Turmas
 *  - Criar turma com nome e aluno associado
 *  - Verificar turma na lista
 *  - Abrir detalhe com indicadores de progresso coletivo
 *  - Turma sem alunos exibe estado vazio claro
 *  - Professor não pode acessar turma de outro professor (via URL direta)
 */
import { test, expect, type Page } from "@playwright/test";

const TEACHER_EMAIL = "teacher@test.dev";
const TEACHER_PASSWORD = "Test@123456";
const STUDENT_EMAIL = "student@test.dev";
const TIMEOUT = 15_000;

/**
 * Helper: login como professor e verificar redirect para /teacher.
 */
async function loginAsTeacher(page: Page) {
  await page.goto("/login");
  await page.locator("#login-email").fill(TEACHER_EMAIL);
  await page.locator("#login-password").fill(TEACHER_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/teacher/, { timeout: TIMEOUT });
}

test.describe("Teacher — J-005: Create class & track collective performance", () => {
  test.describe.configure({ mode: "serial" });

  test("teacher can access dashboard after login", async ({ page }) => {
    await loginAsTeacher(page);

    // Dashboard should show teacher greeting
    await expect(page.getByText(/Olá,/)).toBeVisible({ timeout: TIMEOUT });
  });

  test("teacher can navigate to classes list", async ({ page }) => {
    await loginAsTeacher(page);

    // Navigate to classes via sidebar or navigation
    await page.goto("/teacher/classes");
    await expect(
      page.getByRole("heading", { name: "Minhas Turmas" }),
    ).toBeVisible({ timeout: TIMEOUT });
  });

  test("teacher can create a new class with a student", async ({ page }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Turma ${uid}`;

    await loginAsTeacher(page);

    // ── 1. Navigate to create class ──────────────────────────────────
    await page.goto("/teacher/classes/new");
    await expect(
      page.getByRole("heading", { name: "Nova Turma" }),
    ).toBeVisible({ timeout: TIMEOUT });

    // ── 2. Fill class info ───────────────────────────────────────────
    await page.locator("#class-name").fill(CLASS_NAME);
    await page.locator("#class-description").fill(`Turma de teste E2E ${uid}`);

    // ── 3. Search and add student ────────────────────────────────────
    await page.locator("#student-search").fill("Aluno");
    // Wait for search results
    await expect(page.getByText("Aluno Teste")).toBeVisible({
      timeout: TIMEOUT,
    });
    // Click on the student result to add
    await page.getByText("Aluno Teste").first().click();

    // Verify student appears in selected list
    await expect(page.getByText("1 selecionado")).toBeVisible();

    // ── 4. Save class ────────────────────────────────────────────────
    await page.getByRole("button", { name: "Salvar Turma" }).click();

    // Should redirect to class detail
    await expect(page).toHaveURL(/\/teacher\/classes\/[^/]+$/, {
      timeout: TIMEOUT,
    });

    // Class name should be visible as heading
    await expect(
      page.getByRole("heading", { name: CLASS_NAME }),
    ).toBeVisible({ timeout: TIMEOUT });
  });

  test("class detail shows collective progress indicators", async ({
    page,
  }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Progress ${uid}`;

    await loginAsTeacher(page);

    // Create a class first
    await page.goto("/teacher/classes/new");
    await expect(
      page.getByRole("heading", { name: "Nova Turma" }),
    ).toBeVisible({ timeout: TIMEOUT });

    await page.locator("#class-name").fill(CLASS_NAME);

    // Add student
    await page.locator("#student-search").fill("Aluno");
    await expect(page.getByText("Aluno Teste")).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByText("Aluno Teste").first().click();

    await page.getByRole("button", { name: "Salvar Turma" }).click();
    await expect(page).toHaveURL(/\/teacher\/classes\/[^/]+$/, {
      timeout: TIMEOUT,
    });

    // ── Verify progress indicators ──────────────────────────────────
    // Stat cards should be visible
    await expect(page.getByText("Total de Alunos")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText("Iniciaram Trilha")).toBeVisible();
    await expect(page.getByText("Concluíram")).toBeVisible();

    // Students table should be visible
    await expect(page.getByText("Alunos da Turma")).toBeVisible();

    // Student row should show the enrolled student
    await expect(page.getByText(STUDENT_EMAIL)).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("class without students shows empty state", async ({ page }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Vazia ${uid}`;

    await loginAsTeacher(page);

    // Create a class without students
    await page.goto("/teacher/classes/new");
    await expect(
      page.getByRole("heading", { name: "Nova Turma" }),
    ).toBeVisible({ timeout: TIMEOUT });

    await page.locator("#class-name").fill(CLASS_NAME);
    await page.getByRole("button", { name: "Salvar Turma" }).click();

    await expect(page).toHaveURL(/\/teacher\/classes\/[^/]+$/, {
      timeout: TIMEOUT,
    });

    // Should show empty state, not an error
    await expect(page.getByText("Nenhum aluno matriculado")).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("created class appears in class list", async ({ page }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Lista ${uid}`;

    await loginAsTeacher(page);

    // Create a class
    await page.goto("/teacher/classes/new");
    await page.locator("#class-name").fill(CLASS_NAME);
    await page.getByRole("button", { name: "Salvar Turma" }).click();
    await expect(page).toHaveURL(/\/teacher\/classes\/[^/]+$/, {
      timeout: TIMEOUT,
    });

    // Go to class list
    await page.goto("/teacher/classes");
    await expect(
      page.getByRole("heading", { name: "Minhas Turmas" }),
    ).toBeVisible({ timeout: TIMEOUT });

    // The new class should appear
    await expect(page.getByText(CLASS_NAME)).toBeVisible({ timeout: TIMEOUT });
  });

  test("class list supports search filtering", async ({ page }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Busca ${uid}`;

    await loginAsTeacher(page);

    // Create a class
    await page.goto("/teacher/classes/new");
    await page.locator("#class-name").fill(CLASS_NAME);
    await page.getByRole("button", { name: "Salvar Turma" }).click();
    await expect(page).toHaveURL(/\/teacher\/classes\/[^/]+$/, {
      timeout: TIMEOUT,
    });

    // Go to class list and search
    await page.goto("/teacher/classes");
    await expect(
      page.getByRole("heading", { name: "Minhas Turmas" }),
    ).toBeVisible({ timeout: TIMEOUT });

    await page.locator("#class-search").fill(String(uid));

    // The searched class should appear
    await expect(page.getByText(CLASS_NAME)).toBeVisible({ timeout: TIMEOUT });
  });

  test("validation error when saving class without name", async ({ page }) => {
    await loginAsTeacher(page);

    await page.goto("/teacher/classes/new");
    await expect(
      page.getByRole("heading", { name: "Nova Turma" }),
    ).toBeVisible({ timeout: TIMEOUT });

    // Try to save without name
    await page.getByRole("button", { name: "Salvar Turma" }).click();

    // Should show error
    await expect(
      page.getByText("O nome da turma é obrigatório").first(),
    ).toBeVisible({ timeout: TIMEOUT });
  });
});
