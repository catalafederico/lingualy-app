import api from "@/lib/axios";
import { setToken } from "@/lib/auth";

interface RefreshResponse {
  accessToken: string;
  role?: string;
}

export const refreshToken = async (): Promise<string> => {
  const {
    data: { accessToken, role },
  } = await api.post<RefreshResponse>("/auth/refresh");

  // Update stored token and role
  setToken(accessToken);
  if (role) {
    localStorage.setItem("userRole", role);
  }

  return accessToken;
};