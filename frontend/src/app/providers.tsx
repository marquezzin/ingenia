/**
 * App Providers — Todos os providers globais da aplicação.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";
import { router } from "./routes";
import { theme } from "@/shared/ui/theme";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            retry: 1,
        },
    },
});

export const Providers = () => (
    <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
            <NavigationProgress />
            <Notifications />
            <ModalsProvider>
                <RouterProvider router={router} />
            </ModalsProvider>
        </MantineProvider>
    </QueryClientProvider>
);

