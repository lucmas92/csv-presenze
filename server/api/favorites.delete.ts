import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifichiamo che l'utente sia autenticato tramite Supabase Auth
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    const body = await readBody(event)
    const currentUser = event.context.user
    const { favorite_user_id } = body

    if (!currentUser?.id || !favorite_user_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Parametri mancanti per la cancellazione'
        })
    }

    // 2. Inizializziamo il client Supabase con il contesto dell'utente loggato
    const client = await serverSupabaseClient(event)

    // 3. Eseguiamo la DELETE con doppio filtro WHERE (user_id AND favorite_user_id)
    const { error } = await client
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('favorite_user_id', favorite_user_id)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante la rimozione del preferito: ${error.message}`
        })
    }

    return { success: true }
})