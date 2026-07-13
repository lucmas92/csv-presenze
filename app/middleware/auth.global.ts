import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()
    const sessionId = useCookie<string | null>('session_id')

    console.log('auth',auth)

    const publicRoutes = ['/login']

    if (!auth.isResolved) {
        console.log('AUTH REQUESTED')
        await auth.fetchMe()
    }

    if (!auth.isAuthenticated && !publicRoutes.includes(to.path)) {
        console.log('AUTH REQUESTED2')
        return navigateTo('/login')
    }

    if (auth.isAuthenticated && to.path === '/login') {
        console.log('AUTHENTICATED')
        return navigateTo('/')
    }
})