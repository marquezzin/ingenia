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
  List,
  Plus,
} from "lucide-react";
import type { UserRole } from "@/domains/auth/types";
import classes from "./Sidebar.module.css";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
}

const ICON_SIZE = 18;
const SUB_ICON_SIZE = 14;

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", icon: <LayoutDashboard size={ICON_SIZE} />, path: "/admin" },
    {
      label: "Módulos",
      icon: <BookOpen size={ICON_SIZE} />,
      path: "/admin/modules",
      children: [
        { label: "Listar Módulos", icon: <List size={SUB_ICON_SIZE} />, path: "/admin/modules" },
        { label: "Novo Módulo", icon: <Plus size={SUB_ICON_SIZE} />, path: "/admin/modules/new" },
      ],
    },
    {
      label: "Usuários",
      icon: <Users size={ICON_SIZE} />,
      path: "/admin/users",
      children: [
        { label: "Listar Usuários", icon: <List size={SUB_ICON_SIZE} />, path: "/admin/users" },
        { label: "Novo Usuário", icon: <Plus size={SUB_ICON_SIZE} />, path: "/admin/users/new" },
      ],
    },
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
    return location.pathname === path;
  };

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path)
        || location.pathname.startsWith(item.path);
    }
    return isActive(item.path);
  };

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <NavLink
          key={item.path}
          label={item.label}
          leftSection={item.icon}
          defaultOpened={isParentActive(item)}
          variant="light"
          styles={{
            root: {
              borderRadius: "var(--radius-md)",
            },
          }}
        >
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              label={child.label}
              leftSection={child.icon}
              active={isActive(child.path)}
              onClick={() => {
                navigate(child.path);
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
        </NavLink>
      );
    }

    return (
      <NavLink
        key={item.path}
        label={item.label}
        leftSection={item.icon}
        active={isParentActive(item)}
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
    );
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
          {items.map(renderNavItem)}
        </Stack>
      </ScrollArea>
    </nav>
  );
};
