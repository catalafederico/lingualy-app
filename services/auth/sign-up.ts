import api from "@/lib/axios";

interface ISignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const signUp = async (signUp: ISignUp): Promise<void> => {
  await api.post("/auth/sign-up", signUp);
};
