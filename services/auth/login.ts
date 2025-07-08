import api from "@/lib/axios";

interface ILoginUser {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  role?: string;
}

export const loginUser = async ({
  email: username,
  password,
}: ILoginUser): Promise<void> => {
  const {
    data: { accessToken, role },
  } = await api.post<LoginResponse>("/auth/login", { username, password });

  localStorage.setItem("accessToken", accessToken);
  if (role) {
    localStorage.setItem("userRole", role);
  }
};
