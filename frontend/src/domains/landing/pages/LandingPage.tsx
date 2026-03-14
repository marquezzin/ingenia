/**
 * Landing Domain — Landing Page
 *
 * Página pública de apresentação do Ingenia.
 * Portada do projeto ingenia-landing-page, reconstruída com Mantine + CSS Modules.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    SimpleGrid,
    Box,
    Anchor,
} from "@mantine/core";
import {
    ArrowRight,
    Play,
    Check,
    BookOpen,
    Users,
} from "lucide-react";
import styles from "../landing.module.css";

export default function LandingPage() {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={styles.landing}>
            {/* ─── HERO SECTION ──────────────────────────────────────────── */}
            <section className={styles.hero}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.heroVideo}
                    style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                >
                    <source
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663395806361/ccwWuLoC7LaBbvf8CqYNGN/ingenia-hero-video_034e5afd.mp4"
                        type="video/mp4"
                    />
                </video>

                <div className={styles.heroOverlay} />

                <div className={`${styles.heroContent} ${styles.fadeInUp}`}>
                    <Title
                        order={1}
                        fz={{ base: "2.5rem", sm: "3.5rem", md: "4.5rem" }}
                        lh={1.1}
                        mb="md"
                    >
                        <span className={styles.gradientText}>Aprender a Programar</span>
                        <br />
                        <span>Começa com Curiosidade</span>
                    </Title>

                    <Text
                        size="lg"
                        c="var(--color-text-muted)"
                        maw={640}
                        mx="auto"
                        mb="xl"
                        lh={1.7}
                    >
                        Ingenia ajuda estudantes a descobrir programação através de aulas
                        guiadas, desafios práticos e progresso real.
                    </Text>

                    <Group justify="center" gap="md" wrap="wrap">
                        <Button
                            size="lg"
                            className={styles.btnPrimary}
                            rightSection={<ArrowRight size={18} />}
                            onClick={() => navigate("/login")}
                        >
                            Explorar a Plataforma
                        </Button>
                        <Button
                            size="lg"
                            className={styles.btnOutline}
                            leftSection={<Play size={18} />}
                            variant="outline"
                        >
                            Como Funciona
                        </Button>
                    </Group>
                </div>

                <div className={`${styles.scrollIndicator} ${styles.bounce}`}>
                    <div className={styles.scrollDot} />
                </div>
            </section>

            <div className={styles.softDivider} />

            {/* ─── THE PROBLEM SECTION ───────────────────────────────────── */}
            <section className={styles.section}>
                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" verticalSpacing="xl">
                        <div className={styles.slideInLeft}>
                            <Title order={2} fz={{ base: "2rem", md: "2.75rem" }} lh={1.2} mb="md">
                                O Desafio de <span className={styles.accentHighlight}>Começar</span>
                            </Title>
                            <Text size="lg" c="var(--color-text-muted)" mb="md" lh={1.7}>
                                Muitos estudantes têm curiosidade sobre tecnologia, mas não sabem
                                por onde começar a aprender programação.
                            </Text>
                            <Text size="lg" c="var(--color-text-muted)" mb="md" lh={1.7}>
                                Programação frequentemente parece complexa ou intimidadora. Ingenia
                                foi criada para tornar os primeiros passos simples, estruturados e
                                envolventes.
                            </Text>
                            <Group gap="sm" c="#3A86FF" fw={600}>
                                <ArrowRight size={18} />
                                <Text fw={600} c="#3A86FF">Vamos transformar isso juntos</Text>
                            </Group>
                        </div>

                        <div className={styles.slideInRight}>
                            <img
                                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663395806361/ccwWuLoC7LaBbvf8CqYNGN/ingenia-learning-concept-iAmLFaEv73n2NmrQrYzZG8.webp"
                                alt="Desafio de começar"
                                className={styles.landingImage}
                            />
                        </div>
                    </SimpleGrid>
                </Container>
            </section>

            <div className={styles.softDivider} />

            {/* ─── THE INGENIA APPROACH ───────────────────────────────────── */}
            <section className={styles.sectionAlt}>
                <Container size="xl">
                    <Stack align="center" mb="xl" className={styles.fadeInUp}>
                        <Title order={2} fz={{ base: "2rem", md: "2.75rem" }} ta="center">
                            A Abordagem <span className={styles.accentHighlight}>Ingenia</span>
                        </Title>
                        <Text size="lg" c="var(--color-text-muted)" maw={640} ta="center">
                            Transformamos educação em programação em uma jornada clara e
                            progressiva
                        </Text>
                    </Stack>

                    <SimpleGrid cols={{ base: 2, sm: 3, lg: 5 }} spacing="md">
                        {["Variáveis", "Lógica", "Condições", "Loops", "Funções"].map(
                            (concept, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.cardSoft} ${styles.fadeInUp}`}
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <Text fz="1.75rem" fw={700} className={styles.gradientText} mb="xs">
                                        {idx + 1}
                                    </Text>
                                    <Text fw={600} fz="lg">{concept}</Text>
                                    <Text size="sm" c="var(--color-text-muted)" mt="xs">
                                        Conceito fundamental
                                    </Text>
                                </div>
                            )
                        )}
                    </SimpleGrid>

                    <Text ta="center" c="var(--color-text-muted)" mt="xl" size="lg">
                        Cada módulo constrói sobre o anterior, criando uma progressão natural
                        e compreensível
                    </Text>
                </Container>
            </section>

            <div className={styles.softDivider} />

            {/* ─── HOW STUDENTS LEARN ────────────────────────────────────── */}
            <section className={styles.section}>
                <Container size="lg">
                    <Title
                        order={2}
                        fz={{ base: "2rem", md: "2.75rem" }}
                        ta="center"
                        mb={48}
                        className={styles.fadeInUp}
                    >
                        Como os Estudantes <span className={styles.accentHighlight}>Aprendem</span>
                    </Title>

                    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
                        {[
                            { title: "Assista", description: "Explicações em vídeo curtas e focadas", icon: "📹" },
                            { title: "Entenda", description: "Orientação escrita e exemplos práticos", icon: "📖" },
                            { title: "Pratique", description: "Resolva desafios de programação", icon: "💻" },
                            { title: "Melhore", description: "Feedback instantâneo e orientação", icon: "⚡" },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className={styles.fadeInUp}
                                style={{ animationDelay: `${idx * 0.15}s`, position: "relative" }}
                            >
                                {idx < 3 && (
                                    <Box
                                        className={styles.connectingLine}
                                        visibleFrom="md"
                                    />
                                )}
                                <div className={styles.stepCircle}>
                                    <span>{item.icon}</span>
                                </div>
                                <Title order={4} ta="center" mb="xs">{item.title}</Title>
                                <Text ta="center" c="var(--color-text-muted)" size="sm">
                                    {item.description}
                                </Text>
                            </div>
                        ))}
                    </SimpleGrid>
                </Container>
            </section>

            <div className={styles.softDivider} />

            {/* ─── LEARNING THROUGH DISCOVERY ────────────────────────────── */}
            <section className={styles.sectionAlt}>
                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" verticalSpacing="xl">
                        <div className={styles.slideInLeft}>
                            <img
                                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663395806361/ccwWuLoC7LaBbvf8CqYNGN/ingenia-hero-clean-kpKHy99xLG7Mm3Y25hL8a4.webp"
                                alt="Jornada de Aprendizado"
                                className={styles.landingImage}
                            />
                        </div>

                        <div className={styles.slideInRight}>
                            <Title order={2} fz={{ base: "2rem", md: "2.75rem" }} lh={1.2} mb="md">
                                Aprender através da{" "}
                                <span className={styles.accentHighlight}>Descoberta</span>
                            </Title>
                            <Text size="lg" c="var(--color-text-muted)" mb="lg" lh={1.7}>
                                Ingenia encoraja curiosidade e experimentação. Os estudantes
                                aprendem praticando, testando ideias e resolvendo problemas
                                enquanto constroem confiança ao progredir.
                            </Text>

                            <Stack gap="sm">
                                {[
                                    "Ambiente seguro para experimentar",
                                    "Desafios que aumentam gradualmente",
                                    "Feedback imediato e construtivo",
                                    "Progresso visível e motivador",
                                ].map((benefit, idx) => (
                                    <Group key={idx} gap="sm" align="flex-start" wrap="nowrap">
                                        <div className={styles.checkCircle}>
                                            <Check size={14} color="#fff" />
                                        </div>
                                        <Text>{benefit}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </div>
                    </SimpleGrid>
                </Container>
            </section>

            <div className={styles.softDivider} />

            {/* ─── FOR STUDENTS AND TEACHERS ─────────────────────────────── */}
            <section className={styles.section}>
                <Container size="lg">
                    <Title
                        order={2}
                        fz={{ base: "2rem", md: "2.75rem" }}
                        ta="center"
                        mb={48}
                        className={styles.fadeInUp}
                    >
                        Para <span className={styles.accentHighlight}>Estudantes</span> e{" "}
                        <span className={styles.accentHighlight}>Professores</span>
                    </Title>

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                        {/* Students */}
                        <div className={`${styles.cardSoft} ${styles.slideInLeft}`} style={{ padding: "2rem" }}>
                            <Group gap="sm" mb="lg">
                                <div className={styles.iconBox}>
                                    <BookOpen size={22} color="#3A86FF" />
                                </div>
                                <Title order={3} fz="1.5rem">Para Estudantes</Title>
                            </Group>
                            <Stack gap="sm">
                                {[
                                    "Caminho de aprendizado claro e estruturado",
                                    "Experiência prática em programação",
                                    "Progresso visível através de módulos",
                                    "Desafios que aumentam em dificuldade",
                                    "Comunidade de aprendizes",
                                ].map((item, idx) => (
                                    <Group key={idx} gap="sm" align="flex-start" wrap="nowrap">
                                        <div className={styles.checkCirclePrimary}>
                                            <Check size={12} color="#fff" />
                                        </div>
                                        <Text>{item}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </div>

                        {/* Teachers */}
                        <div className={`${styles.cardSoft} ${styles.slideInRight}`} style={{ padding: "2rem" }}>
                            <Group gap="sm" mb="lg">
                                <div className={styles.iconBox}>
                                    <Users size={22} color="#4CC9F0" />
                                </div>
                                <Title order={3} fz="1.5rem">Para Professores</Title>
                            </Group>
                            <Stack gap="sm">
                                {[
                                    "Visibilidade do progresso dos estudantes",
                                    "Insights sobre desenvolvimento de aprendizado",
                                    "Suporte para introduzir programação em sala",
                                    "Recursos e planos de aula",
                                    "Ferramentas de gerenciamento de turma",
                                ].map((item, idx) => (
                                    <Group key={idx} gap="sm" align="flex-start" wrap="nowrap">
                                        <div className={styles.checkCircleAccent}>
                                            <Check size={12} color="#fff" />
                                        </div>
                                        <Text>{item}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </div>
                    </SimpleGrid>
                </Container>
            </section>

            <div className={styles.softDivider} />

            {/* ─── LEARNING JOURNEY MODULES ──────────────────────────────── */}
            <section className={styles.sectionAlt}>
                <Container size="xl">
                    <Title
                        order={2}
                        fz={{ base: "2rem", md: "2.75rem" }}
                        ta="center"
                        mb="sm"
                        className={styles.fadeInUp}
                    >
                        Jornada de <span className={styles.accentHighlight}>Aprendizado</span>
                    </Title>
                    <Text ta="center" c="var(--color-text-muted)" size="lg" mb={48} maw={640} mx="auto">
                        Cada módulo desbloqueia conforme o estudante progride, criando uma
                        progressão natural
                    </Text>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                        {[
                            { module: "Módulo 1", title: "Primeiros Passos na Programação", description: "Conceitos fundamentais e seu primeiro código", icon: "🚀" },
                            { module: "Módulo 2", title: "Lógica e Decisões", description: "Condições e tomada de decisão em código", icon: "🧠" },
                            { module: "Módulo 3", title: "Loops e Repetição", description: "Automatizar tarefas com loops", icon: "🔄" },
                            { module: "Módulo 4", title: "Funções e Resolução de Problemas", description: "Organizar código e resolver problemas complexos", icon: "🎯" },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className={`${styles.cardSoft} ${styles.fadeInUp}`}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <Text fz="2.5rem" mb="sm">{item.icon}</Text>
                                <Text fz="sm" fw={600} c="#3A86FF" mb="xs">{item.module}</Text>
                                <Title order={4} fz="lg" mb="xs">{item.title}</Title>
                                <Text fz="sm" c="var(--color-text-muted)">{item.description}</Text>
                                {idx === 0 && <div className={styles.badgePrimary}>Disponível agora</div>}
                                {idx > 0 && <div className={styles.badgeMuted}>Desbloqueável</div>}
                            </div>
                        ))}
                    </SimpleGrid>
                </Container>
            </section>

            <div className={styles.softDivider} />

            {/* ─── WHY INGENIA ───────────────────────────────────────────── */}
            <section className={styles.section}>
                <Container size="lg">
                    <Title
                        order={2}
                        fz={{ base: "2rem", md: "2.75rem" }}
                        ta="center"
                        mb={48}
                        className={styles.fadeInUp}
                    >
                        Por que <span className={styles.accentHighlight}>Ingenia</span>
                    </Title>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                        {[
                            { title: "Aprender Fazendo", description: "Educação prática que desenvolve habilidades reais de programação", icon: "💡" },
                            { title: "Feedback Imediato", description: "Saiba instantaneamente se seu código está correto e por quê", icon: "⚡" },
                            { title: "Progressão Clara", description: "Cada passo é bem definido, mostrando exatamente o que aprender", icon: "📈" },
                            { title: "Amigável para Iniciantes", description: "Educação em programação projetada especificamente para jovens estudantes", icon: "🎓" },
                            { title: "Engajador e Divertido", description: "Desafios que motivam e mantêm os estudantes interessados", icon: "🎮" },
                            { title: "Suporte Completo", description: "Recursos para estudantes, professores e escolas", icon: "🤝" },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className={`${styles.cardSoft} ${styles.fadeInUp}`}
                                style={{ animationDelay: `${idx * 0.08}s` }}
                            >
                                <Text fz="1.75rem" mb="xs">{item.icon}</Text>
                                <Title order={4} fz="lg" mb="xs">{item.title}</Title>
                                <Text fz="sm" c="var(--color-text-muted)" lh={1.6}>
                                    {item.description}
                                </Text>
                            </div>
                        ))}
                    </SimpleGrid>
                </Container>
            </section>

            <div className={styles.softDivider} />

            {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
            <section className={styles.sectionAlt} style={{ position: "relative", overflow: "hidden" }}>
                <div className={styles.ctaBgCircleRight} />
                <div className={styles.ctaBgCircleLeft} />

                <Container size="sm" style={{ position: "relative", zIndex: 10 }}>
                    <Stack align="center" className={styles.fadeInUp}>
                        <Title order={2} fz={{ base: "2rem", md: "2.75rem" }} ta="center" lh={1.2}>
                            Programação é uma{" "}
                            <span className={styles.accentHighlight}>linguagem</span> de
                            criatividade e resolução de problemas
                        </Title>
                        <Text size="lg" c="var(--color-text-muted)" ta="center" maw={640} lh={1.7}>
                            Ingenia ajuda estudantes a dar seus primeiros passos nesse mundo
                            fascinante. Comece a jornada hoje.
                        </Text>
                        <Button
                            size="xl"
                            className={styles.btnPrimary}
                            rightSection={<ArrowRight size={18} />}
                            onClick={() => navigate("/login")}
                            mt="md"
                        >
                            Comece a Jornada
                        </Button>
                        <Text fz="sm" c="var(--color-text-muted)" mt="sm">
                            Disponível para estudantes, professores e escolas
                        </Text>
                    </Stack>
                </Container>
            </section>

            {/* ─── FOOTER ────────────────────────────────────────────────── */}
            <footer className={styles.footer}>
                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl" mb="xl">
                        <div>
                            <Title order={4} mb="sm">Ingenia</Title>
                            <Text fz="sm" c="var(--color-text-muted)">
                                Plataforma educacional que introduz programação para estudantes
                                do 8º e 9º ano através de uma jornada estruturada e envolvente.
                            </Text>
                        </div>

                        <div>
                            <Text fw={600} mb="sm">Produto</Text>
                            <Stack gap="xs">
                                <Anchor href="#" className={styles.footerLink}>Plataforma</Anchor>
                                <Anchor href="#" className={styles.footerLink}>Recursos</Anchor>
                                <Anchor href="#" className={styles.footerLink}>Preços</Anchor>
                            </Stack>
                        </div>

                        <div>
                            <Text fw={600} mb="sm">Empresa</Text>
                            <Stack gap="xs">
                                <Anchor href="#" className={styles.footerLink}>Sobre</Anchor>
                                <Anchor href="#" className={styles.footerLink}>Blog</Anchor>
                                <Anchor href="#" className={styles.footerLink}>Contato</Anchor>
                            </Stack>
                        </div>

                        <div>
                            <Text fw={600} mb="sm">Legal</Text>
                            <Stack gap="xs">
                                <Anchor href="#" className={styles.footerLink}>Privacidade</Anchor>
                                <Anchor href="#" className={styles.footerLink}>Termos</Anchor>
                                <Anchor href="#" className={styles.footerLink}>Cookies</Anchor>
                            </Stack>
                        </div>
                    </SimpleGrid>

                    <Box
                        style={{
                            borderTop: "1px solid var(--color-border)",
                            paddingTop: "2rem",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        <Text fz="sm" c="var(--color-text-muted)">
                            © 2026 Ingenia. Todos os direitos reservados.
                        </Text>
                        <Group gap="lg">
                            <Anchor href="#" className={styles.footerLink}>Twitter</Anchor>
                            <Anchor href="#" className={styles.footerLink}>LinkedIn</Anchor>
                            <Anchor href="#" className={styles.footerLink}>GitHub</Anchor>
                        </Group>
                    </Box>
                </Container>
            </footer>
        </div>
    );
}
