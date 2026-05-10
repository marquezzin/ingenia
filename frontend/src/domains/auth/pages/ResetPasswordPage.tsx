/**
 * Auth Domain — Reset Password Page
 *
 * Recebe token via querystring (?token=...) e permite definir nova senha.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Anchor,
    Box,
    Button,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { AlertCircle, ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Logo } from "@/shared/ui/Logo";
import { useResetPassword } from "../hooks";
import { extractApiError } from "../model";
import styles from "./LoginPage.module.css";

// ─── Schema ─────────────────────────────────────────────────────────────────
const resetSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "A senha deve ter no mínimo 8 caracteres")
            .regex(/\d/, "A senha deve conter ao menos um número"),
        newPasswordConfirm: z.string(),
    })
    .refine((data) => data.newPassword === data.newPasswordConfirm, {
        message: "As senhas não coincidem",
        path: ["newPasswordConfirm"],
    });

type ResetFormData = z.infer<typeof resetSchema>;

// ─── Component ──────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const resetMutation = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
    });

    if (!token) {
        return <Navigate to="/forgot-password" replace />;
    }

    const onSubmit = async (data: ResetFormData) => {
        try {
            await resetMutation.mutateAsync({
                token,
                newPassword: data.newPassword,
                newPasswordConfirm: data.newPasswordConfirm,
            });
        } catch {
            // Erro tratado pelo React Query state
        }
    };

    const isLoading = isSubmitting || resetMutation.isPending;
    const isSuccess = resetMutation.isSuccess;

    return (
        <Box className={styles.wrapper}>
            {/* ─── Left: Illustration ─────────────────────────── */}
            <Box className={styles.illustrationSide}>
                <div className={styles.illustrationContent}>
                    <img
                        src="/assets/login-illustration.png"
                        alt="Definir nova senha"
                        className={styles.illustration}
                    />
                </div>
            </Box>

            {/* ─── Right: Form ────────────────────────────────── */}
            <Box className={styles.formSide}>
                <div className={styles.formContainer}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Logo size="xl" />
                    </div>

                    {isSuccess ? (
                        <Paper className={styles.formCard} mt="xl">
                            <Stack align="center" ta="center" gap="md">
                                <Box
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: "50%",
                                        background: "hsl(var(--brand-primary) / 0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "hsl(var(--brand-primary))",
                                        margin: "0 auto",
                                    }}
                                >
                                    <CheckCircle2 size={32} />
                                </Box>

                                <Title order={3}>Senha redefinida!</Title>
                                <Text c="dimmed" size="sm" mt="sm" mb="lg">
                                    Sua senha foi alterada com sucesso. Você já pode entrar com a
                                    nova senha.
                                </Text>

                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="light"
                                    leftSection={<ArrowLeft size={16} />}
                                    fullWidth
                                >
                                    Ir para o login
                                </Button>
                            </Stack>
                        </Paper>
                    ) : (
                        <>
                            <div className={styles.titleBlock}>
                                <Title
                                    order={2}
                                    ta="center"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Defina uma nova senha 🔐
                                </Title>
                                <Text c="dimmed" size="sm" ta="center" mt={4}>
                                    Escolha uma senha forte para proteger sua conta
                                </Text>
                            </div>

                            <Paper className={styles.formCard}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="md">
                                        <PasswordInput
                                            id="reset-new-password"
                                            label="NOVA SENHA"
                                            placeholder="Mínimo 8 caracteres com 1 número"
                                            required
                                            {...register("newPassword")}
                                            error={errors.newPassword?.message}
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
                                            id="reset-new-password-confirm"
                                            label="CONFIRMAR SENHA"
                                            placeholder="Repita a nova senha"
                                            required
                                            {...register("newPasswordConfirm")}
                                            error={errors.newPasswordConfirm?.message}
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

                                        {resetMutation.error && (
                                            <Alert
                                                icon={<AlertCircle size={16} />}
                                                title="Erro ao redefinir senha"
                                                color="red"
                                                variant="light"
                                                radius="md"
                                            >
                                                {extractApiError(resetMutation.error)}
                                            </Alert>
                                        )}

                                        <Button
                                            id="reset-submit"
                                            fullWidth
                                            type="submit"
                                            loading={isLoading}
                                            size="md"
                                            mt="xs"
                                            className={styles.submitBtn}
                                        >
                                            Redefinir senha
                                        </Button>
                                    </Stack>
                                </form>

                                <Group justify="center" mt="xl">
                                    <Anchor
                                        component={Link}
                                        to="/login"
                                        size="sm"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.25rem",
                                        }}
                                    >
                                        <ArrowLeft size={14} /> Voltar para o login
                                    </Anchor>
                                </Group>
                            </Paper>
                        </>
                    )}
                </div>
            </Box>
        </Box>
    );
}
