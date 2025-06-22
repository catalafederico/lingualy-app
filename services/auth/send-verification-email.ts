import api from "@/lib/axios";

export const sendVerificationEmail = async (
  email: string | null
): Promise<void> => {
  return await api.get("/auth/send-verification-email", {
    params: { email },
  });
};
