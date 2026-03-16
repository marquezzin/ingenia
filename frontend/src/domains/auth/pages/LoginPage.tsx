/**
 * Auth Domain — Login Page
 *
 * Layout inspirado em Sneat: ilustração à esquerda, formulário à direita.
 * Integração JWT com redirecionamento por role. (ISSUE-008-A)
 */
import { useNavigate, Link } from "react-router-dom";
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
    Alert,
    Box,
    Anchor,
    Group,
    Stack,
    Divider,
} from "@mantine/core";
import { LogIn, AtSign, Lock, AlertCircle } from "lucide-react";
import { Logo } from "@/shared/ui/Logo";
import { useLogin } from "../hooks";
import { getRedirectPathByRole, extractApiError } from "../model";
import styles from "./LoginPage.module.css";

// ─── Schema ─────────────────────────────────────────────────────────────────
const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Component ──────────────────────────────────────────────────────────────
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
            const result = await login.mutateAsync(data);
            const redirectPath = getRedirectPathByRole(result.user.role);
            navigate(redirectPath, { replace: true });
        } catch {
            // Erro tratado pelo estado da mutation
        }
    };

    const isLoading = isSubmitting || login.isPending;

    return (
        <Box className={styles.wrapper}>
            {/* ─── Left: Illustration ─────────────────────────── */}
            <Box className={styles.illustrationSide}>
                <div className={styles.illustrationContent}>
                    <img
                        src="/assets/login-illustration.png"
                        alt="Estudante aprendendo a programar"
                        className={styles.illustration}
                    />
                </div>
            </Box>

            {/* ─── Right: Form ────────────────────────────────── */}
            <Box className={styles.formSide}>
                <div className={styles.formContainer}>
                    {/* Logo */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Logo size="xl" />
                    </div>

                    {/* Title */}
                    <div className={styles.titleBlock}>
                        <Title
                            order={2}
                            ta="center"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Bem-vindo ao Ingenia! 👋
                        </Title>
                        <Text c="dimmed" size="sm" ta="center" mt={4}>
                            Faça login na sua conta e comece a aventura
                        </Text>
                    </div>

                    {/* Form */}
                    <Paper className={styles.formCard}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap="md">
                                <TextInput
                                    id="login-email"
                                    label="E-MAIL"
                                    placeholder="seu@email.com"
                                    required
                                    {...register("email")}
                                    error={errors.email?.message}
                                    leftSection={<AtSign size={16} />}
                                    autoComplete="email"
                                    styles={{
                                        label: {
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 600,
                                            letterSpacing: '0.05em',
                                            color: 'var(--color-text-muted)',
                                        },
                                    }}
                                />

                                <div>
                                    <Group justify="space-between" mb={4}>
                                        <Text
                                            component="label"
                                            htmlFor="login-password"
                                            size="xs"
                                            fw={600}
                                            c="var(--color-text-muted)"
                                            style={{ letterSpacing: '0.05em' }}
                                        >
                                            SENHA
                                        </Text>
                                        <Anchor
                                            component={Link}
                                            to="/forgot-password"
                                            size="xs"
                                        >
                                            Esqueceu a senha?
                                        </Anchor>
                                    </Group>
                                    <PasswordInput
                                        id="login-password"
                                        placeholder="············"
                                        required
                                        {...register("password")}
                                        error={errors.password?.message}
                                        leftSection={<Lock size={16} />}
                                        autoComplete="current-password"
                                    />
                                </div>

                                {/* Error Alert */}
                                {login.error && (
                                    <Alert
                                        icon={<AlertCircle size={16} />}
                                        title="Falha no login"
                                        color="red"
                                        variant="light"
                                        radius="md"
                                    >
                                        {extractApiError(login.error)}
                                    </Alert>
                                )}

                                {/* Submit */}
                                <Button
                                    id="login-submit"
                                    fullWidth
                                    type="submit"
                                    loading={isLoading}
                                    leftSection={!isLoading ? <LogIn size={18} /> : undefined}
                                    size="md"
                                    mt="xs"
                                    className={styles.submitBtn}
                                >
                                    Entrar
                                </Button>
                            </Stack>
                        </form>

                        {/* Register Link */}
                        <Divider
                            label="ou"
                            labelPosition="center"
                            my="lg"
                        />

                        <Text ta="center" size="sm">
                            Novo na plataforma?{" "}
                            <Anchor component={Link} to="/register" fw={600}>
                                Criar uma conta
                            </Anchor>
                        </Text>
                    </Paper>
                </div>
            </Box>
        </Box>
    );
}
