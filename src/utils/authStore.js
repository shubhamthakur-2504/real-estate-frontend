import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHydrated: (hasHydrated) => set({ hasHydrated }),

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
        localStorage.setItem('token', token)
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('token')
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
