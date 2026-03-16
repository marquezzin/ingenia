/**
 * Sidebar — Navegação lateral com itens diferenciados por role.
 * Usa Mantine NavLink + Lucide icons.
 */
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink, ScrollArea, Stack, Divider } from "@mantine/core";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Route,
  BarChart3,
  FileCode2,
  School,
} from "lucide-react";
import type { UserRole } from "@/domains/auth/types";
import classes from "./Sidebar.module.css";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const ICON_SIZE = 18;

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", icon: <LayoutDashboard size={ICON_SIZE} />, path: "/admin" },
    { label: "Módulos", icon: <BookOpen size={ICON_SIZE} />, path: "/admin/modules" },
    { label: "Usuários", icon: <Users size={ICON_SIZE} />, path: "/admin/users" },
    { label: "Turmas", icon: <School size={ICON_SIZE} />, path: "/admin/classes" },
  ],
  TEACHER: [
    { label: "Dashboard", icon: <LayoutDashboard size={ICON_SIZE} />, path: "/teacher" },
    { label: "Turmas", icon: <School size={ICON_SIZE} />, path: "/teacher/classes" },
    { label: "Alunos", icon: <GraduationCap size={ICON_SIZE} />, path: "/teacher/students" },
  ],
  STUDENT: [
    { label: "Trilha", icon: <Route size={ICON_SIZE} />, path: "/student" },
    { label: "Módulos", icon: <BookOpen size={ICON_SIZE} />, path: "/student/modules" },
    { label: "Progresso", icon: <BarChart3 size={ICON_SIZE} />, path: "/student/progress" },
    { label: "Submissões", icon: <FileCode2 size={ICON_SIZE} />, path: "/student/submissions" },
  ],
};

interface SidebarProps {
  role: UserRole;
  onNavClick?: () => void;
}

export const Sidebar = ({ role, onNavClick }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = NAV_CONFIG[role] ?? [];

  const isActive = (path: string) => {
    // Para o dashboard root (ex: /student), match exato
    if (path === `/${role.toLowerCase()}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={classes.sidebar}>
      <ScrollArea className={classes.nav} type="auto">
        <Divider
          label="Menu"
          labelPosition="left"
          mb="xs"
          styles={{
            label: {
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-text-muted)",
            },
          }}
        />
        <Stack gap={4}>
          {items.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={item.icon}
              active={isActive(item.path)}
              onClick={() => {
                navigate(item.path);
                onNavClick?.();
              }}
              variant="light"
              styles={{
                root: {
                  borderRadius: "var(--radius-md)",
                },
              }}
            />
          ))}
        </Stack>
      </ScrollArea>
    </nav>
  );
};
