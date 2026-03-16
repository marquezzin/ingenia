/**
 * Header — Top bar com logo, info do usuário e logout.
 */
import {
  Burger,
  Group,
  Menu,
  Avatar,
  Text,
  Badge,
  UnstyledButton,
} from "@mantine/core";
import { LogOut } from "lucide-react";
import { useMe, useLogout } from "@/domains/auth/hooks";
import { Logo } from "@/shared/ui/Logo";
import type { UserRole } from "@/domains/auth/types";
import classes from "./Header.module.css";

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  TEACHER: "Professor",
  STUDENT: "Aluno",
};

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: "grape",
  TEACHER: "teal",
  STUDENT: "brand",
};

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export const Header = ({ opened, onToggle }: HeaderProps) => {
  const { data: user } = useMe();
  const logout = useLogout();

  const displayName = user?.fullName || user?.email || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className={classes.header}>
      <div className={classes.leftSection}>
        <Burger
          opened={opened}
          onClick={onToggle}
          hiddenFrom="sm"
          size="sm"
          aria-label="Abrir menu"
        />
        <Group gap="sm" visibleFrom="sm">
          <Logo size="lg" />
          <Text
            fw={700}
            size="xl"
            style={{
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-accent)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ingenia
          </Text>
        </Group>
      </div>

      <div className={classes.rightSection}>
        {user && (
          <Menu shadow="md" width={240} position="bottom-end" withArrow>
            <Menu.Target>
              <UnstyledButton className={classes.userButton}>
                <Group gap="sm" wrap="nowrap">
                  <Avatar size={36} radius="xl" color={ROLE_COLORS[user.role]}>
                    {initials}
                  </Avatar>
                  <Text className={classes.userName} visibleFrom="sm">{displayName}</Text>
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text fw={600} size="sm">{displayName}</Text>
                <Text size="xs" c="dimmed">{user.email}</Text>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Label>
                <Badge
                  size="sm"
                  variant="light"
                  color={ROLE_COLORS[user.role]}
                  fullWidth
                >
                  {ROLE_LABELS[user.role]}
                </Badge>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                leftSection={<LogOut size={14} />}
                color="red"
                onClick={logout}
              >
                Sair
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </header>
  );
};
