/**
 * Admin Domain — React Query Hooks
 */
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStatsApi } from "./api";

const ADMIN_KEYS = {
  all: ["admin"] as const,
  stats: () => [...ADMIN_KEYS.all, "stats"] as const,
};

export const useAdminDashboardStats = () =>
  useQuery({
    queryKey: ADMIN_KEYS.stats(),
    queryFn: getAdminDashboardStatsApi,
  });
