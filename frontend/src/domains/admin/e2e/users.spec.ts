/**
 * Admin E2E — Users flow (J-008)
 *
 * Cobertura: admin cria usuário por role, edita status da conta,
 * usa filtros e busca na listagem de usuários.
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

test.describe("Admin — J-008: User management", () => {
    test("admin can create a student user", async ({ page }) => {
        const uid = Date.now();
        await loginAsAdmin(page);

        const userName = `E2E Student ${uid}`;
        const userEmail = `e2e_student_${uid}@test.dev`;

        // Navigate to user creation
        await page.goto("/admin/users/new");
        await expect(page).toHaveURL(/\/admin\/users\/new/, { timeout: TIMEOUT });

        // Fill form
        await page.getByLabel("Nome completo").fill(userName);
        await page.getByLabel("Email").fill(userEmail);
        await page.getByLabel("Senha").fill("Test@123456");

        // Role is already "Aluno" by default
        await page.getByRole("button", { name: "Salvar Usuário" }).click();

        // Should redirect to user detail page
        await expect(page).toHaveURL(/\/admin\/users\/[^/]+$/, { timeout: TIMEOUT });
        await expect(page.getByRole("heading", { name: userName })).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByText(userEmail)).toBeVisible();
    });

    test("admin can create a teacher user", async ({ page }) => {
        const uid = Date.now();
        await loginAsAdmin(page);

        const userName = `E2E Teacher ${uid}`;
        const userEmail = `e2e_teacher_${uid}@test.dev`;

        await page.goto("/admin/users/new");
        await expect(page).toHaveURL(/\/admin\/users\/new/, { timeout: TIMEOUT });

        await page.getByLabel("Nome completo").fill(userName);
        await page.getByLabel("Email").fill(userEmail);
        await page.getByLabel("Senha").fill("Test@123456");

        // Change role to Professor using the textbox input for the Select
        await page.getByRole("textbox", { name: "Perfil" }).click();
        await page.getByRole("option", { name: "Professor" }).click();

        await page.getByRole("button", { name: "Salvar Usuário" }).click();

        await expect(page).toHaveURL(/\/admin\/users\/[^/]+$/, { timeout: TIMEOUT });
        await expect(page.getByRole("heading", { name: userName })).toBeVisible({ timeout: TIMEOUT });
    });

    test("admin can edit user account status", async ({ page }) => {
        const uid = Date.now();
        await loginAsAdmin(page);

        // First, create a user to edit
        const userName = `E2E Edit ${uid}`;
        const userEmail = `e2e_edit_${uid}@test.dev`;

        await page.goto("/admin/users/new");
        await page.getByLabel("Nome completo").fill(userName);
        await page.getByLabel("Email").fill(userEmail);
        await page.getByLabel("Senha").fill("Test@123456");
        await page.getByRole("button", { name: "Salvar Usuário" }).click();

        // Should be on detail page — click Edit
        await expect(page).toHaveURL(/\/admin\/users\/[^/]+$/, { timeout: TIMEOUT });
        await page.getByRole("button", { name: "Editar" }).click();
        await expect(page).toHaveURL(/\/edit$/, { timeout: TIMEOUT });

        // Change status to Suspenso using the textbox input for the Select
        await page.getByRole("textbox", { name: "Status da conta" }).click();
        await page.getByRole("option", { name: "Suspenso" }).click();

        await page.getByRole("button", { name: "Salvar Alterações" }).click();

        // Should redirect back to detail page with updated status
        await expect(page).toHaveURL(/\/admin\/users\/[^/]+$/, { timeout: TIMEOUT });
        await expect(page.getByText("Suspenso")).toBeVisible({ timeout: TIMEOUT });
    });

    test("admin can search users by name", async ({ page }) => {
        const uid = Date.now();
        await loginAsAdmin(page);

        // Create a user with a unique name
        const userName = `Searchable ${uid}`;
        const userEmail = `e2e_search_${uid}@test.dev`;

        await page.goto("/admin/users/new");
        await page.getByLabel("Nome completo").fill(userName);
        await page.getByLabel("Email").fill(userEmail);
        await page.getByLabel("Senha").fill("Test@123456");
        await page.getByRole("button", { name: "Salvar Usuário" }).click();
        await expect(page).toHaveURL(/\/admin\/users\/[^/]+$/, { timeout: TIMEOUT });

        // Navigate to users list and search
        await page.goto("/admin/users");
        await page.getByPlaceholder("Buscar por nome ou email").fill(userName);

        // Wait for filtered results
        await expect(page.getByText(userName).first()).toBeVisible({ timeout: TIMEOUT });
        await expect(page.getByText(userEmail)).toBeVisible();
    });

    test("admin can filter users by role", async ({ page }) => {
        await loginAsAdmin(page);

        await page.goto("/admin/users");
        await expect(page.getByRole("heading", { name: "Usuários" })).toBeVisible({ timeout: TIMEOUT });

        // Filter by Professor role using the Select with placeholder
        await page.getByPlaceholder("Filtrar por perfil").click();
        await page.getByRole("option", { name: "Professor" }).click();

        // The seed has a teacher user — "Professor Teste" should be visible
        await expect(page.getByText("Professor Teste")).toBeVisible({ timeout: TIMEOUT });

        // Clear and filter by Administrador
        await page.getByPlaceholder("Filtrar por perfil").click();
        await page.getByRole("option", { name: "Administrador" }).click();

        // The seed has an admin user — should be visible
        await expect(page.getByText("Admin Teste")).toBeVisible({ timeout: TIMEOUT });
    });
});
