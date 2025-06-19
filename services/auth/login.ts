import api from "@/lib/axios";

interface ILoginUser {
  email: string;
  password: string;
}

export const loginUser = async ({
  email: username,
  password,
}: ILoginUser): Promise<void> => {
  const {
    data: { accessToken },
  } = await api.post("/auth/login", { username, password });

  localStorage.setItem("accessToken", accessToken);
};
