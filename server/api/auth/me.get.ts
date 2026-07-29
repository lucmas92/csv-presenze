// server/api/me.get.ts
export default defineEventHandler((event) => {
    // Se l'utente non esiste nel contesto, significa che non è autenticato
    if (!event.context.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autenticato'
        })
    }

    const returnedUser = {
        id: event.context.user['id'],
        name: event.context.user['name'],
        username: event.context.user['username'],
        role: event.context.user['role'],
        is_active: event.context.user['is_active'],
        last_login_at: event.context.user['last_login_at'],
    }

    return {
        user: returnedUser
    }
})