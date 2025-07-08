import api from "@/lib/axios";

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  institution?: string;
  gradeLevel?: string;
  isEmailConfirmed: boolean;
  role?: Role;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>("/auth/me");
  return data;
};