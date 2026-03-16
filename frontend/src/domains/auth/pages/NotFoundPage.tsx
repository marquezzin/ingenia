import { Container, Stack, Title, Text, Button, Center } from "@mantine/core";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Center mih="100vh" bg="var(--color-bg)">
            <Container size="sm" ta="center">
                <Stack align="center" gap="lg">
                    <Title
                        order={1}
                        c="var(--brand-primary)"
                        style={{ fontSize: "6rem", lineHeight: 1 }}
                    >
                        404
                    </Title>
                    <Title order={2} size="h1">
                        Página não encontrada
                    </Title>
                    <Text c="var(--color-text-muted)" size="lg" maw={500} mx="auto">
                        Infelizmente, a página que você está procurando não existe,
                        foi removida ou o endereço foi digitado incorretamente.
                    </Text>

                    <Button
                        size="md"
                        leftSection={<MoveLeft size={20} />}
                        onClick={() => navigate("/")}
                        mt="xl"
                    >
                        Voltar ao início
                    </Button>
                </Stack>
            </Container>
        </Center>
    );
}
