/**
 * AppLayout — Layout wrapper para áreas autenticadas.
 * Usa Mantine AppShell com Header, Sidebar e Outlet.
 */
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { useMe } from "@/domains/auth/hooks";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { data: user } = useMe();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      <AppShell.Header>
        <Header opened={opened} onToggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        {user && <Sidebar role={user.role} onNavClick={close} />}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
