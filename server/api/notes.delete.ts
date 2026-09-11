import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifica dell'autenticazione utente
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    const { user_id, date } = await readBody(event)

    if (!user_id || !date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Parametri mancanti (user_id o date)'
        })
    }

    // 2. Client Supabase basato sulla sessione corrente
    const client = await serverSupabaseClient(event)

    // 3. Esecuzione DELETE con filtri concatenati (.eq per user_id AND date)
    const { error } = await client
        .from('notes')
        .delete()
        .eq('user_id', user_id)
        .eq('date', date)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante la cancellazione della nota: ${error.message}`
        })
    }

    return { deleted: true }
})