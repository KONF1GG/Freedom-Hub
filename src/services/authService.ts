import { api } from "./api";

export interface LoginPayload {
  login?: string;
  password?: string;
  telegramId?: number;
}

export interface AuthResponse {
  status: number;
  token?: string;
  authtoken?: string;
  employer?: string;
  roles?: string[];
  message?: string;
  error?: string;
  user?: {
    id: string;
    username: string;
    telegramId?: number;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth", payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Ошибка сети");
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  },

  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await api.get("/auth/check");
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Ошибка сети");
    }
  },
};
