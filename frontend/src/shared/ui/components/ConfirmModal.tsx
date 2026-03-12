/**
 * ConfirmModal — Modal de confirmação reutilizável.
 *
 * Uso:
 *   <ConfirmModal
 *     opened={opened}
 *     onClose={close}
 *     onConfirm={handleDelete}
 *     title="Excluir usuário"
 *     message="Tem certeza? Esta ação não pode ser desfeita."
 *     confirmLabel="Excluir"
 *     confirmColor="red"
 *     loading={isDeleting}
 *   />
 */
import { Button, Group, Modal, Text } from "@mantine/core";

export interface ConfirmModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
    loading?: boolean;
}

export function ConfirmModal({
    opened,
    onClose,
    onConfirm,
    title = "Confirmar ação",
    message = "Tem certeza que deseja continuar?",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    confirmColor = "red",
    loading = false,
}: ConfirmModalProps) {
    return (
        <Modal opened={opened} onClose={onClose} title={title} centered size="sm">
            <Text size="sm" c="dimmed" mb="lg">
                {message}
            </Text>
            <Group justify="flex-end" gap="sm">
                <Button variant="default" onClick={onClose} disabled={loading}>
                    {cancelLabel}
                </Button>
                <Button color={confirmColor} onClick={onConfirm} loading={loading}>
                    {confirmLabel}
                </Button>
            </Group>
        </Modal>
    );
}
