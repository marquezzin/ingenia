/**
 * Módulos opcionais — Frontend
 *
 * Controla quais domains/features estão ativados.
 * Sincronizado com MODULE_* env vars do backend.
 */

export const modules = {
    /** Integração com LLMs (OpenRouter, OpenAI) */
    ai: import.meta.env.VITE_MODULE_AI_ENABLED !== "false",

    // Módulos futuros (descomente conforme necessário):
    // dashboard: import.meta.env.VITE_MODULE_DASHBOARD_ENABLED !== "false",
    // notifications: import.meta.env.VITE_MODULE_NOTIFICATIONS_ENABLED !== "false",
    // integrations: import.meta.env.VITE_MODULE_INTEGRATIONS_ENABLED !== "false",
} as const;

export type ModuleName = keyof typeof modules;

/** Retorna lista de módulos habilitados (útil para logging/debug). */
export function getEnabledModules(): ModuleName[] {
    return (Object.keys(modules) as ModuleName[]).filter(
        (key) => modules[key]
    );
}
