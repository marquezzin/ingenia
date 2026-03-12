import { Menu, Group, Text, Avatar, UnstyledButton, rem } from "@mantine/core";
import { LogOut, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";

export function UserMenu() {
    // Mock user for now
    const user = { name: "Giovanni", email: "giovanni@example.com", image: null };
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return (
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton>
                    <Group gap={7}>
                        <Avatar src={user.image} alt={user.name} radius="xl" size={30} />
                        <Text fw={500} size="sm" lh={1} mr={3}>
                            {user.name}
                        </Text>
                        <ChevronDown
                            style={{ width: rem(12), height: rem(12), transition: 'transform 200ms ease', transform: userMenuOpened ? 'rotate(180deg)' : 'none' }}
                            strokeWidth={1.5}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Configurações</Menu.Label>
                <Menu.Item leftSection={<Settings style={{ width: rem(16), height: rem(16) }} strokeWidth={1.5} />}>
                    Minha Conta
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    color="red"
                    leftSection={<LogOut style={{ width: rem(16), height: rem(16) }} strokeWidth={1.5} />}
                    onClick={() => {
                        // Implement logout logic here
                        console.log("Logout clicked");
                        window.location.href = "/login"; // Temporary
                    }}
                >
                    Sair
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
