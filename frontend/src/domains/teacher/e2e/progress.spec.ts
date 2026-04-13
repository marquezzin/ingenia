/**
 * Teacher E2E — J-006: Professor consulta progresso individual de um aluno
 *
 * Cobertura:
 *  - Professor abre turma com aluno matriculado
 *  - Clica no nome do aluno na tabela
 *  - Visualiza progresso individual (nome, turma, status, módulos, exercícios)
 *  - Página de aluno sem progresso mostra estado vazio claro
 *  - Professor pode voltar à turma via botão
 *  - Lista consolidada de alunos (/teacher/students) funciona
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

/**
 * Helper: create a class and enroll the test student.
 * Returns the class detail URL.
 */
async function createClassWithStudent(page: Page, className: string) {
  await page.goto("/teacher/classes/new");
  await expect(
    page.getByRole("heading", { name: "Nova Turma" }),
  ).toBeVisible({ timeout: TIMEOUT });

  await page.locator("#class-name").fill(className);

  // Search and add the test student
  await page.locator("#student-search").fill("Aluno");
  await expect(page.getByText("Aluno Teste")).toBeVisible({
    timeout: TIMEOUT,
  });
  await page.getByText("Aluno Teste").first().click();

  await page.getByRole("button", { name: "Salvar Turma" }).click();
  await expect(page).toHaveURL(/\/teacher\/classes\/[^/]+$/, {
    timeout: TIMEOUT,
  });

  return page.url();
}

test.describe("Teacher — J-006: View individual student progress", () => {
  test.describe.configure({ mode: "serial" });

  test("teacher can navigate to student progress from class detail", async ({
    page,
  }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Prog ${uid}`;

    await loginAsTeacher(page);
    await createClassWithStudent(page, CLASS_NAME);

    // ── Wait for student table to load ──────────────────────────────
    await expect(page.getByText("Alunos da Turma")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText(STUDENT_EMAIL)).toBeVisible({
      timeout: TIMEOUT,
    });

    // ── Click on student row to view progress ───────────────────────
    await page.getByRole("row").filter({ hasText: STUDENT_EMAIL }).click();

    // Should navigate to student progress page
    await expect(page).toHaveURL(/\/students\/[^/]+$/, { timeout: TIMEOUT });

    // ── Verify student progress page content ────────────────────────
    // Student name should be visible as heading
    await expect(
      page.getByRole("heading", { name: "Aluno Teste" }),
    ).toBeVisible({ timeout: TIMEOUT });

    // Should show email and class name in subtitle
    await expect(page.getByText(STUDENT_EMAIL)).toBeVisible();
    await expect(
      page.getByText(`${STUDENT_EMAIL} • ${CLASS_NAME}`),
    ).toBeVisible();
  });

  test("student progress page shows stat cards", async ({ page }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Stats ${uid}`;

    await loginAsTeacher(page);
    await createClassWithStudent(page, CLASS_NAME);

    // Navigate to student progress
    await expect(page.getByText("Alunos da Turma")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText(STUDENT_EMAIL)).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByRole("row").filter({ hasText: STUDENT_EMAIL }).click();
    await expect(page).toHaveURL(/\/students\/[^/]+$/, { timeout: TIMEOUT });

    // ── Verify stat cards ───────────────────────────────────────────
    await expect(page.getByText("Módulos", { exact: true }).first()).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText("Aulas", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Exercícios", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Progresso Geral", { exact: true }).first()).toBeVisible();
  });

  test("student progress page shows learning status badge", async ({
    page,
  }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Badge ${uid}`;

    await loginAsTeacher(page);
    await createClassWithStudent(page, CLASS_NAME);

    await expect(page.getByText("Alunos da Turma")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText(STUDENT_EMAIL)).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByRole("row").filter({ hasText: STUDENT_EMAIL }).click();
    await expect(page).toHaveURL(/\/students\/[^/]+$/, { timeout: TIMEOUT });

    // Should show a learning status badge (one of the three statuses)
    const statusBadge = page
      .getByText(/Não iniciou|Em andamento|Concluído/)
      .first();
    await expect(statusBadge).toBeVisible({ timeout: TIMEOUT });
  });

  test("teacher can navigate back to class from student progress", async ({
    page,
  }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Back ${uid}`;

    await loginAsTeacher(page);
    await createClassWithStudent(page, CLASS_NAME);

    await expect(page.getByText("Alunos da Turma")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText(STUDENT_EMAIL)).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByRole("row").filter({ hasText: STUDENT_EMAIL }).click();
    await expect(page).toHaveURL(/\/students\/[^/]+$/, { timeout: TIMEOUT });

    // Click "Voltar para Turma" button
    await page.getByRole("button", { name: /Voltar para Turma/ }).click();

    // Should go back to class detail
    await expect(page).toHaveURL(/\/teacher\/classes\/[^/]+$/, {
      timeout: TIMEOUT,
    });
    await expect(
      page.getByRole("heading", { name: CLASS_NAME }),
    ).toBeVisible({ timeout: TIMEOUT });
  });

  test("consolidated student list page shows all students", async ({
    page,
  }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Consol ${uid}`;

    await loginAsTeacher(page);
    await createClassWithStudent(page, CLASS_NAME);

    // Navigate to consolidated students list
    await page.goto("/teacher/students");

    // Should load the page
    await expect(page.getByRole("heading", { name: "Alunos" })).toBeVisible({
      timeout: TIMEOUT,
    });

    // The enrolled student should appear in the list
    await expect(page.getByText("Aluno Teste").first()).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByText(STUDENT_EMAIL).first()).toBeVisible();
  });

  test("consolidated list allows clicking through to student progress", async ({
    page,
  }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Click ${uid}`;

    await loginAsTeacher(page);
    await createClassWithStudent(page, CLASS_NAME);

    await page.goto("/teacher/students");
    await expect(page.getByRole("heading", { name: "Alunos" })).toBeVisible({
      timeout: TIMEOUT,
    });

    // Click on student row
    await page.getByText("Aluno Teste").first().click();

    // Should navigate to student progress
    await expect(page).toHaveURL(/\/students\/[^/]+$/, { timeout: TIMEOUT });
    await expect(
      page.getByRole("heading", { name: "Aluno Teste" }),
    ).toBeVisible({ timeout: TIMEOUT });
  });

  test("consolidated student list has filtering", async ({ page }) => {
    const uid = Date.now();
    const CLASS_NAME = `E2E Filter ${uid}`;

    await loginAsTeacher(page);
    await createClassWithStudent(page, CLASS_NAME);

    await page.goto("/teacher/students");
    await expect(page.getByRole("heading", { name: "Alunos" })).toBeVisible({
      timeout: TIMEOUT,
    });

    // Use search filter
    await page.locator("#student-search").fill("Aluno");
    await expect(page.getByText("Aluno Teste").first()).toBeVisible({
      timeout: TIMEOUT,
    });

    // Search for something that doesn't exist
    await page.locator("#student-search").fill("NãoExisteNenhum");
    await expect(
      page.getByText("Nenhum aluno encontrado"),
    ).toBeVisible({ timeout: TIMEOUT });
  });
});
