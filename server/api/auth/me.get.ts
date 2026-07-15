// server/api/me.get.ts
export default defineEventHandler((event) => {
    // Se l'utente non esiste nel contesto, significa che non è autenticato
    if (!event.context.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autenticato'
        })
    }

    return {
        user: event.context.user
    }
})