import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const currentUser = event.context.user
    const favorite_user_id = body?.favorite_user_id

    if (!currentUser?.id || !favorite_user_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Dati mancanti per l\'operazione'
        })
    }

    // 1. Inizializziamo il client Supabase
    const client = await serverSupabaseClient(event)

    // 2. Inseriamo il record nella tabella user_favorites
    const { error } = await client
        .from('user_favorites')
        .insert({
            user_id: currentUser.id,
            favorite_user_id: favorite_user_id
        })

    // 3. Gestione degli errori Supabase/PostgreSQL
    if (error) {
        // Codice PostgreSQL 23505 = unique_violation (chiave duplicata)
        if (error.code === '23505') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Preferito già registrato'
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante il salvataggio del preferito: ${error.message}`
        })
    }

    return { success: true }
})