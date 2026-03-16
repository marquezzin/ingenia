import { Container, Stack, Title, Text, Button, Center, Group } from "@mantine/core";
import { ShieldAlert, MoveLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../hooks";
import { getRedirectPathByRole } from "../model";

export default function UnauthorizedPage() {
    const navigate = useNavigate();
    const { data: user } = useMe();

    const handleGoToMyArea = () => {
        if (user) {
            navigate(getRedirectPathByRole(user.role));
        } else {
            navigate("/login");
        }
    };

    return (
        <Center mih="100vh" bg="var(--color-bg)">
            <Container size="sm" ta="center">
                <Stack align="center" gap="lg">
                    <ShieldAlert size={80} color="var(--brand-primary)" strokeWidth={1.5} />
                    
                    <Title order={1} size="h1">
                        Acesso Negado
                    </Title>
                    
                    <Text c="var(--color-text-muted)" size="lg" maw={500} mx="auto">
                        Você não tem permissão para acessar esta página. 
                        Verifique se você está logado com a conta correta.
                    </Text>

                    <Group justify="center" mt="xl" gap="md">
                        <Button
                            variant="default"
                            size="md"
                            leftSection={<MoveLeft size={20} />}
                            onClick={() => navigate(-1)}
                        >
                            Voltar
                        </Button>
                        <Button
                            size="md"
                            leftSection={<Home size={20} />}
                            onClick={handleGoToMyArea}
                        >
                            Ir para minha área
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </Center>
    );
}
