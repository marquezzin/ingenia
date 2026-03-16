/**
 * Auth Domain — Register Page
 *
 * Tela de registro de novo aluno com layout consistente ao login. (ISSUE-008-B)
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
    Stack,
    Divider,
} from "@mantine/core";
import { UserPlus, AtSign, Lock, AlertCircle, User as UserIcon } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { Logo } from "@/shared/ui/Logo";
import { useRegister } from "../hooks";
import { extractApiError } from "../model";
import styles from "./LoginPage.module.css"; // Reuse the same premium layout styles

// ─── Schema ─────────────────────────────────────────────────────────────────
const registerSchema = z
    .object({
        fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
        email: z.string().email("E-mail inválido"),
        password: z
            .string()
            .min(8, "Senha deve ter no mínimo 8 caracteres")
            .regex(/\d/, "A senha deve conter ao menos um número"),
        passwordConfirm: z.string().min(1, "Confirme sua senha"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "As senhas não coincidem",
        path: ["passwordConfirm"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Component ──────────────────────────────────────────────────────────────
export default function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerMutation.mutateAsync(data);
            notifications.show({
                title: "Conta criada com sucesso!",
                message: "Bem-vindo ao Ingenia. Redirecionando...",
                color: "green",
            });
            // O próprio backend/mutação já loga o usuário ou podemos mandar para o login
            // Nesse caso a mutation onSuccess já salva os tokens e manda pro /student.
            // Mas a issue diz para redirecionar para login. Como `useRegister` salva tokens,
            // podemos apenas redirecionar para o dashboard apropriado usando getRedirectPathByRole.
            // Vamos redirecionar para /login como pedido na issue (ou limpar tokens se for o caso),
            // mas o endpoint retorna AuthTokens, então ele já está logado.
            // Para não quebrar o fluxo esperado (issue pedindo redirect pro login):
            navigate("/login", { replace: true });
        } catch {
            // Erro tratado no render
        }
    };

    const isLoading = isSubmitting || registerMutation.isPending;

    return (
        <Box className={styles.wrapper}>
            {/* ─── Left: Illustration ─────────────────────────── */}
            <Box className={styles.illustrationSide}>
                <div className={styles.illustrationContent}>
                    <img
                        src="/assets/login-illustration.png"
                        alt="Criando sua conta"
                        className={styles.illustration}
                    />
                </div>
            </Box>

            {/* ─── Right: Form ────────────────────────────────── */}
            <Box className={styles.formSide}>
                <div className={styles.formContainer}>
                    {/* Logo */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Logo size="xl" />
                    </div>

                    {/* Title */}
                    <div className={styles.titleBlock}>
                        <Title
                            order={2}
                            ta="center"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Crie sua conta 🚀
                        </Title>
                        <Text c="dimmed" size="sm" ta="center" mt={4}>
                            Preencha seus dados para começar a aprender
                        </Text>
                    </div>

                    {/* Form */}
                    <Paper className={styles.formCard}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap="md">
                                <TextInput
                                    id="register-fullname"
                                    label="NOME COMPLETO"
                                    placeholder="João da Silva"
                                    required
                                    {...register("fullName")}
                                    error={errors.fullName?.message}
                                    leftSection={<UserIcon size={16} />}
                                    styles={{
                                        label: {
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 600,
                                            letterSpacing: "0.05em",
                                            color: "var(--color-text-muted)",
                                        },
                                    }}
                                />

                                <TextInput
                                    id="register-email"
                                    label="E-MAIL"
                                    placeholder="seu@email.com"
                                    required
                                    {...register("email")}
                                    error={errors.email?.message}
                                    leftSection={<AtSign size={16} />}
                                    autoComplete="email"
                                    styles={{
                                        label: {
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 600,
                                            letterSpacing: "0.05em",
                                            color: "var(--color-text-muted)",
                                        },
                                    }}
                                />

                                <PasswordInput
                                    id="register-password"
                                    label="SENHA"
                                    placeholder="Mínimo 8 caracteres e 1 número"
                                    required
                                    {...register("password")}
                                    error={errors.password?.message}
                                    leftSection={<Lock size={16} />}
                                    autoComplete="new-password"
                                    styles={{
                                        label: {
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 600,
                                            letterSpacing: "0.05em",
                                            color: "var(--color-text-muted)",
                                        },
                                    }}
                                />

                                <PasswordInput
                                    id="register-password-confirm"
                                    label="CONFIRMAR SENHA"
                                    placeholder="Repita sua senha"
                                    required
                                    {...register("passwordConfirm")}
                                    error={errors.passwordConfirm?.message}
                                    leftSection={<Lock size={16} />}
                                    autoComplete="new-password"
                                    styles={{
                                        label: {
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 600,
                                            letterSpacing: "0.05em",
                                            color: "var(--color-text-muted)",
                                        },
                                    }}
                                />

                                {/* Error Alert */}
                                {registerMutation.error && (
                                    <Alert
                                        icon={<AlertCircle size={16} />}
                                        title="Erro ao cadastrar"
                                        color="red"
                                        variant="light"
                                        radius="md"
                                    >
                                        {extractApiError(registerMutation.error)}
                                    </Alert>
                                )}

                                {/* Submit */}
                                <Button
                                    id="register-submit"
                                    fullWidth
                                    type="submit"
                                    loading={isLoading}
                                    leftSection={!isLoading ? <UserPlus size={18} /> : undefined}
                                    size="md"
                                    mt="xs"
                                    className={styles.submitBtn}
                                >
                                    Criar conta
                                </Button>
                            </Stack>
                        </form>

                        {/* Login Link */}
                        <Divider label="ou" labelPosition="center" my="lg" />

                        <Text ta="center" size="sm">
                            Já tem uma conta?{" "}
                            <Anchor component={Link} to="/login" fw={600}>
                                Fazer login
                            </Anchor>
                        </Text>
                    </Paper>
                </div>
            </Box>
        </Box>
    );
}
