import api from "@/lib/axios";

export const forgotPassword = async (email: string): Promise<void> => {
  await api.post("/auth/forgot-password", {
    email,
  });
};
