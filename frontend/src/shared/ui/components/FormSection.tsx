/**
 * FormSection — Seção de formulário com título, descrição e conteúdo.
 *
 * Uso:
 *   <FormSection
 *     title="Informações Pessoais"
 *     description="Dados básicos do perfil."
 *   >
 *     <TextInput label="Nome" />
 *     <TextInput label="E-mail" />
 *   </FormSection>
 */
import { Box, Divider, Flex, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

export interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    withDivider?: boolean;
}

export function FormSection({
    title,
    description,
    children,
    withDivider = true,
}: FormSectionProps) {
    return (
        <>
            <Flex
                direction={{ base: "column", sm: "row" }}
                gap="lg"
                py="md"
            >
                <Box miw={200} maw={280}>
                    <Title order={5}>{title}</Title>
                    {description && (
                        <Text size="sm" c="dimmed" mt={4}>
                            {description}
                        </Text>
                    )}
                </Box>
                <Flex direction="column" gap="sm" style={{ flex: 1 }}>
                    {children}
                </Flex>
            </Flex>
            {withDivider && <Divider />}
        </>
    );
}
