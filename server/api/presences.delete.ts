import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    // 1. Verifica autenticazione utente
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Non autorizzato'
        })
    }

    const body = await readBody(event)
    const { user_id, date } = body

    if (!user_id || !date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Parametri obbligatori mancanti (user_id o date)'
        })
    }

    // 2. Client Supabase basato sulla sessione utente corrente
    const client = await serverSupabaseClient(event)

    // 3. Esecuzione DELETE con filtri concatenati per user_id e date
    const { error } = await client
        .from('presences')
        .delete()
        .eq('user_id', user_id)
        .eq('date', date)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Errore durante l'eliminazione della presenza: ${error.message}`
        })
    }

    return { success: true }
})