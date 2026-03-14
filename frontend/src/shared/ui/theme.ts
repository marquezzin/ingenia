/**
 * Mantine Theme — ingenia
 *
 * Sincronizado com os CSS design tokens de shared/ui/tokens.css.
 * Paleta unificada com a Landing Page Ingenia (primary #3A86FF).
 */
import { createTheme, MantineColorsTuple } from "@mantine/core";

/**
 * Paleta de cores brand gerada a partir de #3A86FF.
 * Índices 0-9: do mais claro ao mais escuro.
 */
const brandPrimary: MantineColorsTuple = [
    "#e7f1ff",  // 0 - lightest
    "#d0e3ff",  // 1
    "#a3c8ff",  // 2
    "#6ea6ff",  // 3
    "#4d93ff",  // 4
    "#3A86FF",  // 5 - base / primary
    "#3378e8",  // 6
    "#2E6FE8",  // 7
    "#2560cc",  // 8
    "#1a4fad",  // 9 - darkest
];

/**
 * Paleta accent cyan (#4CC9F0).
 */
const brandAccent: MantineColorsTuple = [
    "#e6f9fd",  // 0
    "#ccf3fb",  // 1
    "#99e7f7",  // 2
    "#66dbf3",  // 3
    "#4CC9F0",  // 4 - base
    "#3bb8df",  // 5
    "#2fa7ce",  // 6
    "#2496bd",  // 7
    "#1985ac",  // 8
    "#0e749b",  // 9
];

export const theme = createTheme({
    primaryColor: "brand",
    colors: {
        brand: brandPrimary,
        accent: brandAccent,
    },

    fontFamily: "var(--font-sans)",
    fontFamilyMonospace: "var(--font-mono)",

    defaultRadius: "md",

    headings: {
        fontFamily: "var(--font-heading)",
        fontWeight: "700",
    },

    other: {
        // Tokens consumíveis via theme.other em componentes
        transition: {
            fast: "var(--transition-fast)",
            base: "var(--transition-base)",
            slow: "var(--transition-slow)",
        },
    },

    components: {
        Button: {
            defaultProps: {
                size: "md",
            },
            styles: {
                root: {
                    transition: "var(--transition-fast)",
                },
            },
        },
        TextInput: {
            defaultProps: {
                size: "md",
            },
        },
        PasswordInput: {
            defaultProps: {
                size: "md",
            },
        },
        Select: {
            defaultProps: {
                size: "md",
            },
        },
        Textarea: {
            defaultProps: {
                size: "md",
            },
        },
        Card: {
            defaultProps: {
                shadow: "sm",
                padding: "lg",
                radius: "md",
                withBorder: true,
            },
        },
        Modal: {
            defaultProps: {
                centered: true,
                radius: "md",
            },
        },
        Paper: {
            defaultProps: {
                radius: "md",
            },
        },
        Badge: {
            defaultProps: {
                radius: "sm",
                variant: "light",
            },
        },
        Table: {
            defaultProps: {
                striped: true,
                highlightOnHover: true,
                withTableBorder: true,
            },
        },
    },
});
