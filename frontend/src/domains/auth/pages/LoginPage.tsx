/**
 * Auth Domain — Login Page
 */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Container,
    Alert,
    Box
} from "@mantine/core";
import { LogIn, AtSign, Lock, AlertCircle } from "lucide-react";
import { useLogin } from "../hooks";

const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login.mutateAsync(data);
            navigate("/");
        } catch {
            // Erro tratado pelo estado da mutation
        }
    };

    return (
        <Box
            style={{
                height: '100vh',
                backgroundColor: 'var(--mantine-color-gray-0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Container size={420} my={40}>
                <Title
                    ta="center"
                    style={{
                        fontFamily: 'Greycliff CF, var(--mantine-font-family)',
                        fontWeight: 900
                    }}
                >
                    Bem-vindo ao ingenia
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Faça login para acessar o sistema
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextInput
                            label="E-mail"
                            placeholder="seu@email.com"
                            required
                            {...register("email")}
                            error={errors.email?.message}
                            leftSection={<AtSign size={16} />}
                        />
                        <PasswordInput
                            label="Senha"
                            placeholder="Sua senha"
                            required
                            mt="md"
                            {...register("password")}
                            error={errors.password?.message}
                            leftSection={<Lock size={16} />}
                        />

                        {login.error && (
                            <Alert
                                icon={<AlertCircle size={16} />}
                                title="Erro no login"
                                color="red"
                                variant="light"
                                mt="md"
                            >
                                {(login.error as Error).message || "Credenciais inválidas. Tente novamente."}
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            mt="xl"
                            type="submit"
                            loading={isSubmitting || login.isPending}
                            leftSection={<LogIn size={18} />}
                        >
                            Acessar sistema
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}
