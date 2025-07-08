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
  location?: string;
  isEmailConfirmed: boolean;
  role?: Role;
}

export interface UpdateUserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  location: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>("/auth/me");
  return data;
};

export const updateUserProfile = async (profileData: UpdateUserProfileData): Promise<UserProfile> => {
  const { data } = await api.patch<UserProfile>("/auth/me", profileData);
  return data;
};