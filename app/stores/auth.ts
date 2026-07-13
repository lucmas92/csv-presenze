// stores/auth.ts
import { defineStore } from 'pinia'

type AuthUser = {
    id: number
    name: string
    email: string
    role?: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as AuthUser | null,
        isResolved: false,
        pending: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        async fetchMe() {
            if (this.pending) return
            this.pending = true

            try {
                const user = await $fetch<AuthUser | null>('/api/auth/me', {
                    credentials: 'include',
                })

                this.user = user
            } catch {
                this.user = null
            } finally {
                this.isResolved = true
                this.pending = false
            }
        },

        clear() {
            this.user = null
            this.isResolved = true
        },

        async logout() {
            await $fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })

            this.clear()
        },
    },
})