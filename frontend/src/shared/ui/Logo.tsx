import { Group, Text, ThemeIcon } from "@mantine/core";
import { Box } from "lucide-react";

export function Logo() {
    return (
        <Group gap="xs">
            <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <Box size={20} />
            </ThemeIcon>
            <Text fw={700} size="lg">ingenia</Text>
        </Group>
    );
}
