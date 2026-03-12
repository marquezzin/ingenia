/**
 * Mantine Theme — ingenia
 *
 * Sincronizado com os CSS design tokens de shared/ui/tokens.css.
 * Para mudar cores/fontes, edite tokens.css — o theme herda automaticamente.
 */
import { createTheme, MantineColorsTuple } from "@mantine/core";

/**
 * Paleta de cores brand gerada a partir do token --brand-primary.
 * Índices 0-9: do mais claro ao mais escuro.
 * Editar aqui para mudar a cor primária do Mantine.
 */
const brandPrimary: MantineColorsTuple = [
    "#eef2ff",  // 0 - lightest
    "#dbe4ff",  // 1
    "#bac8ff",  // 2
    "#91a7ff",  // 3
    "#748ffc",  // 4
    "#5c7cfa",  // 5
    "#4c6ef5",  // 6 - base
    "#4263eb",  // 7 - primary (matches --brand-primary)
    "#3b5bdb",  // 8
    "#364fc7",  // 9 - darkest
];

export const theme = createTheme({
    primaryColor: "brand",
    colors: {
        brand: brandPrimary,
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
