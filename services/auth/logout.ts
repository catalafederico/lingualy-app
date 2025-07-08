import api from "@/lib/axios";
import { removeToken } from "@/lib/auth";

interface LogoutResponse {
  message: string;
}

export const logoutUser = async (): Promise<void> => {
  try {
    // Call backend logout endpoint
    await api.post<LogoutResponse>("/auth/logout");
  } catch (error) {
    // Log error but don't throw - we want to clear local data regardless
    console.error("Logout API call failed:", error);
  } finally {
    // Always clear local authentication data
    removeToken();
  }
};