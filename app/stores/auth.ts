// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    // useCookie gestisce automaticamente la persistenza sia lato server che client
    const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24, // Durata del cookie (es. 24 ore)
        sameSite: 'lax',
        secure: true // Solo su HTTPS (in produzione)
    })

    const user = ref<any>(null)

    // Getter per verificare se l'utente è autenticato
    const isAuthenticated = computed(() => !!token.value)

    // Azione di Login connessa alla tua API
    async function login(credentials: { username: string; password: string }) {
        try {
            const data = await $fetch<{ token: string; user: any }>('/api/auth/login', {
                method: 'POST',
                body: credentials
            })

            // Salva il token nel cookie e l'utente in memoria
            token.value = data.token
            user.value = data.user

            return true
        } catch (error:any) {
            console.error('Errore durante il login:', error.data)
            return false
        }
    }

    // Azione di Logout
    async function logout() {
        token.value = null // Rimuove automaticamente il cookie
        user.value = null
        await $fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
    }

    return { token, user, isAuthenticated, login, logout }
})