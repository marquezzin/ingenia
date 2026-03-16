/**
 * Auth Domain — Forgot Password Page
 *
 * Tela de recuperação de senha. (ISSUE-008-B)
 */
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    TextInput,
    Button,
    Paper,
    Title,
    Text,
    Alert,
    Box,
    Anchor,
    Group,
    Stack,
} from "@mantine/core";
import { AtSign, AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { Logo } from "@/shared/ui/Logo";
import { useForgotPassword } from "../hooks";
import { extractApiError } from "../model";
import styles from "./LoginPage.module.css";

// ─── Schema ─────────────────────────────────────────────────────────────────
const forgotSchema = z.object({
    email: z.string().email("E-mail inválido"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

// ─── Component ──────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
    const forgotMutation = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotFormData) => {
        try {
            await forgotMutation.mutateAsync(data);
        } catch {
            // Oculta erro mas React Query pega
        }
    };

    const isLoading = isSubmitting || forgotMutation.isPending;
    const isSuccess = forgotMutation.isSuccess;

    return (
        <Box className={styles.wrapper}>
            {/* ─── Left: Illustration ─────────────────────────── */}
            <Box className={styles.illustrationSide}>
                <div className={styles.illustrationContent}>
                    <img
                        src="/assets/login-illustration.png"
                        alt="Recuperando sua senha"
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
                                    <Mail size={32} />
                                </Box>
                                
                                <Title order={3}>Email enviado!</Title>
                                <Text c="dimmed" size="sm" mt="sm" mb="lg">
                                    Se o e-mail estiver cadastrado em nossa base de dados, você receberá
                                    em breve as instruções para redefinir sua senha.
                                </Text>

                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="light"
                                    leftSection={<ArrowLeft size={16} />}
                                    fullWidth
                                >
                                    Voltar para o login
                                </Button>
                            </Stack>
                        </Paper>
                    ) : (
                        <>
                            {/* Title */}
                            <div className={styles.titleBlock}>
                                <Title
                                    order={2}
                                    ta="center"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Esqueceu a senha? 🔒
                                </Title>
                                <Text c="dimmed" size="sm" ta="center" mt={4}>
                                    Digite seu e-mail e enviaremos as instruções
                                </Text>
                            </div>

                            {/* Form */}
                            <Paper className={styles.formCard}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="md">
                                        <TextInput
                                            id="forgot-email"
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

                                        {/* Error Alert */}
                                        {forgotMutation.error && (
                                            <Alert
                                                icon={<AlertCircle size={16} />}
                                                title="Erro na solicitação"
                                                color="red"
                                                variant="light"
                                                radius="md"
                                            >
                                                {extractApiError(forgotMutation.error)}
                                            </Alert>
                                        )}

                                        {/* Submit */}
                                        <Button
                                            id="forgot-submit"
                                            fullWidth
                                            type="submit"
                                            loading={isLoading}
                                            size="md"
                                            mt="xs"
                                            className={styles.submitBtn}
                                        >
                                            Enviar instruções
                                        </Button>
                                    </Stack>
                                </form>

                                {/* Back Link */}
                                <Group justify="center" mt="xl">
                                    <Anchor component={Link} to="/login" size="sm" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
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
