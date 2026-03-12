/**
 * DataTable — Tabela paginada, filtrável e sortable.
 *
 * Uso:
 *   <DataTable
 *     columns={[
 *       { key: "name", label: "Nome", sortable: true },
 *       { key: "email", label: "E-mail" },
 *       { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
 *     ]}
 *     data={users}
 *     loading={isLoading}
 *     pagination={{ page, total: totalPages, onChange: setPage }}
 *     searchValue={search}
 *     onSearchChange={setSearch}
 *     searchPlaceholder="Buscar por nome ou email..."
 *     emptyState={{ title: "Nenhum usuário", description: "Crie um novo." }}
 *   />
 */
import {
    Flex,
    Group,
    Loader,
    Pagination,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { type ReactNode, useState } from "react";
import { EmptyState, type EmptyStateProps } from "./EmptyState";

export interface DataTableColumn<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => ReactNode;
    width?: number | string;
}

export interface DataTablePagination {
    page: number;
    total: number;
    onChange: (page: number) => void;
}

export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    loading?: boolean;
    pagination?: DataTablePagination;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    emptyState?: EmptyStateProps;
    rowKey?: (row: T) => string;
    onSort?: (key: string, direction: "asc" | "desc") => void;
}

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    loading = false,
    pagination,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Buscar...",
    emptyState,
    rowKey,
    onSort,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const handleSort = (key: string) => {
        const newDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortDir(newDir);
        onSort?.(key, newDir);
    };

    const getSortIcon = (key: string) => {
        if (sortKey !== key) return <ArrowUpDown size={14} />;
        return sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <Flex direction="column" gap="md">
            {/* Search */}
            {onSearchChange && (
                <TextInput
                    placeholder={searchPlaceholder}
                    leftSection={<Search size={16} />}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.currentTarget.value)}
                    maw={360}
                />
            )}

            {/* Table */}
            <Table.ScrollContainer minWidth={500}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            {columns.map((col) => (
                                <Table.Th
                                    key={col.key}
                                    w={col.width}
                                    style={col.sortable ? { cursor: "pointer", userSelect: "none" } : undefined}
                                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                >
                                    <Group gap={4} wrap="nowrap">
                                        <Text size="sm" fw={600}>
                                            {col.label}
                                        </Text>
                                        {col.sortable && getSortIcon(col.key)}
                                    </Group>
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {loading ? (
                            <Table.Tr>
                                <Table.Td colSpan={columns.length}>
                                    <Flex justify="center" py="xl">
                                        <Loader size="sm" />
                                    </Flex>
                                </Table.Td>
                            </Table.Tr>
                        ) : data.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={columns.length}>
                                    <EmptyState {...emptyState} />
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            data.map((row, i) => (
                                <Table.Tr key={rowKey ? rowKey(row) : i}>
                                    {columns.map((col) => (
                                        <Table.Td key={col.key}>
                                            {col.render
                                                ? col.render(row)
                                                : (row[col.key] as ReactNode) ?? "—"}
                                        </Table.Td>
                                    ))}
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>

            {/* Pagination */}
            {pagination && pagination.total > 1 && (
                <Flex justify="center" mt="sm">
                    <Pagination
                        value={pagination.page}
                        total={pagination.total}
                        onChange={pagination.onChange}
                        size="sm"
                    />
                </Flex>
            )}
        </Flex>
    );
}
