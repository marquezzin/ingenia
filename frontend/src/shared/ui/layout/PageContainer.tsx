import { Container, Title, Box } from "@mantine/core";
import { ReactNode } from "react";

interface PageContainerProps {
    title?: string;
    children: ReactNode;
    actions?: ReactNode;
}

export function PageContainer({ title, children, actions }: PageContainerProps) {
    return (
        <Container size="xl" p={0}>
            {title && (
                <Box mb="lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title order={2}>{title}</Title>
                    {actions && <Box>{actions}</Box>}
                </Box>
            )}
            {children}
        </Container>
    );
}
