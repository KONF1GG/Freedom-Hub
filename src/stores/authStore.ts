import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  authService,
  type AuthResponse,
  type LoginPayload,
} from "../services/authService";
import { setAuthToken } from "../services/api";

type AuthState = {
  token: string | null;
  authtoken: string | null;
  employer: string | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      authtoken: null,
      employer: null,
      roles: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res: AuthResponse = await authService.login(payload);
          if (res.status === 1 && res.token) {
            set({
              token: res.token,
              authtoken: res.authtoken ?? null,
              employer: res.employer ?? null,
              roles: res.roles ?? [],
              isAuthenticated: true,
            });
            setAuthToken(res.token);
          } else {
            throw new Error(
              res.message || res.error || "Ошибка аутентификации"
            );
          }
          return res;
        } catch (e: any) {
          const errorMessage = e?.message ?? "Ошибка входа";
          set({ error: errorMessage });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        set({
          token: null,
          authtoken: null,
          employer: null,
          roles: [],
          isAuthenticated: false,
        });
        setAuthToken(null);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        authtoken: state.token,
        employer: state.employer,
        roles: state.roles,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token ?? null;
        setAuthToken(token);
      },
    }
  )
);
