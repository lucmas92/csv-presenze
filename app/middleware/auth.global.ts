import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()
    const sessionId = useCookie<string | null>('session_id')

    const publicRoutes = ['/login']

    if (!auth.isAuthenticated && !publicRoutes.includes(to.path)) {
        return navigateTo('/login')
    }

    if (auth.isAuthenticated && to.meta.protected && auth.user.role !== 'admin'){
        return navigateTo('403')
    }

    if (auth.isAuthenticated && to.path === '/login') {
        return navigateTo('/')
    }
})