/**
 * StatusBadge — Badge colorido por status, com mapeamento configurável.
 *
 * Uso:
 *   <StatusBadge status="active" />
 *   <StatusBadge status="pending" statusMap={customMap} />
 */
/* eslint-disable react-refresh/only-export-components */
import { Badge } from "@mantine/core";

export interface StatusConfig {
    label: string;
    color: string;
}

export type StatusMap = Record<string, StatusConfig>;

/** Mapa default — estenda ou substitua com sua própria versão */
export const DEFAULT_STATUS_MAP: StatusMap = {
    active: { label: "Ativo", color: "green" },
    inactive: { label: "Inativo", color: "gray" },
    pending: { label: "Pendente", color: "yellow" },
    approved: { label: "Aprovado", color: "green" },
    rejected: { label: "Rejeitado", color: "red" },
    draft: { label: "Rascunho", color: "gray" },
    published: { label: "Publicado", color: "blue" },
    archived: { label: "Arquivado", color: "gray" },
    running: { label: "Executando", color: "blue" },
    success: { label: "Sucesso", color: "green" },
    failed: { label: "Falhou", color: "red" },
    cancelled: { label: "Cancelado", color: "gray" },
};

export interface StatusBadgeProps {
    status: string;
    statusMap?: StatusMap;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function StatusBadge({
    status,
    statusMap = DEFAULT_STATUS_MAP,
    size = "sm",
}: StatusBadgeProps) {
    const config = statusMap[status] ?? {
        label: status,
        color: "gray",
    };

    return (
        <Badge color={config.color} variant="light" size={size} radius="sm">
            {config.label}
        </Badge>
    );
}
