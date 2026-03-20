/**
 * Admin Domain — API Contracts
 */
import { httpClient } from "@/shared/http/client";
import type { AdminDashboardStats } from "./types";

export const getAdminDashboardStatsApi = async (): Promise<AdminDashboardStats> => {
  const { data } = await httpClient.get("/api/v1/admin/stats/");
  return data;
};
