import api from "@/lib/axios";

export const confirmEmail = async (token: string): Promise<void> => {
  await api.get("/auth/confirm-email", {
    params: { token },
  });
};
