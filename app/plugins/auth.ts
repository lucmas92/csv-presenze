// plugins/auth.ts
export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore()

    // Se c'è un cookie del token, recuperiamo i dettagli dell'utente immediatamente
    if (authStore.token) {
        await authStore.fetchUser()
    }
})